<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::user();


        if (!$user) {
            // ถ้าไม่ login
            return redirect()->route('login');
        }

        // สมมติ User model มี accessor ->roles_text
        // $userRoles = explode(',', $user->roles_text); // ['user','admin','dev']

        // เช็คว่ามี role ตรงกับที่กำหนดไหม
        // if (!array_intersect($roles, $user->role_text)) {
        // dd($roles[0] , $user->role_text);
        if ($roles[0] !== $user->role_text) {
            abort(403, 'Unauthorized.'); // หรือ redirect ไปหน้าอื่น
        }

        return $next($request);
    }
}
