<?php

namespace App\Http\Controllers\Apis;
use App\Http\Controllers\Controller;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


use App\Models\User;
use App\Models\Post;

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
            $user_id = Auth::id();

            $create = Post::create([
                'id' => Str::uuid(),
                'user_id' => $user_id,
                'title' => $title ?? '',
                'contents' => $contents ?? '',
                'points' => $points ?? 100,
                'status' => $submit ? Post::PUBLIC : Post::PRIVATE,
            ]);
            if ($create) {
                return response()->json([
                    'message' => 'สำเร็จ',
                    'data' => $create,
                    'code' => 201,
                ], 201);
            }
            throw new Exception('ไม่สามารถดำเนินการได้!');
        } catch (\Exception $e) {
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
        } catch (\Exception $e) {
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
        } catch (\Exception $e) {
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
