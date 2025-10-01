<?php

use App\Models\Football\Competition;
use App\Models\Football\Competition as league;
use App\Models\Football\Country;
use App\Models\Football\Federation as Feder;
use App\Models\Football\Matchs;
use App\Models\Football\Seasons;
use App\Models\Football\Team;
use App\Models\Football\Federation;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;


Schedule::call(function(){
    try{
        $API_KEY = env('LIVE_SCORE_API_KEY');
        $API_SECRET = env('LIVE_SCORE_API_SECRET');
        $LANG = env('APP_LOCALE');

        $response = Http::get('https://livescore-api.com/api-client/competitions/list.json', [
            'key' => $API_KEY,
            'secret' => $API_SECRET,
            'lang' => $LANG,
        ]);

        if ($response->successful()) {
            $data = $response->object();

            $leagues = $data->data->competition;

            foreach($leagues as $item){
                $league = League::where('competition_id', $item->id)->first() ?? new League;

                if(!empty($item->federations)){
                    $feders = $item->federations;
                    foreach($feders as $feder){
                        $exists = Feder::where('federation_id', $feder->id)->first() ?? new Feder;
                        $exists->federation_id = (int) $feder->id;
                        $exists->name = $feder->name;
                        $exists->save();
                        $league->federation_id = (int) $feder->id;
                    }
                }
                if(!empty($item->countries)){
                    $countrys = $item->countries;
                    foreach($countrys as $country){
                        $exists = Country::where('country_id', $country->id)->first() ?? new Country;

                        $exists->country_id = (int) $country->id;
                        $exists->name = $country->name;
                        $exists->flag = $country->flag;
                        $exists->fifa_code = $country->fifa_code;
                        $exists->uefa_code = $country->uefa_code;
                        $exists->is_real = (int) $country->is_real;
                        $exists->save();
                        $league->country_id = (int) $country->id;
                    }
                }
                if(!empty($item->season)){
                    $ss = $item->season;
                    $exists = Seasons::where('season_id', $ss->id)->first() ?? new Seasons;

                    $exists->season_id = (int) $ss->id;
                    $exists->name = $ss->name;
                    $exists->start = $ss->start;
                    $exists->end = $ss->end;
                    $exists->save();
                    $league->season_id = (int) $ss->id;
                }


                $league->competition_id = (int) $item->id;
                $league->name = $item->name;
                $league->is_league = (int) $item->is_league;
                $league->is_cup = (int) $item->is_cup;
                $league->tier = (int) $item->tier;
                $league->has_groups = (int) $item->has_groups;
                $league->active = (int) $item->active;
                $league->national_teams_only = (int) $item->national_teams_only;
                $league->save();

            }
            Log::info('Api is successful');
        }
        Log::error('Api call failed');
    }catch (Throwable $e) {
        Log::error('Error in Update Files Status Job', [
            'message' => $e->getMessage(),
            'trace'   => $e->getTraceAsString(),
        ]);
    }
})->everyTenSeconds();


Schedule::call(function(){
    Log::info('');
    Log::info('=== Start Update Live Job ===');

    try {
        $API_KEY = env('LIVE_SCORE_API_KEY');
        $API_SECRET = env('LIVE_SCORE_API_SECRET');
        $LANG = env('APP_LOCALE');
        $date = Carbon::now()->format('Y-m-d');

        $data = new stdClass();
        $data->next_page = 'have next';
        while ($data->next_page != false){
            $response = Http::get('https://livescore-api.com/api-client/fixtures/list.json', [
                'key' => $API_KEY,
                'secret' => $API_SECRET,
                'lang' => $LANG,
                'date' => $date
            ]);
            if ($response->getStatusCode() === 200) {
                $data = $response->object();
                if ($data->success) {
                    Log::info('fetch successful');
                    if (!empty($data->data->fixtures)) {
                        $fixture = $data->data->fixtures;
                        foreach($fixture as $item){
                            $has = Matchs::where('fixture_id', $item->id)->first();
                            if($has){ $match = $has; }else{ $match = new Matchs; }

                            $match->fixture_id = $item->id ?? null;
                            $match->match_id = $item->id ?? null;
                            $match->round = $item->round ?? null;
                            $match->date = $item->date ?? null;
                            $match->time = $item->time ?? null;
                            $match->location = $item->location ?? null;
                            $match->odds = $item->odds ?? null;
                            $match->group_id = $item->group_id ?? null;

                            if(!empty($item->away)){
                                $team = Team::where('team_id', $item->away->id)->first() ?? new Team;
                                $team->team_id = $item->away->id;
                                $team->logo = $item->away->logo;
                                $team->name = $item->away->name ?? null;
                                $team->country_id = Country::where('country_id', $item->away->country_id)->first()->id ?? null;
                                $team->stadium = $item->away->stadium ?? null;
                                $team->save();
                                $match->away_team_id = $team->id;
                            }
                            if(!empty($item->home)){
                                $team = Team::where('team_id', $item->home->id)->first() ?? new Team;
                                $team->team_id = $item->home->id;
                                $team->logo = $item->home->logo;
                                $team->name = $item->home->name ?? null;
                                $team->country_id = $item->home->country_id ?? null;
                                $team->stadium = $item->home->stadium ?? null;
                                $team->save();
                                $match->home_team_id = $team->id;
                            }
                            if(!empty($item->federation) && $item->federation != null){
                                $feder = Federation::where('federation_id', $item->federation->id)->first() ?? new Federation;
                                $feder->federation_id = $item->federation->id;
                                $feder->name = $item->federation->name;
                                $feder->save();
                                $match->federation_id = $feder->id;
                            }
                            if(!empty($item->competition) && $item->competition != null){
                                $league = Competition::where('competition_id', $item->competition->id)->first() ?? new Competition;
                                $league->competition_id = $item->competition->id;
                                $league->name = $item->competition->name;
                                $league->is_league = $item->federation->is_league ?? null;
                                $league->is_cup = $item->federation->is_cup ?? null;
                                $league->tier = $item->federation->tier ?? null;
                                $league->has_groups = $item->federation->has_groups ?? null;
                                $league->national_teams_only = $item->federation->national_teams_only ?? null;
                                $league->active = $item->federation->active ?? null;
                                $league->save();
                                $match->competition_id = $match->home->id;
                            }

                            if($match->save()){
                                Log::info('Api Fixture success', [
                                    'id' => $match->id,
                                    'fixture_id' => $match->fixture_id,
                                ]);
                            }
                        };
                    }
                }
            }
        }
        Log::error('Api Fixture error', [json_encode($response->json())]);
    } catch (\Throwable $e) {
        Log::error('Error in Update Files Status Job', [
            'message' => $e->getMessage(),
            'trace'   => $e->getTraceAsString(),
        ]);
    }

    Log::info('=== End Update Files Status Job ===');
    Log::info('');
});
//Schedule::call(function(){
//    Log::info('');
//    Log::info('=== Start Update Live Job ===');
//
//    try {
//        $API_KEY = env('LIVE_SCORE_API_KEY');
//        $API_SECRET = env('LIVE_SCORE_API_SECRET');
//        $LANG = env('APP_LOCALE');
//
//        $response = Http::get('https://livescore-api.com/api-client/matches/live.json', [
//            'key' => $API_KEY,
//            'secret' => $API_SECRET,
//            'lang' => $LANG,
//        ]);
//        if ($response->successful()) {
//            $data = $response->object();
//            if ($data && $data->success) {
//                // ตรวจสอบว่า match มีข้อมูลหรือไม่
//                $matches = $data->data->matches;
//                $hasMatches = isset($matches) && !empty($matches) && is_array($matches) && count($matches) > 0;
//                if ($hasMatches) {
//                    $matches.map(function ($match) {
//                        $match = Matchs::where('match_id',($match->id))->first();
//                        if($match) {
//
//                        }
//                    });
//                }
//            }else{
//                Log::info('api not found', [
//                    'errors' => $response->body(),
//                ]);
//            }
//        }
//    } catch (\Throwable $e) {
//        Log::error('Error in Update Files Status Job', [
//            'message' => $e->getMessage(),
//            'trace'   => $e->getTraceAsString(),
//        ]);
//    }
//
//    Log::info('=== End Update Files Status Job ===');
//    Log::info('');
//})->daily();
