<?php

namespace App\Http\Controllers\Football;

use App\Http\Controllers\Controller;
use App\Models\Football\Competition;
use App\Models\Football\Federation;
use App\Models\Football\Matchs;
use App\Models\Football\Team;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Exception;

use App\Models\Football\Country;
use App\Models\Football\Seasons;
use stdClass;

class CompetitionController extends Controller
{
    public function index(Request $request){
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
                    $league = Competition::where('competition_id', $item->id)->first() ?? new Competition;

                    if(!empty($item->federations)){
                        $feders = $item->federations;
                        foreach($feders as $feder){
                            $exists = Federation::where('federation_id', $feder->id)->first() ?? new Federation;
                            $exists->federation_id = (int) $feder->id;
                            $exists->name = $feder->name;
                            $exists->save();
                            $league->federation_id = $exists->id;
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
                            $league->country_id = $exists->id;
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
                        $league->season_id = $exists->id;
                    }


                    $league->competition_id = $item->id;
                    $league->name = $item->name;
                    $league->is_league = $item->is_league;
                    $league->is_cup = $item->is_cup;
                    $league->tier = (int) $item->tier;
                    $league->has_groups = $item->has_groups;
                    $league->active = $item->active;
                    $league->national_teams_only = $item->national_teams_only;
                    $league->save();

                }

                return response()->json($leagues, 200);
            }

            return response()->json($response, 200);
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }

    public function show($id){
        try{
            $leagues = League::find($id);
            return response()->json($leagues, 200);
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }


    public function all(){
        try{
            $leagues = League::get();
            $leagues->transform(function($item){
                $item->session = Seasons::find($item->season_id);
                $item->federations = Feder::whereIn('id', [$item->federation_id])->get();
                $item->countries = Country::whereIn('id', [$item->country_id])->get();

                return $item;
            });
            return response()->json($leagues, 200);
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }






    public function fixture()
    {
        try{
            $API_KEY = env('LIVE_SCORE_API_KEY');
            $API_SECRET = env('LIVE_SCORE_API_SECRET');
            $LANG = env('APP_LOCALE');
            $date = Carbon::tomorrow()->format('Y-m-d');

            $finish = [];

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
                                $match->date = $item->date ?? $match->date;
                                $match->time = $item->time ?? $match->time;
                                $match->location = $item->location ?? $match->location;
                                $match->odds = $item->odds ?? $match->odds;
                                $match->group_id = $item->group_id ?? $match->group_id;

                                if (!empty($item->away)) {
                                    $team = Team::where('team_id', $item->away->id)->first() ?? new Team;
                                    $team->team_id = $item->away->id;
                                    $team->logo = $item->away->logo;
                                    $team->name = $item->away->name ?? $team->name;
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
                                    $team->country_id = Country::where('country_id', $item->away->country_id)->value('id');
                                    $team->stadium = $item->home->stadium ?? null;
                                    $team->save();
                                    $match->home_team_id = $team->id;
                                }
                                if (!empty($item->federation) && $item->federation != null) {
                                    $feder = Federation::where('federation_id', $item->federation->id)->first() ?? new Federation;
                                    $feder->federation_id = $item->federation->id;
                                    $feder->name = $item->federation->name;
                                    $feder->save();
                                    $match->federation_id = $feder->id;
                                }

                                if(!empty($item->country) && $item->country != null) {
                                    $country = Country::where('country_id', $item->country->id)->first() ?? new Country;
                                    $country->country_id = $item->country->id;
                                    $country->name = $item->country->name;
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
                                    $league->is_league = $item->federation->is_league ?? $league->is_league;
                                    $league->is_cup = $item->federation->is_cup ?? $league->is_cup;
                                    $league->tier = $item->federation->tier ?? $league->tier;
                                    $league->has_groups = $item->federation->has_groups ?? $league->has_groups;
                                    $league->national_teams_only = $item->federation->national_teams_only ?? $league->national_teams_only;
                                    $league->active = $item->federation->active ?? $league->active;
                                    $league->save();
                                    $match->competition_id = $league->id;
                                }

                                if ($match->save()) {
                                    $finish[] = [
                                        'id' => $match->id,
                                    ];
                                }
                            }
                        }
                        $config->next_page = $data->data->next_page ?? false;
                        $config->page = $data->data->next_page !== false ? $config->page + 1 : $config->page;
                    }
                }
            }
            return response()->json([$finish], 201);
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }


    public function match()
    {
        try{
            requ
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }
}
