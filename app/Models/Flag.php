<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flag extends Model
{
    protected $table = 'flags';

    protected $fillable = [
        'flag_id',
        'type',
        'path',
    ];

    protected $hidden = [
        'id',
    ];
    protected $appends = ['type_text'];

    public $timestamps = true;

    const COUNTRY = 1;
    const TEAM = 2;

    public static $typeLabels = [
        self::COUNTRY => 'country',
        self::TEAM => 'team',
    ];


    // Accessor สำหรับ type status
    public function getTypeTextAttribute()
    {
        return self::$typeLabels[$this->type] ?? 'unknown';
    }
}
