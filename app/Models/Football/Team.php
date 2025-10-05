<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Team extends Model
{
    use HasUuids; // เพราะ id เป็น uuid
    protected $table = 'teams';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'team_id',
        'name',
        'name_th',
        'logo',
        'stadium',
        'country_id',
    ];


    public $timestamps = true;

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }
}
