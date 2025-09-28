<?php

namespace App\Models\Busness\Point;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Exchange extends Model
{
    protected $table = 'points_exchange';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'name',
        'amount',
        'rate',
        'price',
        'account',
        'currency',
        'description',
    ];

    public $timestamps = true;

    protected $casts = [
        'id' => 'string',
    ];


    protected static function boot()
    {
        parent::boot();

        // ก่อนบันทึก record ใหม่
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
