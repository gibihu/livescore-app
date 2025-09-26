<?php

namespace App\Http\Controllers\Apis;
use App\Http\Controllers\Controller;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;

use App\Http\Controllers\LiveScoreController as LiveController;

use App\Models\User;
use App\Models\Matchs;

class LiveScoreApiController extends Controller
{

    public function LiveScore(){
        try{
            $data = LiveController::LiveScore();
            if (!$data) throw new Exception("ไม่สามารถดำเนินการได้!");
            return response()->json([
                'message' => 'สำเร็จ',
                'data' => $data->data,
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


    public function event(Request $request){
        try{
            $match_id = $request->id ?? 0;
            $status = $request->status ?? 'FINISHED';
            try{
                $data = LiveController::LiveEvent($match_id, $status);
                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => $data,
                    'code' => 200
                ], 200);
            }catch (\Throwable $e) {
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
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
                'request' => $request->all(),
                'data' => $data,
            ];
                return response()->json($response, 500);
        }
    }

    public function history(Request $request){
        try{
            $page = $request->page ?? 1;
            $data = LiveController::HistoryScore($page);
            if (!$data) throw new Exception("ไม่สามารถดำเนินการได้!");
            return response()->json([
                'message' => 'สำเร็จ',
                'data' => $data->data,
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
            return response($response, 500)->json();
        }
    }

    public function match_detail($id){
        try{
            $data = Matchs::where('match_id', $id)->first();
            if (!$data) throw new Exception("ไม่สามารถดำเนินการได้!");
            return response()->json([
                'message' => 'สำเร็จ',
                'data' => json_decode($data->json),
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

    public function fixture(Request $request){
        try{
            $date = $request->date ?? Carbon::tomorrow();
            $return = LiveController::getFixture($date);

            return response()->json([
                'message' => 'สำเร็จ',
                'data' => $return,
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
