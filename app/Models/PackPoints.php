<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PackPoints extends Model
{
    protected $table = 'packages';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'points',
        'price',
        'published',
        'is_promo',
        'promo_title',
        'note',
    ];

    protected $hidden = [];

    public $timestamps = true;
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
