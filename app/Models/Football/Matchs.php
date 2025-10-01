<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Matchs extends Model
{
    use HasUuids; // เพราะ id เป็น uuid
    protected $table = 'matches';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'match_id',
        'fixture_id',
        'competition_id',
        'country_id',
        'home_team_id',
        'away_team_id',
        'round',
        'date',
        'location',
        'status',
        'time',
        'scheduled',
        'added',
        'last_changed',
        'odds',
        'scores',
        'outcomes',
        'penalty_shootout',
        'federation_id',
        'group_id',
        'urls',
    ];

    protected $casts = [
        'odds' => 'json',
        'scores' => 'json',
        'outcomes' => 'json',
        'urls' => 'json',
    ];
    protected $with = ['home', 'away', 'league', 'country'];
    protected $hidden = [
        'urls'
    ];
    // FK Relationships
    public function competition()
    {
        return $this->belongsTo(Competition::class, 'competition_id', 'id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }

    public function home()
    {
        return $this->belongsTo(Team::class, 'home_team_id', 'id');
    }

    public function away()
    {
        return $this->belongsTo(Team::class, 'away_team_id', 'id');
    }
    public function league()
    {
        return $this->belongsTo(Competition::class, 'competition_id', 'id');
    }
}
