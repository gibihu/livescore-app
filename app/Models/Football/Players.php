<?php

namespace App\Models\Football;

use Illuminate\Database\Eloquent\Model;

class Players extends Model
{
    use HasUuids;
    protected $table = 'team_players';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'player_id',
        'team_id',
        'name',
        'name_th',
        'substitution',
        'shirt_number',
    ];

    protected $casts = [
        'substitution' => 'boolean',
    ];
}
