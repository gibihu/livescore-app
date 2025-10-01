<?php
namespace App\Helpers;

use App\Models\Football\Competition;
use App\Models\Football\Country;
use App\Models\Football\Federation;
use App\Models\Football\Team;

class ConJobHelper
{
    public static function CheckCountryAndInsert($item) {
        $check = Country::where('country_id', $item->id)->first();
        if($check) {return $check;}
        $newItem = new Country;
        $newItem->country_id = $item->id;
        $newItem->name = $item->name ?? null;
        if(preg_match('/\p{Thai}/u', $newItem->name)){
            $newItem->name_th = $newItem->name;
        }
        $newItem->uefa_code = $item->uefa_code ?? null;
        $newItem->fifa_code = $item->fifa_code ?? null;
        $newItem->flag = $item->flag ?? null;
        $newItem->is_real = $item->is_real ?? null;
        $newItem->save();
        return $newItem;
    }
    public static function CheckCompetitionAndInsert($item) {
        $check = Competition::where('competition_id', $item->id)->first();
        if($check) {return $check;}
        $newItem = new Competition;
        $newItem->competition_id = $item->id;
        $newItem->name = $item->name ?? null;
        if(preg_match('/\p{Thai}/u', $newItem->name)){
            $newItem->name_th = $newItem->name;
        }
        $newItem->is_league = $item->is_league ?? null;
        $newItem->is_cup = $item->is_cup ?? null;
        $newItem->tier = $item->tier ?? null;
        $newItem->has_groups = $item->has_groups ?? null;
        $newItem->national_teams_only = $item->national_teams_only ?? null;
        $newItem->active = $item->active ?? null;
        $newItem->save();
        return $newItem;
    }
    public static function CheckTeamAndInsert($item) {
        $check = Team::where('team_id', $item->id)->first();
        if($check) {return $check;}
        $newItem = new Team;
        $newItem->team_id = $item->id;
        $newItem->logo = $item->logo;
        $newItem->name = $item->name ?? null;
        if(preg_match('/\p{Thai}/u', $newItem->name)){
            $newItem->name_th = $newItem->name;
        }
        $newItem->country_id = Country::where('country_id', $item->country_id)->value('id');
        $newItem->stadium = $item->stadium ?? null;
        $newItem->save();
        return $newItem;
    }
    public static function CheckFederationAndInsert($item) {
        $check = Federation::where('federation_id', $item->id)->first();
        if($check) {return $check;}
        $newItem = new Federation;
        $newItem->federation_id = $item->id;
        $newItem->name = $item->name ?? null;
        if(preg_match('/\p{Thai}/u', $newItem->name)){
            $newItem->name_th = $newItem->name;
        }
        $newItem->save();
        return $newItem;
    }

}
