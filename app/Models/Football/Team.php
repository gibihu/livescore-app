<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
class Team extends Model
{
    use HasUuids; // เพราะ id เป็น uuid
    protected $table = 'teams';

    protected $fillable = [
        'team_id',
        'name',
        'logo',
        'stadium',
        'country_id',
    ];



    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }
}
