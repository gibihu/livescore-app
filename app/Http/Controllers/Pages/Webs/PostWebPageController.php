<?php

namespace App\Http\Controllers\Pages\Webs;

use App\Helpers\RateHelper;
use App\Http\Controllers\Controller;
use App\Models\Football\Matchs;
use App\Models\Posts\Post;
use App\Models\Users\Follow;
use App\Models\Users\Inventory;
use App\Models\Users\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostWebPageController extends Controller
{
    public function PostShowAll()
    {
        $posts = Post::where('privacy', Post::PUBLIC)->where('ref_type', Post::REFTYPE_MATCH)->select('id','points','title', 'privacy', 'status', 'user_id', 'ref_id', 'ref_type', 'type', 'ss_id')->orderBy('created_at', 'DESC')->get();
        $posts->map(function ($post) {
            $post->match = Matchs::select('home_team_id', 'away_team_id')->find($post->ref_id);
            return $post;
        });
        return Inertia::render('posts/all', compact('posts'));
    }

    public function PostShowOne($id)
    {
        $is_unlock = false;
        if (Auth::check()) {
            $user = Auth::user();

            // ดึงโพสต์ครั้งเดียว
            $post = Post::with('user')->find($id);
            $post->hiddens = (object) [
                'value_6' => RateHelper::getItem($post->hidden["value_6"]),
            ];
            if (!$post) {
                abort(404);
            }

            // ตรวจว่ามี inventory หรือไม่
            $inventory = Inventory::where([
                ['user_id', $user->id],
                ['source_type', Inventory::TYPE_POST],
                ['source_id', $id],
            ])->first();

            // ตรวจ follow (ข้ามถ้าเจ้าของโพสต์เอง)
            $follow = $user->id == $post->user_id
                ? false
                : Follow::with('followed')
                    ->where('follower_id', $user->id)
                    ->where('followed_id', $post->user_id)
                    ->first();

            // กรณีมีสิทธิ์เข้าถึง (ไม่ต้อง query $post ใหม่)
            $canAccess = $inventory || $user->role == User::ROLE_ADMIN || $user->id == $post->user_id;
            if (!$canAccess) {
                $post = Post::select('id', 'title', 'user_id', 'ref_id', 'points', 'ref_type', 'privacy', 'status', 'type')
                    ->with('user')
                    ->find($id);
            }else{
                $is_unlock = true;
            }
        } else {
            // guest -> ดึงเฉพาะข้อมูลจำเป็น
            $post = Post::select('id', 'title', 'user_id', 'ref_id', 'points', 'ref_type', 'privacy', 'status', 'type')
                ->with('user')
                ->find($id);

            $follow = null;
        }
        $post->match = Matchs::find($post->ref_id);
        return Inertia::render('posts/view', compact('post', 'follow', 'is_unlock'));
    }


    public  function ReportPage($post_id)
    {
        try{
            $post = Post::with('user')->find($post_id);
            return Inertia::render('posts/resport', compact('post'));
        }catch (Exception $e){
            abort(404);
        }

    }
}
