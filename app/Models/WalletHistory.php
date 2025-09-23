<?php

namespace App\Models;

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
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;

    public function wallet()
    {
        // สมมติว่า transactions มีคอลัมน์ user_id ที่ชี้ไปที่ users.id
        return $this->belongsTo(Wallet::class, 'wallet_id', 'id');
    }


    const TYPE_USED = 1;
    const TYPE_TOPUP = 2;
    const TYPE_REMOVED = 2;
    const TYPE_INCOME = 2;
    const TYPE_BONUS = 2;
    public static $typeLabels = [
        self::TYPE_USED => 'used',
        self::TYPE_TOPUP => 'topup',
        self::TYPE_REMOVED => 'removed',
        self::TYPE_INCOME => 'income',
        self::TYPE_BONUS => 'bonus',
    ];
    public function getTypeTextAttribute()
    {
        return self::$typeLabels[$this->type] ?? 'unknown';
    }
}
