<?php

namespace App\Models\Posts;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    use HasUuids; // เพราะ id เป็น uuid
    protected $table = 'user_seasons';
    public $incrementing = false;  // UUID ไม่ใช่ auto-increment
    protected $keyType = 'string'; // เพราะ UUID เป็น string

    protected $fillable = [
        'name',
        'season_index',
        'total_users',
        'status',
        'type',
    ];
    protected $appends = [
        'status_text',
    ];

    public $timestamps = true;


    const NOT_START = 0;
    const STARTED = 1;
    const END = 2;
    public static $statusLabels = [
        self::NOT_START => 'ยังไม่เริ่ม',
        self::STARTED => 'เริ่มแล้ว',
        self::END => 'จบแล้ว',
    ];
    public function getStatusTextAttribute()
    {
        return self::$statusLabels[$this->status] ?? 'unknown';
    }
}
