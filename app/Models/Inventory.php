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

    protected $appends = [
        'source_type_text',
    ];


    const TYPE_POST = 1;
    const TYPE_ITEM = 2;

    public static $sourceTypeLabels = [
        self::TYPE_POST => 'Post',
        self::TYPE_ITEM => 'Item',
    ];

    // Accessor
    public function getSourceTypeTextAttribute()
    {
        return self::$sourceTypeLabels[$this->source_type] ?? 'Unknown';
    }
}
