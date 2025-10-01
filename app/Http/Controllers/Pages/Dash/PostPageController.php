<?php

namespace App\Http\Controllers\Pages\Dash;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Football\LiveScoreController as LiveController;
use App\Models\Football\Competition as league;
use App\Models\Football\Country;
use App\Models\Football\Federation as Feder;
use App\Models\Football\Seasons;
use App\Models\Post\PostReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostPageController extends Controller
{
    public function ReportList(Request $request)
    {
        $table = PostReport::all();
        return Inertia::render('dashboard/admins/posts/report', compact('table'));
    }

    public function CreatePostPage(Request $request)
    {
        $query = $request->query();
        $matches = LiveController::LiveScore()->data;
        $filtered = collect($matches)->pluck('competition.id')->unique()->values()->all();
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
//        dd($matches, $leagues);
        return Inertia::render('dashboard/create-post', compact('query', 'matches', 'leagues'));
    }
}
