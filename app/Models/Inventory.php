<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $table = 'inventory';

    protected $fillable = [
        'id',
        'source_id',
        'source_type',
        'amount',
    ];

    public $timestamps = true;
}
