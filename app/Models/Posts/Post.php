<?php

namespace App\Models\Posts;

use App\Models\Football\Matchs;
use App\Models\Users\User;
use App\Traits\StatusTypeOneTrait;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'result',
        'exp',
        'ss_id',
        'view',
        'summary_at',
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
        'result_text',
    ];
    protected $with = [
        'user',
        'season',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')->select('id', 'name', 'username', 'tier', 'rank_id');
    }
    public function season()
    {
        return $this->belongsTo(Season::class, 'ss_id', 'id');
    }

    public function match()
    {
        // ใช้ hasOne ปลอม ๆ ก็ได้ แต่เรา override query เอง
        return $this->hasOne(Matchs::class, 'id', 'ref_id');
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
    const TYPE_1X2 = 4;

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



    const RESULT_BROK_FULL = -2;
    const RESULT_BROK_HALF = -1;
    const RESULT_BASE = 0;
    const RESULT_GOT_HALF = 1;
    const RESULT_GOT_FULL = 2;
    public static $resultLabels = [
        self::RESULT_BROK_FULL => 'เสียเต็ม',
        self::RESULT_BROK_HALF => 'เสียครึ่ง',
        self::RESULT_BASE => 'เสมอ',
        self::RESULT_GOT_HALF => 'ได้ครึ่ง',
        self::RESULT_GOT_FULL => 'ได้เต็ม',
    ];
    public function getResultTextAttribute()
    {
        return self::$resultLabels[$this->result] ?? 'unknown';
    }
}
