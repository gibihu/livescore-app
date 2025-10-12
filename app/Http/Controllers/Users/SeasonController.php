<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Posts\Rank;
use App\Models\Posts\Season;
use App\Models\Users\User;

class SeasonController extends Controller
{
    public static function GetRank($user_id)
    {
        $season_index = env('SEASON_INDEX');
        $user = User::find($user_id);
        $ss = self::GetSeason();
        $rank = Rank::where('user_id', $user->id)->orderBy('created_at', 'desc')->first();

        if($rank && $ss->season_index == $season_index){
            return $rank;
        }

        $rank = new Rank;
        $rank->user_id = $user->id;
        $rank->season_id = Season::where('season_index', $season_index)->first()->id;
        $rank->save();

        return $rank;
    }

    public static function GetSeason()
    {
        $season_index = env('SEASON_INDEX');
        $ss = Season::where('season_index', $season_index)->first();

        if(!$ss){
            $ss = new Season;
            $ss->name = "season $season_index";
            $ss->status = 1;
            $ss->season_index = $season_index;
            $ss->save();
        }

        return $ss;
    }
}
