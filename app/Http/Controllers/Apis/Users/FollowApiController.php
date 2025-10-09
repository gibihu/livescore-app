<?php

namespace App\Http\Controllers\Apis\Users;
use App\Http\Controllers\Controller;
use App\Models\Users\Follow;
use App\Models\Users\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
                $create->follower_id = $fan->id;
                $create->followed_id = $creater->id;
                $create->save();
                return response()->json([
                    'message' => 'ติดตามแล้ว',
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

    public function following(Request $request, $id)
    {
        try{
            $follow = Follow::with('followed')->where('follower_id', Auth::id())->where('followed_id', $id)->first();

            if($follow){
                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => $follow,
                    'code' => 200,
                ], 200);
            }else{
                return response()->json([
                    'message' => 'ยังไม่ได้ติดตาม',
                    'data' => null,
                    'code' => 404,
                ], 404);
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
