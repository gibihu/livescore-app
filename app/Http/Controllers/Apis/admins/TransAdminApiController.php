<?php

namespace App\Http\Controllers\Apis\Admins;
use App\Http\Controllers\Controller;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Carbon\Carbon;

use App\Http\Controllers\UploadController;
use App\Http\Controllers\WalletController;

use App\Models\User;
use App\Models\PackPoints;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\WalletHistory;

use App\Helpers\Functions;
use App\Helpers\Transaction as TransHelper;

class TransAdminApiController extends Controller
{

    public function userPayment(Request $request){
        try{
            $user = Auth::user();
            $trans = Transaction::with('user')->whereIn('status', [Transaction::STATUS_AWAITING_APPROVAL])->orderBy('updated_at', 'ASC')->get();
            return response()->json([
                'message' => 'สำเร็จ',
                'data' => $trans,
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

    public function update(Request $request){
        try{
            $tran_id = $request->id;
            $status = $request->status;
            $status_int = TransHelper::toModelStatus($status);
            $user = Auth::user();


            if($status && $tran_id){
                $flows = false;
                switch($status){
                    case 'approved':
                        $tranDB = Transaction::where('id', $tran_id)->first();
                        if($tranDB){
                            if($tranDB->status == Transaction::STATUS_APPROVED || $tranDB->status == Transaction::STATUS_REJECTED) { throw new Exception("ไม่สามารถบันทึกซ้ำได้"); }

                            $tranDB->update([
                                'status' => $status_int,
                                'admin_id' => $user->id,
                                'approved_at' => Carbon::now(),
                            ]);
                            $wallet = Wallet::where('user_id', $tranDB->user_id)->first();
                            if($wallet){
                                $update = WalletController::AddPoint($wallet->user_id, $tranDB->points, WalletHistory::TYPE_TOPUP, 'เติมพอยต์ผ่านการยืนยัน');
                                return response()->json([
                                    'message' => 'สำเร็จ',
                                    'data' => $update,
                                    'code' => 200
                                ], 200);
                            }
                            throw new Exception("ไม่พบกระเป๋า");
                        }
                        throw new Exception("อนุมัติไม่ได้");
                        break;
                    case 'rejected':
                        $tranDB = Transaction::where('id', $tran_id)->first();
                        if($tranDB){
                            if($tranDB->status == Transaction::STATUS_APPROVED || $tranDB->status == Transaction::STATUS_REJECTED) { throw new Exception("ไม่สามารถบันทึกซ้ำได้"); }
                            $tranDB->update([
                                'status' => $status_int,
                                'admin_id' => $user->id,
                            ]);
                            if($tranDB){
                                return response()->json([
                                    'message' => 'สำเร็จ',
                                    'data' => $tranDB,
                                    'code' => 200
                                ], 200);
                            }
                        }
                        throw new Exception("อัพเดทไม่ผ่าน");
                        break;
                    default:
                        $flows = false;
                        break;
                }
            }
            throw new Exception('เงื่อนไขไม่ครบ');


        }catch (\Exception $e) {
            $response = [
                'message' => $e->getMessage() ?? 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
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
