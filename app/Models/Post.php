<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'title',
        'contents',
        'points',
        'privacy',
    ];

    public $timestamps = true;
    protected $appends = [
        'privacy_text',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')->select('id', 'name', 'username');
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
