<?php

namespace App\Http\Controllers\Apis\Football;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Exception;

use App\Models\Football\Competition as league;
use App\Models\Football\Federation as Feder;
use App\Models\Football\Country;
use App\Models\Football\Seasons;

class CompetitionApiController extends Controller
{
    public function all(Request $request){
        try{
            if(isset($request->filter_ids)){
                $ids = explode(',', $request->filter_ids);
                $leagues = League::whereIn('id', $ids)->get();
            }else{
                $leagues = League::get();
            }
            $leagues->transform(function($item){
                $item->session = Seasons::find($item->season_id);
                $item->federations = Feder::whereIn('id', [$item->federation_id])->get();
                $item->countries = Country::whereIn('id', [$item->country_id])->get();

                return $item;
            });
            return response()->json([
                'message' => 'สำเร็จ',
                'data' => $leagues,
                'code' => 200
            ], 200);
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
