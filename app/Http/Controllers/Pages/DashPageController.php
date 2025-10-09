<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Users\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashPageController extends Controller
{
    public  function  exchangePage(Request $request, $id)
    {
        $trans = Transaction::find($id);
        return Inertia::render('dashboard/admins/exchange/page', compact('trans'));
    }
}
