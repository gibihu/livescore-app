<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Users\Wallet;
use App\Models\Users\WalletHistory;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Str;

class WalletController extends Controller
{
    public static function ActionsPoint($user_id, $points, $type, $description, $reference = []){
        try{
            if($user_id && $points){
                try{
                    $wallet = Wallet::where('user_id', $user_id)->firstOrFail();
                    if($wallet){
                        $history = self::history($wallet->id, $points, $type, $description, $reference);
                        if($history){
                            if($type == WalletHistory::TYPE_INCOME || $type == WalletHistory::TYPE_REMOVED) {
                                $wallet->income = $wallet->income + $points;
                            }else{
                                $wallet->points = $wallet->points + $points;
                            }
                            if($wallet->save()){
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


    private static function history($wallet_id, $amount, $type = WalletHistory::TYPE_BONUS, $description = '', $reference = []){
        try{
            $history = WalletHistory::create([
                'id' => Str::uuid(),
                'wallet_id' => $wallet_id,
                'change_amount' => $amount,
                'role' => $amount >= 0 ? 1 : 2,
                'type' => $type,
                'description' => $description,
                'references' => $reference,
            ]);
            return $history;
        }catch (Exception $e) {
            throw $e;
        }
    }
}
