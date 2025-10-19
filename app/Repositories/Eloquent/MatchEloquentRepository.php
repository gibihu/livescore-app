<?php

namespace App\Repositories\Eloquent;

use App\Helpers\ConJobHelper;
use App\Models\Football\Matchs;
use App\Repositories\Contracts\MatchRepository;
use Carbon\Carbon;

class MatchEloquentRepository implements MatchRepository
{
    public function saveMatch(object $item)
    {
        $match = Matchs::where('fixture_id', $item->fixture_id)
            ->orWhere('match_id', $item->id)
            ->first();
        if (!$match) { $match = new Matchs; }

        $match->match_id = $item->id ?? ($match ? $match->id : null);
        $match->fixture_id = $item->fixture_id ?? ($match ? $match->fixture_id : null);
        $match->competition_id = $item->competition ? ConJobHelper::CheckCompetitionAndInsert($item->competition)->id : null;
        $match->country_id = $item->country ? ConJobHelper::CheckCountryAndInsert($item->country)->id : null;
        $match->home_team_id = $item->home ? ConJobHelper::CheckTeamAndInsert($item->home)->id : null;
        $match->away_team_id = $item->away ? ConJobHelper::CheckTeamAndInsert($item->away)->id : null;
        $match->federation_id = $item->federation ? ConJobHelper::CheckFederationAndInsert($item->federation)->id : null;
        $match->status = $item->status ?? ($match ? $match->status : null);
        $match->location = $item->location ?? ($match ? $match->location : null);
        $match->odds = $item->odds ?? ($match ? $match->odds : null);
        $match->scores = $item->scores ?? ($match ? $match->scores : null);
        $match->outcomes = $item->outcomes ?? ($match ? $match->outcomes : null);

        $match->time = $item->time;
        $match->date = $item->date ?? ($match ? $match->date : null);
        $match->scheduled = Carbon::parse($item->scheduled, 'UTC')->setTimezone('Asia/Bangkok')->format('H:i:s');
        $match->added = Carbon::parse($item->added, 'UTC')->setTimezone('Asia/Bangkok');
        $match->last_changed = Carbon::parse($item->last_changed, 'UTC')->setTimezone('Asia/Bangkok');

        $match->live_status = $item->status == 'FINISHED' ? 'END_LIVE' : 'LIVE';
        $match->urls = $item->urls ?? ($match ? $match->urls : null);
        $match->save();
        return $match;
    }
}
