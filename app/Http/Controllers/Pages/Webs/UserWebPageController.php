<?php

namespace App\Http\Controllers\Pages\Webs;

use App\Http\Controllers\Controller;
use App\Models\Users\User;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserWebPageController extends Controller
{
    public function view(Request $request, $id)
    {
        try{
            $user = User::select('id', 'name', 'username', 'tier', 'rank_id')->find($id);

            return Inertia::render('users/profile', compact('user'));
        }catch (Exception $e){
            abort(404);
        }
    }
}
