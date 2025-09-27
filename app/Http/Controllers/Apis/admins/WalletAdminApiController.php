<?php

namespace App\Http\Controllers\Apis\Admins;
use App\Http\Controllers\Controller;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletHistory;

class WalletAdminApiController extends Controller
{
    public function show(Request $request) {
        try{
            $history = WalletHistory::with('wallet.user')->where('role', WalletHistory::ROLE_ADD)->where('type', WalletHistory::TYPE_TOPUP)->orderBy('created_at', 'desc')->get();
            $history->transform(function($item) {
                return [
                    'id' => $item->id,
                    'wallet_id' => $item->wallet_id,
                    'user' => [
                        'id' => $item->wallet->user->id,
                        'name' => $item->wallet->user->name,
                        'username' => $item->wallet->user->username,
                        'email' => $item->wallet->user->email,
                    ],
                    'change_amount' => $item->change_amount,
                    'role' => $item->role,
                    'role_text' => $item->role_text,
                    'type' => $item->type,
                    'type_text' => $item->type_text,
                    'description' => $item->description,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            });
            return response()->json([
                'message' => 'สำเร็จ',
                'data' => $history,
                'code' => 200
            ], 200);
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
}
