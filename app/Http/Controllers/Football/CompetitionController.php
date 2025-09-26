<?php

namespace App\Http\Controllers\Football;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Exception;

use App\Models\Football\Competition as league;
use App\Models\Football\Federation as Feder;
use App\Models\Football\Country;
use App\Models\Football\Seasons;

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
                    $exists = League::find($item->id);
                    if(!$exists){
                        League::create([
                            'id' => (int) $item->id,
                            'name' => $item->name,
                            'is_league' => (int) $item->is_league,
                            'is_cup' => (int) $item->is_cup,
                            'tier' => (int) $item->tier,
                            'has_groups' => (int) $item->has_groups,
                            'active' => (int) $item->active,
                            'national_teams_only' => (int) $item->national_teams_only,
                            'country_id' => !empty($item->countries) ?? (int) $item->countries[0]->id,
                            'season_id' => (int) $item->season->id,
                            'federation_id' => !empty($item->federations) ?? (int) $item->federations[0]->id,
                        ]);
                    }
                    if(!empty($item->federations)){
                        $feders = $item->federations;
                        foreach($feders as $feder){
                            $exists = Feder::find($feder->id);
                            if(!$exists){
                                Feder::create([
                                    'id' => (int) $feder->id,
                                    'name' => $feder->name
                                ]);
                            }
                        }
                    }
                    if(!empty($item->countries)){
                        $countrys = $item->countries;
                        foreach($countrys as $country){
                            $exists = Country::find($country->id);
                            if(!$exists){
                                Country::create([
                                    'id' => (int) $country->id,
                                    'name' => $country->name,
                                    'flag' => $country->flag,
                                    'fifa_code' => $country->fifa_code,
                                    'uefa_code' => $country->uefa_code,
                                    'is_real' => (int) $country->is_real,
                                ]);
                            }
                        }
                    }
                    if(!empty($item->season)){
                        $ss = $item->season;
                        $exists = Seasons::find((int) $ss->id);
                        if(!$exists){
                            Seasons::create([
                                'id' => (int) $ss->id,
                                'name' => $ss->name,
                                'start' => $ss->start,
                                'end' => $ss->end,
                            ]);
                        }
                    }

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
}
