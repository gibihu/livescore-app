<?php

use App\Helpers\ConJobHelper;
use App\Models\Football\Competition;
use App\Models\Football\Country;
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
    Log::info('=== Start Update Fixture Job ===');
    try{
        $API_KEY = env('LIVE_SCORE_API_KEY');
        $API_SECRET = env('LIVE_SCORE_API_SECRET');
        $LANG = env('APP_LOCALE');
        $date = Carbon::tomorrow()->format('Y-m-d');

        $config = new stdClass();
        $config->next_page = 'have next';
        $config->page = 1;
        while($config->next_page !== false){
            $response = Http::get('https://livescore-api.com/api-client/fixtures/list.json', [
                'key' => $API_KEY,
                'secret' => $API_SECRET,
                'lang' => $LANG,
                'date' => $date,
                'page' => $config->page,
            ]);
            if ($response->getStatusCode() === 200) {
                $data = $response->object();
                if ($data->success) {
                    if (!empty($data->data->fixtures)) {
                        $fixture = $data->data->fixtures;
                        foreach ($fixture as $item) {
                            $match = Matchs::where('fixture_id', $item->id)->first() ?? new Matchs;

                            $match->fixture_id = $item->id ?? $match->fixture_id;
                            $match->round = $item->round ?? $match->round;

                            $utcDateTime = Carbon::parse(($item->date) . ' ' . ($item->time), 'UTC');
                            $bangkokDateTime = $utcDateTime->setTimezone('Asia/Bangkok');
                            $match->date = $bangkokDateTime->format('Y-m-d');
                            $match->time = $bangkokDateTime->format('H:i:s');

                            $match->location = $item->location ?? $match->location;
                            $match->odds = $item->odds ?? $match->odds;
                            $match->group_id = $item->group_id ?? $match->group_id;

                            if (!empty($item->away)) {
                                $team = Team::where('team_id', $item->away->id)->first() ?? new Team;
                                $team->team_id = $item->away->id;
                                $team->logo = $item->away->logo;
                                $team->name = $item->away->name ?? $team->name;
                                if(preg_match('/\p{Thai}/u', $item->away->name)){
                                    $team->name = $item->away->name;
                                }
                                $team->country_id = Country::where('country_id', $item->away->country_id)->value('id');
                                $team->stadium = $item->away->stadium ?? $team->stadium;
                                $team->save();
                                $match->away_team_id = $team->id;
                            }
                            if (!empty($item->home)) {
                                $team = Team::where('team_id', $item->home->id)->first() ?? new Team;
                                $team->team_id = $item->home->id;
                                $team->logo = $item->home->logo;
                                $team->name = $item->home->name ?? null;
                                $team->name = $item->home->name ?? $team->name;
                                if(preg_match('/\p{Thai}/u', $item->home->name)){
                                    $team->name = $item->home->name;
                                }
                                $team->country_id = Country::where('country_id', $item->away->country_id)->value('id');
                                $team->stadium = $item->home->stadium ?? null;
                                $team->save();
                                $match->home_team_id = $team->id;
                            }
                            if (!empty($item->federation) && $item->federation != null) {
                                $feder = Federation::where('federation_id', $item->federation->id)->first() ?? new Federation;
                                $feder->federation_id = $item->federation->id;
                                $feder->name = $item->federation->name;
                                if(preg_match('/\p{Thai}/u', $feder->name)){
                                    $feder->name_th = $feder->name;
                                }
                                $feder->save();
                                $match->federation_id = $feder->id;
                            }

                            if(!empty($item->country) && $item->country != null) {
                                $country = Country::where('country_id', $item->country->id)->first() ?? new Country;
                                $country->country_id = $item->country->id;
                                $country->name = $item->country->name;
                                if(preg_match('/\p{Thai}/u', $country->name)){
                                    $country->name_th = $country->name;
                                }
                                $country->uefa_code = $item->country->uefa_code ?? null;
                                $country->fifa_code = $item->country->fifa_code ?? null;
                                $country->flag = $item->country->flag ?? null;
                                $country->is_real = $item->country->is_real ?? null;
                                $country->save();
                                $match->country_id = $country->id;
                            }

                            if (!empty($item->competition) && $item->competition != null) {
                                $league = Competition::where('competition_id', $item->competition->id)->first() ?? new Competition;
                                $league->competition_id = $item->competition->id;
                                $league->name = $item->competition->name;
                                if(preg_match('/\p{Thai}/u', $league->name)){
                                    $league->name_th = $league->name;
                                }
                                $league->is_league = $item->competition->is_league ?? $league->is_league;
                                $league->is_cup = $item->competition->is_cup ?? $league->is_cup;
                                $league->tier = $item->competition->tier ?? $league->tier;
                                $league->has_groups = $item->competition->has_groups ?? $league->has_groups;
                                $league->national_teams_only = $item->competition->national_teams_only ?? $league->national_teams_only;
                                $league->active = $item->competition->active ?? $league->active;
                                $league->save();
                                $match->competition_id = $league->id;
                            }

                            if ($match->save()) {
                                Log::info('บันทกสำเร็จ', ['match' => $match->id]);
                            }else{
                                Log::error('บันทึไม่ผ่าน', ['match' => $match->id ?? $item->id]);
                            }
                        }
                        Log::info("สำเร็จหมดแล้ว [page: $config->page]");
                        Log::info("Data",  [json_encode($response->json())]);
                    }
                    $config->next_page = $data->data->next_page ?? false;
                    $config->page = $data->data->next_page !== false ? $config->page + 1 : $config->page;
                }
            }else{
                Log::error('Api call failed');
            }
        }
    }catch (Throwable $e) {
        Log::error('Error in Update Fixture Job', [
            'message' => $e->getMessage(),
            'trace'   => $e->getTraceAsString(),
        ]);
    }
    Log::info('=== End Update Fixture Job ===');
    Log::info('');
})->daily();


Schedule::call(function(){
    Log::info('');
    Log::info('=== Start Update Live Job ===');

    try {
        $API_KEY = env('LIVE_SCORE_API_KEY');
        $API_SECRET = env('LIVE_SCORE_API_SECRET');
        $LANG = env('APP_LOCALE');

        $response = Http::get('https://livescore-api.com/api-client/matches/live.json', [
            'key' => $API_KEY,
            'secret' => $API_SECRET,
            'lang' => $LANG,
        ]);

        if ($response->getStatusCode() === 200) {
            Log::info('รับ api');
            $data = $response->object();
            if ($data->success && !empty($data->data->match)) {
                Log::info('มีข้อมูล');
                $matches = collect($data->data->match);

                Matchs::where('live_status', 'LIVE')->update(['live_status' => 'END_LIVE']);

                // บันทึกหรืออัพเดทข้อมูลแมช
                $matches->each(function ($item) {
                    $match = Matchs::where('match_id', $item->id)->whereOr('fixture_id',$item->fixture_id)->first() ?? new Matchs;
                    $match->match_id = $item->id ?? null;
                    $match->fixture_id = $item->fixture_id ?? null;
                    $match->live_status = 'LIVE';
                    $match->competition_id = $item->competition ? ConJobHelper::CheckCompetitionAndInsert($item->competition)->id : null;
                    $match->country_id = $item->country ? ConJobHelper::CheckCountryAndInsert($item->country)->id : null;
                    $match->home_team_id = $item->home ? ConJobHelper::CheckTeamAndInsert($item->home)->id : null;
                    $match->away_team_id = $item->away ? ConJobHelper::CheckTeamAndInsert($item->away)->id : null;
                    $match->federation_id = $item->federation ? ConJobHelper::CheckFederationAndInsert($item->federation)->id : null;
                    $match->status = $item->status ?? null;
                    $match->location = $item->location ?? null;
                    $match->odds = $item->odds ?? null;
                    $match->scores = $item->scores ?? null;
                    $match->outcomes = $item->outcomes ?? null;

                    $match->time = $item->time;
                    $match->scheduled = Carbon::parse($item->scheduled, 'UTC')->setTimezone('Asia/Bangkok')->format('H:i:s');
                    $match->added = Carbon::parse($item->added, 'UTC')->setTimezone('Asia/Bangkok');
                    $match->last_changed = Carbon::parse($item->last_changed, 'UTC')->setTimezone('Asia/Bangkok');

                    $match->urls = $item->urls ?? null;
                    if($match->save()){
                        Log::info('บันทกสำเร็จ', ['match' => $match->id]);
                    }else{
                        Log::error('บันทึไม่ผ่าน', ['match' => $match->id ?? $item->id]);
                    }
                });

                Log::info('สำเร็จหมดแล้ว', [json_encode($response->json())]);
            }
        }else{
            Log::error('Api Fixture error', [json_encode($response->json())]);
        }
    } catch (\Throwable $e) {
        Log::error('Error in Match Job', [
            'message' => $e->getMessage(),
            'trace'   => $e->getTraceAsString(),
        ]);
    }

    Log::info('=== End Match Job ===');
    Log::info('');
})->everyMinute();
