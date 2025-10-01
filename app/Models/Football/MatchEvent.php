<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Model;

class MatchEvent extends Model
{
    protected $table = 'match_events';

    protected $fillable = [
        'match_id',
        'json',
        'status',
        'is_updating',
    ];


    public $timestamps = true;
}
