<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Model;

class Seasons extends Model
{
    protected $table = 'seasons';

    protected $fillable = [
        'id',
        'name',
        'start',
        'end',
    ];

    public $timestamps = true;

}
