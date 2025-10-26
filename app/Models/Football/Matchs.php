<?php

namespace App\Models\Football;

use Carbon\Carbon;
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
        'home_lineups',
        'away_lineups',
        'round',
        'date',
        'location',
        'status',
        'live_status',
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
    protected $with = [
        'home',
        'away',
        'league',
        'country',
        'federation',
    ];
    protected $hidden = [
        'urls'
    ];
    protected $appends = [
        'date_th', 'date_th_short',
        'added_th', 'added_th_short',
        'last_change_th', 'last_change_th_short',
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
    public function federation()
    {
        return $this->belongsTo(Federation::class, 'federation_id', 'id');
    }


    protected function formatDateThai($value, $short = false)
    {
        if (!$value) return null;

        $date = Carbon::parse($value);
        $year = $date->year + 543; // แปลงเป็นพุทธศักราช

        return $short
            ? $date->format('j-n-') . substr($year, -2)
            : $date->format('d-m-') . $year;
    }

    // ===== date =====
    public function getDateThAttribute()
    {
        return $this->formatDateThai($this->date);
    }

    public function getDateThShortAttribute()
    {
        return $this->formatDateThai($this->date, true);
    }

    // ===== added =====
    public function getAddedThAttribute()
    {
        return $this->formatDateThai($this->added);
    }

    public function getAddedThShortAttribute()
    {
        return $this->formatDateThai($this->added, true);
    }

    // ===== last_change =====
    public function getLastChangeThAttribute()
    {
        return $this->formatDateThai($this->last_change);
    }

    public function getLastChangeThShortAttribute()
    {
        return $this->formatDateThai($this->last_change, true);
    }
}
