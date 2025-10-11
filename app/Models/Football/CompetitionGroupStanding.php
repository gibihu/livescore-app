<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CompetitionGroupStanding extends Model
{

    use HasUuids;

    // เพราะ id เป็น uuid
    protected $table = 'competition_group_standings';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'rank',
        'points',
        'matches',
        'goal_diff',
        'goals_scored',
        'goals_conceded',
        'lost',
        'drawn',
        'won',
        'team_id',
    ];

    public $timestamps = true;

    protected $with = [
        'team',
    ];


    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'id');
    }
}
