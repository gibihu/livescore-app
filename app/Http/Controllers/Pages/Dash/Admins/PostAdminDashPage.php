<?php

namespace App\Http\Controllers\Pages\Dash\Admins;

use App\Helpers\PostHelper;
use App\Helpers\RateHelper;
use App\Http\Controllers\Controller;
use App\Models\Posts\Post;
use App\Models\Posts\PostReport;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostAdminDashPage extends Controller
{
    public function ReportList(Request $request)
    {
        $table = PostReport::all();
        return Inertia::render('dashboard/admins/posts/report', compact('table'));
    }

    public function PostTable(Request $request)
    {
        $posts = Post::with('user')->orderBy('created_at', 'desc')->get();
        $posts->transform(function($item) {
            $item->title_short = Str::limit($item->title, 40, '...');
            return $item;
        });

        return Inertia::render('dashboard/admins/posts/table', compact('posts'));
    }

    public function PostSummary(Request $request, $id)
    {
        try{
            $post = Post::with('user', 'match')->where('ref_type', Post::REFTYPE_MATCH)->findOrFail($id);
            $post->hiddens = (object) [
                'value_6' => RateHelper::getItem($post->hidden["value_6"]),
            ];
            if(!$post->summary_at){
                $post = PostHelper::SummaryOfType($post);
                $post->summary_at = Carbon::now();
            }

            return Inertia::render('dashboard/admins/posts/summary', compact('post'));
        }catch (ModelNotFoundException $e){
            abort(404);
        }
    }

}
