<?php

namespace App\Http\Controllers\Apis;
use App\Http\Controllers\Controller;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\WalletHistory;

class WalletApiController extends Controller
{
    public function showHistory(Request $request) {
        try{
            if(Auth::check()){
                $wallet_id = Auth::user()->wallet->id;
                $history = WalletHistory::where('wallet_id', $wallet_id)->orderBy('created_at', 'DESC')->get();
                if($history){
                    return response()->json([
                        'message' => 'สำเร็จ',
                        'data' => $history,
                        'code' => 200
                    ], 200);
                }
            }

            throw new Exception("ไม่สามารถดำเนินการได้!");
        }catch (\Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
                'request' => $request->all(),
            ];
            return response()->json($response, 200);
        }
    }
}
