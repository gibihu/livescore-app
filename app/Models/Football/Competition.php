<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

use App\Models\Football\Federation;
use App\Models\Football\Country;
use App\Models\Football\Seasons;

class Competition extends Model
{
    use HasUuids; // เพราะ id เป็น uuid
    protected $table = 'competitions';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'competition_id',
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

    protected $casts = [
        'is_league' => 'boolean',
        'is_cup' => 'boolean',
        'has_groups' => 'boolean',
        'active' => 'boolean',
        'national_teams_only' => 'boolean',
    ];
    public $timestamps = true;

}
