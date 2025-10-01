<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Matchs extends Model
{
    protected $table = 'matches';
    protected $keyType = 'string';
    public $incrementing = false;

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
        'odds',
        'scores',
        'outcomes',
        'penalty_shootout',
        'federation',
        'group_id',
        'urls',
        'added',
        'last_changed',
    ];

    protected $casts = [
        'odds' => 'json',
        'scores' => 'json',
        'outcomes' => 'json',
        'urls' => 'json',
    ];
    protected static function boot()
    {
        parent::boot();

        // ก่อนบันทึก record ใหม่
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
    // FK Relationships
    public function competition()
    {
        return $this->belongsTo(Competition::class, 'competition_id', 'id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }

    public function homeTeam()
    {
        return $this->belongsTo(Team::class, 'home_team_id', 'id');
    }

    public function awayTeam()
    {
        return $this->belongsTo(Team::class, 'away_team_id', 'id');
    }
}
