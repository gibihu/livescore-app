<?php

namespace App\Http\Controllers\Apis;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Users\WalletController;
use App\Models\PackPoints;
use App\Models\Users\Wallet;
use App\Models\Users\WalletHistory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use RoundingMode;

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
        }catch (Exception $e) {
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


        }catch (Exception $e) {
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

    public function generatePackage(Request $request){
        try{
            $packs = [];
            for ($i = 0; $i < 4; $i++) {
                $pack = PackPoints::create([
                    'id' => Str::uuid(),
                    'points' => rand(100, 1000),
                    'price' => rand(10, 100),
                    'published' => true,
                ]);
                $packs[] = $pack;
            }

            if(count($packs) > 0){
                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => $packs,
                    'code' => 200
                ], 200);
            }else{
                throw new Exception("ไม่สามารถสร้างแพ็คเกจได้!");
            }
        }catch (Exception $e) {
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

    public function incomeToPoint(Request $request)
    {
        try{
            $income = (int) $request->amount ?? 0;
            $trans = (float) $request->summary;
            $user = $request->user();
            if(WalletController::ActionsPoint($user->id, -$income, WalletHistory::TYPE_REMOVED, "แปลงรายได้เป็นพอยต์ $income >> $trans"))
            {
                if(WalletController::ActionsPoint($user->id, $trans, WalletHistory::TYPE_BONUS, "ได้รับพอยต์จากการแปลงรายได้จำนวน $trans พอยต์"))
                {
                    return response()->json([
                        'message' => 'สำเร็จ',
                        'data' => $income,
                        'code' => 200
                    ], 200);
                }
            }
            throw new Exception("ไม่สามารถบันทึกหรือแปลงได้");
        }catch (Exception $e) {
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
