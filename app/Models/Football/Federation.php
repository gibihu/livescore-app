<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Model;

class Federation extends Model
{
    protected $table = 'federations';

    protected $fillable = [
        'id',
        'name',
    ];

    public $timestamps = true;
}
