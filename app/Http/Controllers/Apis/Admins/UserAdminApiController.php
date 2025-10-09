<?php

namespace App\Http\Controllers\Apis\Admins;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Models\Users\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserAdminApiController extends Controller
{
    public function show(Request $request) {
        try{
            if(Auth::check()){

                $user = User::with('wallet')->where('id', '!=', Auth::id())->get();
                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => $user,
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

    public function update(Request $request){
        try{
            $id = $request->id;
            $role = $request->role;
            $role_int = UserHelper::toModelRole($role);
            if(isset($role) && isset($role_int) && User::where('id', $id)->update(['role' => $role_int])){
                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => [
                        'role' => $role,
                        'role_int' => $role_int,
                    ],
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

    public function update_tier(Request $request, $user_id){
        try{
            $user = User::find($user_id ?? $request->id);
            if($user){
                $tier = $request->tier ?? $request->tier;
                $exp = $request->exp ?? $user->exp;

                $user->tier = UserHelper::toModelTire($tier);
                $user->exp = $exp;
                if($user->save()){
                    return response()->json([
                        'message' => 'สำเร็จ',
                        'data' => [
                            'tier' => $user->tier,
                            'tier_text' => $user->tier_text,
                            'exp' => $user->exp,
                        ],
                        'code' => 200
                    ], 200);
                }else{
                    throw  new  Exception('ไม่สามารถบันทึกได้');
                }
            }else{
                return response()->json([
                    'message' => 'ไม่พบผู้ใช้',
                    'code' => 404,
                ], 404);
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
}
