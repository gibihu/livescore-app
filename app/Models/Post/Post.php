<?php

namespace App\Models\Post;

use App\Models\User;
use App\Traits\StatusTypeOneTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasUuids; // เพราะ id เป็น uuid
    use SoftDeletes;
    use StatusTypeOneTrait;
    protected $table = 'posts';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'ref_id',
        'ref_type',
        'title',
        'points',
        'show',
        'hidden',
        'description',
        'privacy',
        'status',
    ];

    public $timestamps = true;

    protected $casts = [
        'show' => 'json',
        'hidden' => 'json',
    ];
    protected $appends = [
        'ref_type_text',
        'privacy_text',
        'status_text',
        'type_text',
    ];
    protected $with = [
        'user',
    ];

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

    const TYPE_HANDICAP = 1;
    const TYPE_HIGHLOW = 2;
    const TYPE_EVENODD = 3;
    const TYPE_1X2 = 3;

    public static $typeLabels = [
        self::TYPE_HANDICAP => 'แฮนดิแคป',
        self::TYPE_HIGHLOW => 'สูงต่ำ',
        self::TYPE_EVENODD => 'คู่คี่',
        self::TYPE_1X2 => '1x2',
    ];
    public function getTypeTextAttribute()
    {
        return self::$typeLabels[$this->type] ?? 'unknown';
    }

    const REFTYPE_NONE = 0;
    const REFTYPE_MATCH = 1;
    public static $refTypeLabels = [
        self::REFTYPE_NONE => 'none',
        self::REFTYPE_MATCH => 'match',
    ];
    public function getRefTypeTextAttribute()
    {
        return self::$refTypeLabels[$this->ref_type] ?? 'unknown';
    }
}
