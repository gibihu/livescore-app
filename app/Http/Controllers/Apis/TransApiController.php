<?php

namespace App\Http\Controllers\Apis;
use App\Http\Controllers\Controller;

use App\Models\WalletHistory;
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

use App\Helpers\Functions;
use App\Helpers\Transaction as TransHelper;

class TransApiController extends Controller
{
    public function store(Request $request) {
        try{
            $pack_id = $request->id;
            $pack = PackPoints::where('id', $pack_id)->first();
            if($pack){
                $create = Transaction::create([
                    'user_id' => Auth::id(),
                    'package_id' => $pack->id,
                    'user_reference' => Functions::generateRandomCode(),
                    'amount' => $pack->price,
                    'points' => $pack->points,
                    'expired_at' => Carbon::now()->addDays(3),
                ]);
                if($create){
                    return response()->json([
                        'message' => 'สำเร็จ',
                        'data' => $create,
                        'code' => 200
                    ], 200);
                }
            }
            throw new Exception("ไม่สามารถหารด้วยศูนย์ได้!");
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

    public function show(Request $request, $id) {
        try{
            $trans = Transaction::where('id', $id)->first();
            if($trans && ($trans->user_id = Auth::id() || Auth::user()->role == 'admin')){
                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => $trans,
                    'code' => 200
                ], 200);
            }else{
                return response()->json([
                    'message' => 'ไม่พบ',
                    'errors' => [
                        'detail' => 'ไม่พบการทำธุรกรรทนี้'
                    ],
                    'code' => 404
                ], 404);
            }
            throw new Exception("ไม่สามารถหารด้วยศูนย์ได้!");
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

    public function showAll(Request $request){
        try{
            $user = Auth::user();
            $trans = Transaction::with('user')->where('user_id', $user->id)->where('type', Transaction::DEPOSIT)->orderBy('updated_at', 'DESC')->get();
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

    public function update_onec(Request $request){
        try{
            $id = $request->id;
            $status = $request->status;
            $user = Auth::user();
            if(!isset($id)){
                throw new Exception("ไม่สามารถดำเนินการได้!");
            }
            $allowedStatuses = ['pending', 'cancel', 'awaiting_approval'];

            if(in_array($status, $allowedStatuses)){
                if(!Transaction::where('id', $id)->update(['status' => TransHelper::toModelStatus($status)])) throw new Exception("ไม่สามารถดำเนินการได้!");

                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => $status,
                    'code' => 200
                ], 200);
            }

            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 403,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'request' => $request->all(),
                'status' => $status,
                'allow' => $allowedStatuses
            ];
            return response()->json($response, 403);

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

    public function UplodSlip(Request $request){
        try{
            $trans_id = $request->id;
            $status = $request->status;
            $file = $request->file('file'); // ใช้ Laravel method แทน $_FILES
            $user = Auth::user();

            $transac = Transaction::where('id', $trans_id)->first();
            if (!$transac) {
                return response()->json([
                    'message' => 'ไม่พบข้อมูลการทำรายการ',
                    'code' => 404
                ], 404);
            }

            if ($transac->user_id !== $user->id) {
                    return response()->json([
                        'message' => 'ไม่มีสิทธิ์ในข้อมูลนี้',
                        'code' => 403
                    ], 403);
                }

                // สมมติว่า UploadController::uploadFileGetId ใช้ได้กับ UploadedFile ของ Laravel
                $upload = UploadController::uploadFileGetId($file, 'users', $user->id, 'slip');

                if (!$upload->status) {
                    return response()->json([
                        'message' => 'อัพโหลดล้มเหลว',
                        'code' => 500
                    ], 500);
                }

                $save = $transac->update([
                    'status' => TransHelper::toModelStatus($status), // แปลงสถานะเป็นค่าที่เก็บในฐานข้อมูล
                    'slip_url' => env('APP_URL') . '/image/' . $upload->name,
                    'paid_at' => Carbon::now(),
                ]);

                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => $transac, // แนะนำให้ส่ง object กลับ ไม่ใช่ boolean
                    'code' => 201
                ], 201);
            }catch (Exception $e) {
                $response = [
                    'message' => $e->getMessage() ?? 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                    'code' => 500,
                ];
                if(env('APP_DEBUG')) $response['debug'] = [
                    'message' => $e->getMessage(),
                    'request' => $request->all(),
                    'file' => $file,
                ];
                return response()->json($response, 500);
            }
    }


    public function Withdraw(Request $request)
    {
        try{
            $amount = $request->amount; //points
            $user = Auth::user();
            $rate = env('APP_EXCHANGE_RATE');

            // wallet -> history -> transac

            if($user->wallet->income >= $amount){
                $total = new \stdClass();
                $total->point = $amount - $amount*0.3;
                $total->price = $total->point * $rate;
                if(WalletController::ActionsPoint($user->id, -$amount, WalletHistory::TYPE_REMOVED, "แลกเปลี่ยนเป็นเงิน $total->price THB")){
                    $trans = new Transaction();
                    $trans->user_id = $user->id;
                    $trans->amount = $total->price;
                    $trans->points = $total->point;
                    $trans->rate = $rate;
                    $trans->type = Transaction::WITHDRAW;
                    $trans->status = Transaction::STATUS_AWAITING_APPROVAL;
                    $trans->user_reference = Functions::generateRandomCode();
                    if($trans->save()){
                        return response()->json([
                            'message' => 'บันทุกสำเร็จ',
                            'data' => $trans,
                            'code' => 201
                        ], 201);
                    }else{
                        throw  new Exception('ระบบบันทึกคำร้องไม่ได้ โปรดลองอีกครั้ง');
                    }
                }else{
                    throw  new Exception('ระบบหักพอยต์และบันทึกไม่ได้');
                }
            }else{
                return response()->json([
                    'message' => 'พอยต์ไม่พอ',
                    'code' => 403,
                ], 403);
            }


        }catch (Exception $e){
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
