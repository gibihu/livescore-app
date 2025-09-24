<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matchs extends Model
{
    protected $table = 'matches';

    protected $fillable = [
        'match_id',
        'json',
        'status',
        'is_updating',
    ];

    public $timestamps = true;
}
