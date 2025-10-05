<?php

namespace App\Http\Controllers\Apis\Dash;

use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Models\Post\Post;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PostApiDashController extends Controller
{
    public function store(Request $request)
    {
        try {
            $todayPosts = Post::where('user_id', Auth::id())
                ->whereDate('created_at', Carbon::today())
                ->count();
            $max = UserHelper::MaxFromTier(Auth::user()->tier);

            if ($todayPosts >= $max) {
                return response()->json([
                    'message' => "วันนี้คุณสร้างโพสต์ครบ $max ครั้งแล้ว ไม่สามารถสร้างเพิ่มได้",
                    'code' => 403,
                ], 403);
            }
            $user = Auth::user();
            $show = [
              'value_1' => $request->value_show_1,
              'value_2' => $request->value_show_2,
              'value_3' => $request->value_show_3,
              'value_4' => $request->value_show_4,
              'value_5' => $request->value_show_5,
              'value_6' => $request->value_show_6,
            ];
            $hidden = [
              'value_1' => $request->value_hidden_1,
              'value_2' => $request->value_hidden_2,
              'value_3' => $request->value_hidden_3,
              'value_4' => $request->value_hidden_4,
              'value_5' => $request->value_hidden_5,
              'value_6' => $request->value_hidden_6,
            ];

            $post = new Post();
            $post->user_id = $user->id;
            $post->ref_id = $request->match_id;
            $post->ref_type = Post::REFTYPE_MATCH;
            $post->title = $request->title ?? '';
            $post->points = $request->points ?? 100;

            $post->show = $show;
            $post->hidden = $hidden;

            $post->description = $request->description ?? '';

            $post->type = $request->type;
            $post->privacy = $request->submit ? Post::PUBLIC : Post::PRIVATE;

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

    public function show(Request $request)
    {
        try {
            $type = $request->type;
            $user = Auth::user();
            $posts = Post::where('user_id', $user->id)->orderBy('created_at', 'DESC')->get();

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
}
