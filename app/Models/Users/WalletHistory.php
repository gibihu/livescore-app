<?php

namespace App\Models\Users;

use Illuminate\Database\Eloquent\Model;

class WalletHistory extends Model
{
    protected $table = 'wallet_history';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'wallet_id',
        'change_amount',
        'role',
        'type',
        'description',
        'change_amount',
        'references',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'references' => 'json',
    ];
    protected $appends = [
        'type_text',
        'role_text',
    ];

    public $timestamps = true;

    public function wallet()
    {
        // สมมติว่า transactions มีคอลัมน์ user_id ที่ชี้ไปที่ users.id
        return $this->belongsTo(Wallet::class, 'wallet_id', 'id');
    }

    const ROLE_ADD = 1;
    const ROLE_SUB = 2;
    public static $roleLabels = [
        self::ROLE_ADD => 'add',
        self::ROLE_SUB => 'subtract',
    ];
    public function getRoleTextAttribute()
    {
        return self::$roleLabels[$this->role] ?? 'unknown';
    }

    const TYPE_USED = 1;
    const TYPE_TOPUP = 2;
    const TYPE_REMOVED = 3;
    const TYPE_INCOME = 4;
    const TYPE_BONUS = 5;
    public static $typeLabels = [
        self::TYPE_USED => 'used', //  ใช้
        self::TYPE_TOPUP => 'topup', // เติม
        self::TYPE_REMOVED => 'removed', // ลบ
        self::TYPE_INCOME => 'income', // รายได้
        self::TYPE_BONUS => 'bonus', // โบนัส
    ];
    public function getTypeTextAttribute()
    {
        return self::$typeLabels[$this->type] ?? 'unknown';
    }
}
