<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Federation extends Model
{
    use HasUuids; // เพราะ id เป็น uuid
    protected $table = 'federations';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'federation_id',
        'name',
    ];

    public $timestamps = true;
}
