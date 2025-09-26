<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'countries';

    protected $fillable = [
        'id',
        'name',
        'flag',
        'fifa_code',
        'uefa_code',
        'is_real',
    ];

    public $timestamps = true;


}
