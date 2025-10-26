<?php

namespace App\Http\Controllers\Apis\Post;
use App\Helpers\RateHelper;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Users\WalletController;
use App\Models\Football\Matchs;
use App\Models\Posts\Post;
use App\Models\Users\Inventory;
use App\Models\Users\User;
use App\Models\Users\WalletHistory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class PostApisController extends Controller
{
    public function feed(Request $request)
    {
        try {
            $posts = Post::with('user')->where('privacy', Post::PUBLIC)->orderBy('created_at', 'DESC')->get();
            if ($posts) {
                $posts->transform(function ($item) {
                    $item->content = 'hidden';
                    return $item;
                });
                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => $posts,
                    'code' => 200,
                ], 200 );
            }
        } catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if (env('APP_DEBUG')) {
                $response['debug'] = [
                    'message' => $e->getMessage(),
                    'request' => $request->all(),
                ];
            }
            return response()->json($response, 500);
        }
    }

    public function show(Request $request, $id)
    {
        try{
            if(Auth::check()){
                $user = Auth::user();
                $inventory = Inventory::where('user_id', $user->id)->where('source_type', Inventory::TYPE_POST)->where('source_id', $id)->first();
                if($inventory || $user->role == User::ROLE_ADMIN) {
                    $post = Post::with('user')->where('id', $id)->first();
                    return response()->json([
                        'message' => 'สำเร็จ',
                        'data' => $post,
                        'code' => 200,
                    ], 200);
                }
            }
            $post = Post::select('id', 'user_id', 'ref_id', 'points')->with('user')->where('id', $id)->first();
            return response()->json([
                'message' => !Auth::check() ? 'กรุณาลงชื่อเข้าใช้': 'ยังไม่ได้ปลดล็อก',
                'data' => $post,
                'code' => 404,
            ], 404);
        } catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if (env('APP_DEBUG')) {
                $response['debug'] = [
                    'message' => $e->getMessage(),
                    'request' => $request->all(),
                ];
            }
            return response()->json($response, 500);
        }
    }


    public function unlock(Request $request, $id){
        try{
            $user = User::with('wallet')->find(Auth::id());
            $post = Post::with('user')->find($id);
            if($user->wallet->points >= $post->points && $user->id !== $post->user_id){
                $poser = User::find($post->user_id);
                $fee = (float) $poser->rank->level_json['rate'] + (float) $poser->custom_rate;
                $references = [
                    'type' => 'post',
                    'id' => $post->id,
                ];
                if( $post->points <= 0 || (WalletController::ActionsPoint($post->user_id, $post->points - ($post->points * $fee /100), WalletHistory::TYPE_INCOME, "ได้รับจากการปลดล็อโพสต์ $post->title", $references)
                    &&
                    WalletController::ActionsPoint($user->id, -$post->points, WalletHistory::TYPE_USED, "ลกเปลี่ยนโพสต์ $post->title"))
                ){
                    $inventory = new Inventory();
                    $inventory->user_id = $user->id;
                    $inventory->source_type = Inventory::TYPE_POST;
                    $inventory->source_id = $id;
                    $inventory->save();
                    $post->match = Matchs::find($post->ref_id);
                    $post->hiddens = (object) [
                        'value_2' => RateHelper::getItem($post->hidden["value_2"]),
                    ];
                    if($inventory->save()){
                        return response()->json([
                            'message' => 'ปลดล็อกโพสต์แล้ว',
                            'data' => $post,
                            'code' => 201,
                        ],201);
                    }else{
                        return response()->json([
                            'message' => 'ปลดล็อกไม่สำเร็จ ตรวจสอบกระเป๋าของคุณ',
                            'errors' => [
                                'detail' => 'ระบบไม่สามารถปลดล็อกโพสต์ได้ โปรดตรวจสอบพอยต์ของคุณ หากมีการหักพอยต์กรุณาแจ้งผู้ดูแลระบบ'
                            ],
                            'code' => 409,
                        ],409);
                    }
                }else{
                    throw new Exception('มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง');
                }
            }else{
                return response()->json([
                    'message' => 'พอยต์ไม่เพียงพอ',
                    'data' => null,
                    'code' => 401,
                ], 401);
            }
        } catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if (env('APP_DEBUG')) {
                $response['debug'] = [
                    'message' => $e->getMessage(),
                    'request' => $request->all(),
                ];
            }
            return response()->json($response, 500);
        }
    }

    private function CompareFee($tier)
    {
        switch ($tier) {
            case User::TIER_BRONZE:
                return 20;
                break;
            case User::TIER_SILVER:
                return 20;
                break;
            case User::TIER_GOLD:
                return 15;
                break;
            case User::TIER_VIP:
                return 10;
                break;
            default:
                return 20;
                break;
        }
    }
}
