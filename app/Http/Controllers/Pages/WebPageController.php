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
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebPageController extends Controller
{

    public function home()
    {
        try{
            $matches = LiveController::LiveScore();
            return Inertia::render('home', compact('matches'));
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

    public function fixturesMatch(Request $request)
    {
        $date = $request->query('date') ?? Carbon::tomorrow();
        $matches = Matchs::whereNull('match_id')
            ->whereDate('date', $date)
            ->where('live_status', 'NOT_LIVE')
            ->get();
        return Inertia::render('fixture', compact('matches'));
    }
}
