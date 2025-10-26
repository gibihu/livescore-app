<?php

namespace App\Http\Controllers\Apis\Dash\Admin\User;

use App\Http\Controllers\Controller;
use App\Models\Users\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

class UserAdminDashApiController extends Controller
{

    public function store(Request $request, $id)
    {
        try{
            $request->validate([
                'name' => 'required',
                'username' => 'required',
                'email' => 'required|email',
                'role' => 'required',
            ]);

            $name = $request->name;
            $username = $request->username;
            $email = $request->email;
            $verified = $request->email_verified ?? false;
            $role = $request->role ?? 1;
            $custom_rate = $request->custom_rate ?? 0;

            $user = User::find($id);
            if($user){
                if(!User::where('username', '!=', $user->username)->where('username', $username)->exists()){
                    $user->username = $username ?? $user->username;
                }else{
                    throw new Exception("มีชื่อผู้ใช้นี้แล้ว");
                }

                $user->name = $name ?? $user->name;
                $user->email = $email ?? $user->email;
                $user->role = $role ?? $user->role;
                $user->custom_rate = $custom_rate ?? $user->custom_rate;
                $user->email_verified_at = $verified ? Carbon::now() : null;
                if($user->save()){
                    return response()->json([
                        'message' => 'อัพเดทสำเร็จ',
                        'data' => $user,
                        'code' => 200,
                    ], 200);
                }else{
                    throw new Exception("ไม่สามารถบันทึกได้");
                }
            }else{
                throw new Exception("ไม่พบผู้ใช้งานรายนี้");
            }

            throw new Exception("เกิดข้อผิดพลาดบางอย่าง");
        }catch (Exception $e){
            return response()->json([
                'message' => $e->getMessage(),
                'code' => 500,
            ], 500);
        }
    }
}
