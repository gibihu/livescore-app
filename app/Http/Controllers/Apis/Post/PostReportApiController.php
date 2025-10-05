<?php

namespace App\Http\Controllers\Apis\Post;

use App\Http\Controllers\Controller;
use App\Models\Post\Post;
use App\Models\Post\PostReport;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostReportApiController extends Controller
{
    public function create($post_id, Request $request)
    {
        try{
            $user_id = Auth::check() ? Auth::user()->id : null;
            $post = Post::with('user')->find($post_id);
            $title = "รายงานโพสต์ $post->title";
            $description = $request->description ?? null;

            if($post){
                PostReport::create([
                    'user_id' => $user_id,
                    'post_id' => $post_id,
                    'title' => $title,
                    'description' => $description,
                    'category' => $request->category ?? null,
                ]);

                return response()->json([
                    'message' => 'บันทึกสำเร็จ',
                    'code' => 201
                ], 201);
            }else{
                return response()->json([
                    'message' => 'ไม่พบโพสต์',
                    'code' => 404,
                ], 404);
            }
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
}
