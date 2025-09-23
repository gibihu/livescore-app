<?php

namespace App\Http\Controllers\Apis;
use App\Http\Controllers\Controller;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\User;
use App\Helpers\UserHelper;

class UserApiController extends Controller
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

    public function onec(Request $request, $id, $routeName = null){
        try{
            if(!Auth::check() || Auth::user()->role_text !== 'admin'){
                $response = [
                    'message' => 'คุณไม่มีสิทธิในการเข้าถึง',
                    'code' => 403,
                ];
                if(env('APP_DEBUG')) $response['debug'] = [
                    'message' => $e->getMessage(),
                    'auth' => Auth::user(),
                ];
                return response($response, 403)->json();
            }
            if(isset($id)){
                $user = User::find($id);
                if($user){
                    return response([
                        'message' => 'สำเร็จ',
                        'data' => $user,
                        'code' => 200
                    ], 200)->json();
                }
            }
            throw new Exception("ไม่สามารถหารด้วยศูนย์ได้!");
        }catch (\Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
                'request' => $request->all(),
            ];
            return response($response, 500)->json();
        }
    }
}
