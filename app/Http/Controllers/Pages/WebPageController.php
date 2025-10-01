<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Football\LiveScoreController as LiveController;
use App\Models\Football\Competition as league;
use App\Models\Football\Country;
use App\Models\Football\Federation as Feder;
use App\Models\Football\Matchs;
use App\Models\Football\Seasons;
use App\Models\Post\Post;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebPageController extends Controller
{

    public function home()
    {
        try{
            $matches = LiveController::LiveScore();
            $filtered = collect($matches)->pluck('competition_id')->unique()->values()->all();
            if (!empty($filtered)) {
                $leagues = League::whereIn('id', $filtered)->get();
            } else {
                $leagues = collect(); // หรือ []
            }
            $leagues->transform(function($item){
                $item->session = Seasons::find($item->season_id);
                $item->federations = Feder::whereIn('id', [$item->federation_id])->get();
                $item->countries = Country::whereIn('id', [$item->country_id])->get();
                return $item;
            });

            $posts = Post::with('user')->where('privacy', Post::PUBLIC)->orderBy('created_at', 'DESC')->get();
            $posts->transform(function ($item) {
                $item->content = 'hidden';
                return $item;
            });
//            dd($matches, $leagues, $filtered);
            return Inertia::render('home', compact('matches', 'leagues', 'posts'));
        }catch (Exception $e) {
            abort(404);
        }
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

    public function showMatch(Request $request, $match_id)
    {
        $match = Matchs::where('match_id',$match_id)->first();
        $match->json = json_decode($match->json);

        return Inertia::render('match/show', compact('match'));
    }

    public function showPostAll()
    {
        return Inertia::render('posts/all');
    }
}
