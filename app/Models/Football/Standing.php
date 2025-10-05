<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Standing extends Model
{
    use HasUuids; // เพราะ id เป็น uuid
    protected $table = 'standings';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'league_id',
        'season_id',
        'team_id',
        'competition_id',
        'group_id',
        'stage_id',
        'name',
        'group_name',
        'stage_name',
        'rank',
        'points',
        'matches',
        'won',
        'drawn',
        'lost',
        'goals_scored',
        'goals_conceded',
        'goal_diff',
    ];
    public $timestamps = true;
}
