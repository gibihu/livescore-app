<?php

namespace App\Http\Controllers\Apis;
use App\Http\Controllers\Controller;

use App\Models\Wallet;
use App\Models\WalletHistory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


use App\Models\User;
use App\Models\Post;
use App\Models\Inventory;

use App\Http\Controllers\WalletController;

use App\Helpers\UserHelper;


class PostApisController extends Controller
{
    public function store(Request $request)
    {
        try {
            $title = $request->title;
            $points = $request->points;
            $contents = $request->contents;
            $submit = $request->submit;
            $fixture_id = $request->fixture_id;
            $score = "$request->home_score - $request->away_score";
            $odds = [
                'live' => [
                    1 => $request->odds_live_1,
                    2 => $request->odds_live_2,
                    'X' => $request->odds_live_2,
                ],
                'pre' => [
                    1 => $request->odds_pre_1,
                    2 => $request->odds_pre_2,
                    'X' => $request->odds_pre_2,
                ]
            ];

            $user_id = Auth::id();
//            dd($request->all());

            $post = new Post();
            $post->user_id = $user_id;
            $post->ref_id = (int) $fixture_id;
            $post->title = $title ?? '';
            $post->contents = $contents ?? '';
            $post->points = $points ?? 100;
            $post->odds = $odds;
            $post->score = $score;
            $post->privacy = $submit ? Post::PUBLIC : Post::PRIVATE;

            if ($post->save()) {
                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => $post,
                    'code' => 201,
                ], 201);
            }
            throw new Exception('ไม่สามารถดำเนินการได้!');
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

    public function showAuth(Request $request)
    {
        try {
            $type = $request->type;
            $user = Auth::user();
            $posts = Post::where('user_id', $user->id)->orderBy('created_at', 'DESC')->get();

            $posts->transform(function ($item) {
                return [
                    'id' => $item->id,
                    'user_id' => $item->user_id,
                    'title' => Str::limit($item->title, 50, '...'),
                    'contents' => !empty($type) && $type === 'hidden' ? 'hidden' : $item->contents, // แทนค่าตรงนี้
                    'points' => $item->points,
                    'privacy' => $item->privacy,
                    'privacy_text' => $item->privacy_text,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            });

            return response()->json([
                'message' => 'สำเร็จ',
                'data' => $posts,
                'code' => 200,
            ], 200);
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
            if($user->wallet->points > $post->points && $user->id !== $post->user_id){
                        $poser = User::find($post->user_id);
                        $fee = $this->CompareFee($poser->tier);
                if(
                    WalletController::ActionsPoint($post->user_id, $post->points - ($post->points * $fee /100), WalletHistory::TYPE_INCOME, "ได้รับจากการปลดล็อโพสต์ $post->title")
                    &&
                    WalletController::ActionsPoint($user->id, -$post->points, WalletHistory::TYPE_USED, "ลกเปลี่ยนโพสต์ $post->title")
                ){
                    $inventory = new Inventory();
                    $inventory->user_id = $user->id;
                    $inventory->source_type = Inventory::TYPE_POST;
                    $inventory->source_id = $id;
                    $inventory->save();
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
