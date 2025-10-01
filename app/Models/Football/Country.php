<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasUuids; // เพราะ id เป็น uuid
    protected $table = 'countries';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'country_id',
        'name',
        'name_th',
        'flag',
        'fifa_code',
        'uefa_code',
        'is_real',
    ];

    public $timestamps = true;


}
