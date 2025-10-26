<?php

namespace App\Http\Controllers\Pages\Dash\Admins;

use App\Http\Controllers\Controller;
use App\Models\Users\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class UserAdminDashController extends Controller
{
    public function table()
    {
        $users = User::with('wallet')->where('id', '!=', Auth::id())->get();

        return Inertia::render('dashboard/admins/users/table', compact('users'));
    }

    public function setting(Request $request, $id)
    {
        $user = User::where('id', '!=', Auth::id())->find($id);

        return Inertia::render('dashboard/admins/users/setting', compact('user'));
    }

}
