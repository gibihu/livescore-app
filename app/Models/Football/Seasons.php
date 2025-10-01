<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Seasons extends Model
{
    use HasUuids; // เพราะ id เป็น uuid
    protected $table = 'seasons';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'season_id',
        'name',
        'name_th',
        'start',
        'end',
    ];

    public $timestamps = true;

}
