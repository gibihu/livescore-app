<?php

namespace App\Http\Controllers\Apis;
use App\Http\Controllers\Controller;
use App\Models\Follow;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\User;

class FollowApiController extends Controller
{
    public function update($user_id){
        try{
            $creater = User::find($user_id);
            $fan = Auth::user();
            $follow = Follow::where('follower_id', $fan->id)->where('followed_id', $creater->id)->first();
            if($follow){
                $follow->delete();
                return response()->json([
                    'message' => 'เลิดติดตามแล้ว',
                    'code' => 200,
                ], 200);
            }else{
                $create = new Follow();
                $create->followed_id = $fan->id;
                $create->followed_id = $creater->id;
                $create->save();
                return response()->json([
                    'message' => 'ติดตามแล้ว',
                    'data' => $creater,
                    'code' => 201,
                ], 201);
            }

        }catch (Exception $e) {
            $response = [
                'message' => $e->getMessage() ?? 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }
}
