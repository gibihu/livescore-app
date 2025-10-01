<?php

use App\Models\Football\Competition;
use App\Models\Football\Matchs;
use App\Models\Football\Team;
use App\Models\Football\Federation;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;


Schedule::call(function(){
    Log::info('');
    Log::info('=== Start Update Live Job ===');

    try {
        $API_KEY = env('LIVE_SCORE_API_KEY');
        $API_SECRET = env('LIVE_SCORE_API_SECRET');
        $LANG = env('APP_LOCALE');
        $date = Carbon::now()->format('Y-m-d');

        $response = Http::get('https://livescore-api.com/api-client/fixtures/list.json', [
            'key' => $API_KEY,
            'secret' => $API_SECRET,
            'lang' => $LANG,
            'date' => $date
        ]);

        // ตรวจสอบสถานะ
        if ($response->getStatusCode() === 200) {
            $data = $response->object();
            Log
            if($data->success){
                $fixture = collect($data->data->fixtures);
                if(!empty($fixture)){
                    $fixture->each(function ($item){
                        $has = Matchs::wher('fixture_id', $item->id)->first();
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
                            $team->country_id = $item->away->country_id ?? null;
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
                    });
                }
            }
        }
    } catch (\Throwable $e) {
        Log::error('Error in Update Files Status Job', [
            'message' => $e->getMessage(),
            'trace'   => $e->getTraceAsString(),
        ]);
    }

    Log::info('=== End Update Files Status Job ===');
    Log::info('');
})->everyTenSeconds();
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
