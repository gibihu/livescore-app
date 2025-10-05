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

    public function showMatch(Request $request, $id)
    {
        $match = Matchs::where('id',$id)->first();
        $posts = Post::where('ref_id',$id)->where('privacy', Post::PUBLIC)->get();
        $posts->map(function ($post) {
            $post->match = Matchs::select('home_team_id', 'away_team_id')->find($post->ref_id);
            return $post;
        });
        return Inertia::render('match/view', compact('match', 'posts'));
    }

    public function fixturesMatch(Request $request)
    {
        $date = $request->query('date') ?? Carbon::tomorrow();
        $matches = Matchs::whereNull('match_id')
            ->whereDate('date', $date)
            ->where('live_status', 'NOT_LIVE')
            ->get();
        $fixture_date = Carbon::parse($date)->format('Y-m-d');
        return Inertia::render('fixture', compact('matches', 'fixture_date'));
    }

    public function historyMatch(Request $request)
    {
        $date = $request->query('date') ?? Carbon::yesterday();
        $matches = Matchs::whereNull('match_id')
            ->whereDate('date', $date)
            ->where('live_status', 'END_LIVE')
            ->get();
        $fixture_date = Carbon::parse($date)->format('Y-m-d');

        return Inertia::render('history', compact('matches', 'fixture_date'));
    }
}
