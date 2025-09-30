<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Post extends Model
{
    use SoftDeletes;
    protected $table = 'posts';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'ref_id',
        'title',
        'contents',
        'points',
        'privacy',
        'odds',
        'score',
    ];

    public $timestamps = true;

    protected $casts = [
        'odds' => 'json',
    ];
    protected $appends = [
        'privacy_text',
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


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')->select('id', 'name', 'username', 'tier');
    }

    const PUBLIC = 1;
    const PRIVATE = 2;
    public static $privacyLabels = [
        self::PUBLIC => 'public',
        self::PRIVATE => 'private',
    ];
    public function getPrivacyTextAttribute()
    {
        return self::$privacyLabels[$this->privacy] ?? 'unknown';
    }
}
