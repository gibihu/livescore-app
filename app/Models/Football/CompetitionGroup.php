<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CompetitionGroup extends Model
{

    use HasUuids;

    // เพราะ id เป็น uuid
    protected $table = 'competition_groups';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'group_id',
        'name',
        'standings_id',
    ];
    public $timestamps = true;

    protected $casts = [
        'standings_id' => 'object',
    ];

    protected $with = [
//        'standing',
    ];


}
