<?php

namespace App\Http\Controllers\Apis\Admins;
use App\Helpers\Transaction as TransHelper;
use App\Http\Controllers\Controller;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\Users\WalletController;
use App\Models\Users\Transaction;
use App\Models\Users\User;
use App\Models\Users\Wallet;
use App\Models\Users\WalletHistory;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        }catch (Exception $e) {
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
    public function userPaymentHistory(Request $request){
        try{
            $trans = Transaction::with('user')->whereIn('status', [Transaction::STATUS_APPROVED])->orderBy('updated_at', 'DESC')->get();
            return response()->json([
                'message' => 'สำเร็จ',
                'data' => $trans,
                'code' => 200
            ], 200);
        }catch (Exception $e) {
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
                                $update = WalletController::ActionsPoint($wallet->user_id, $tranDB->points, WalletHistory::TYPE_TOPUP, 'เติมพอยต์ผ่านการยืนยัน');
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


        }catch (Exception $e) {
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

    public function UpdateExchange(Request $request)
    {
        try{
            $trans_id = $request->id;
            $file = $request->file('file');
            $user = Auth::user();
            $transac = Transaction::where('id', $trans_id)->first();
            if (!$transac) {
                return response()->json([
                    'message' => 'ไม่พบข้อมูลการทำรายการ',
                    'code' => 404
                ], 404);
            }
            if($user->role == User::ROLE_ADMIN){
                // สมมติว่า UploadController::uploadFileGetId ใช้ได้กับ UploadedFile ของ Laravel
                $upload = UploadController::uploadFileGetId($file, 'users', $user->id, 'admin');

                if (!$upload->status) {
                    return response()->json([
                        'message' => 'อัพโหลดล้มเหลว',
                        'code' => 500
                    ], 500);
                }

                $transac->status = Transaction::STATUS_APPROVED;
                $transac->slip_url = env('APP_URL') . '/image/' . $upload->name;
                $transac->paid_at = Carbon::now();
                $transac->approved_at = Carbon::now();
                $transac->admin_id = $user->id;

                if($transac->save()){
                    return response()->json([
                        'message' => 'สำเร็จ',
                        'data' => $transac, // แนะนำให้ส่ง object กลับ ไม่ใช่ boolean
                        'code' => 201
                    ], 201);
                }
            }else{
                return response()->json([
                    'message' => 'คุณไม่มีสิธิเปลี่ยนแปลง',
                    'code' => 401
                ], 401);
            }
        }catch (Exception $e) {
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
