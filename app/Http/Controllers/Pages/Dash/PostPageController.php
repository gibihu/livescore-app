<?php

namespace App\Http\Controllers\Pages\Dash;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Football\LiveScoreController as LiveController;
use App\Models\Football\Competition as league;
use App\Models\Football\Country;
use App\Models\Football\Federation as Feder;
use App\Models\Football\Matchs;
use App\Models\Football\Seasons;
use App\Models\Post\PostReport;
use Carbon\Carbon;
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
        $now = Carbon::now();
        $threshold = $now->copy()->addMinutes(30); // 30 นาทีจากตอนนี้

        $matches = Matchs::where(function ($query) use ($now) {
            // date >= วันนี้
            $query->whereDate('date', '>=', $now->toDateString());
        })
            ->where(function ($query) use ($threshold) {
                // scheduled มากกว่า 30 นาที หรือ scheduled = null
                $query->where(function ($q) use ($threshold) {
                    $q->whereNotNull('scheduled')
                        ->where('scheduled', '>', $threshold);
                })
                    ->orWhereNull('scheduled');
            })
            ->where(function($query) {
                $query->where('status', null)
                    ->orWhere('status', 'NOT STARTED');
            })
            ->get();
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
//        dd($matches, $leagues);
        return Inertia::render('dashboard/create-post', compact('query', 'matches', 'leagues'));
    }
}
