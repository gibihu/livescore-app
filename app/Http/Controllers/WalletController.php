<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\Wallet;
use App\Models\WalletHistory;

class WalletController extends Controller
{
    public static function ActionsPoint($user_id, $points, $type, $description){
        try{
            if($user_id && $points){
                try{
                    $wallet = Wallet::where('user_id', $user_id)->firstOrFail();
                    if($wallet){
                        $history = self::history($wallet->id, $points, $type, $description);
                        if($history){
                            $wallet->update([
                                'points' => $wallet->points + $points,
                            ]);
                            if($wallet){
                                return $wallet;
                            }
                        }
                    }
                    throw new Exception('มีบางอย่างทำงานผิดพลาด');
                }catch(ModelNotFoundException $e){
                    throw $e;
                }
            }else{
                throw new Exception('เงื่อนไขไม่ครบ');
            }
        }catch (Exception $e) {
            throw $e;
        }
    }


    private static function history($wallet_id, $amount, $type = WalletHistory::TYPE_BONUS, $description = ''){
        try{
            $history = WalletHistory::create([
                'id' => Str::uuid(),
                'wallet_id' => $wallet_id,
                'change_amount' => $amount,
                'role' => $amount >= 0 ? 1 : 2,
                'type' => $type,
                'description' => $description
            ]);
            return $history;
        }catch (Exception $e) {
            throw $e;
        }
    }
}
