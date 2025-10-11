<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CompetitionStage extends Model
{

    use HasUuids;

    // เพราะ id เป็น uuid
    protected $table = 'competition_stages';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'stage_id',
        'name',
        'competition_id',
        'season_id',
        'group_id',
    ];

    public $timestamps = true;

    protected $with = [
        'competition',
        'season',
        'group',
    ];


    public function competition()
    {
        return $this->belongsTo(Competition::class, 'competition_id', 'id');
    }

    public function season()
    {
        return $this->belongsTo(Seasons::class, 'season_id', 'id');
    }
    public function group()
    {
        return $this->belongsTo(CompetitionGroup::class, 'group_id', 'id');
    }
}
