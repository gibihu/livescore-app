<?php

namespace App\Http\Controllers\Apis;
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
                    'id' => Str::uuid(),
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

    public function showAll(Request $request){
        try{
            $user = Auth::user();
            $trans = Transaction::with('user')->where('user_id', $user->id)->orderBy('updated_at', 'DESC')->get();
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

    public function update_onec(Request $request){
        try{
            $id = $request->id;
            $status = $request->status;
            $user = Auth::user();
            if(!isset($id)){
                throw new Exception("ไม่สามารถดำเนินการได้!");
            }

            if($user->role == 'admin'){
                $allowedStatuses = ['pending', 'cancel', 'awaiting_approval','approved', 'rejected'];
            }else{
                $allowedStatuses = ['pending', 'cancel', 'awaiting_approval'];
            }

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

    public function UplodSlip(Request $request){
        try{
            $tran_id = $request->id;
            $status = $request->status;
            $file = $request->file('file'); // ใช้ Laravel method แทน $_FILES
            $user = Auth::user();

            $transac = Transaction::where('id', $tran_id)->first();
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
            }catch (\Exception $e) {
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

    public function adminUpdate(Request $request){
        try{
            $user = Auth::user();
            if($user->role !== 'admin'){
                $response = [
                    'message' => 'ไม่ได้รับอนุญาติ',
                    'code' => 403,
                ];
                if(env('APP_DEBUG')) $response['debug'] = [
                    'request' => $request->all(),
                    'id' => $id,
                ];
                return response($response, 403)->json();
            }

            $req = $request->all();
            $tran_id = $req->id;
            $status = $req->status;

            if($status && $tran_id){
                $flows = false;
                switch($status){
                    case 'approved':
                        $tranDB = Transaction::where('id', $tran_id)->first();
                        if($tranDB){
                            if($tranDB->status == 'approved' || $tranDB->status == 'rejected') { throw new Exception("ไม่สามารถบันทึกซ้ำได้"); }

                            $tranDB->update([
                                'status' => $status,
                                'admin_id' => $user->id,
                                'approved_at' => Carbon::now(),
                            ]);
                            $wallet = Wallet::where('user_id', $tranDB->user_id)->first();
                            if($wallet){
                                $update = WalletController::AddPoint($wallet->user_id, $tranDB->points, 'topup', 'เติมพอยต์ผ่านการยินยัน');
                                return response([
                                    'message' => 'สำเร็จ',
                                    'data' => $update,
                                    'code' => 200
                                ], 200)->json();
                            }
                            throw new Exception("ไม่พบกระเป๋า");
                        }
                        throw new Exception("อนุมัติไม่ได้");
                        break;
                    case 'rejected':
                        $tranDB = Transaction::where('id', $tran_id)->first();
                        if($tranDB){
                            if($tranDB->status == 'approved' || $tranDB->status == 'rejected') { throw new Exception("ไม่สามารถบันทึกซ้ำได้"); }
                            $tranDB->update([
                                'status' => $status,
                                'admin_id' => $user->id,
                            ]);
                            if($tranDB){
                                return response([
                                    'message' => 'สำเร็จ',
                                    'data' => $update,
                                    'code' => 200
                                ], 200)->json();
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
            return response($response, 500)->json();
        }
    }
}
