<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Model;

use App\Models\Football\Federation;
use App\Models\Football\Country;
use App\Models\Football\Seasons;

class Competition extends Model
{
    protected $table = 'competitions';

    protected $fillable = [
        'id',
        'name',
        'is_league',
        'is_cup',
        'tier',
        'has_groups',
        'active',
        'national_teams_only',
        'country_id',
        'season_id',
        'federation_id',
    ];

    public $timestamps = true;

}
