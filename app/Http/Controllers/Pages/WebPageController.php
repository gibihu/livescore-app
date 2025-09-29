<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebPageController extends Controller
{
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
