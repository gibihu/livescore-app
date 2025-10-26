<?php

namespace App\Http\Controllers\Pages\Dash\Users;

use App\Http\Controllers\Controller;
use App\Models\Users\WalletHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

;

class WalletPageController extends Controller
{
    public function index(Request $request)
    {
        $wallet_id = $request->user()->wallet->id;
        $wallet_histories = WalletHistory::where('wallet_id', $wallet_id)->orderBy('created_at', 'DESC')->get();

        return Inertia::render('dashboard/wallet', compact('wallet_histories'));
    }
}
