<?php

namespace App\Http\Controllers\Apis;
use App\Http\Controllers\Controller;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\PackPoints;

class PointsApiController extends Controller
{
    public function show(Request $request) {
        try{
            $points = PackPoints::where('published', 1)->orderBy('points', 'ASC')->get();
            if($points){
                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => $points,
                    'code' => 200
                ], 200);
            }else{
                throw new Exception("ไม่สามารถหารด้วยศูนย์ได้!");
            }
        }catch (\Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
                'request' => $request->all(),
            ];
            return response()->json($response, 500);
        }
    }

    public function update(Request $request, $id){
        try{
            $req = $request->query();
            $points = $req['points'] ?? null;
            $price = $req['price'] ?? null;
            if(!isset($id)){
                throw new Exception("ไม่สามารถหารด้วยศูนย์ได้!");
            }

            $update = [];
            if(isset($points)) $update['points'] = $points;
            if(isset($price)) $update['price'] = $price;

            return response()->json([
                'message' => 'สำเร็จ',
                'data' => $points,
                'code' => 200
            ], 200);


        }catch (\Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
                'request' => $request->all(),
            ];
            return response()->json($response, 500);
        }
    }
}
