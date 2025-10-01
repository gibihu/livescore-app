<?php

namespace App\Http\Controllers\Apis\Admins;
use App\Http\Controllers\Controller;
use App\Models\Post\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostAdminApiController extends Controller
{
    public function show(Request $request) {
        try{
            $data = Post::with('user')->orderBy('created_at', 'desc')->get();
            $data->transform(function($item) {
                $item->title_short = Str::limit($item->title, 40, '...');
                return $item;
            });
            return response()->json([
                'message' => 'สำเร็จ',
                'data' => $data,
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
}
