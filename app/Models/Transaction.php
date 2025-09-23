<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'package_id',
        'user_reference',
        'reference_code',
        'payment_method',
        'amount',
        'points',
        'currency',
        'status',
        'slip_url',
        'paid_at',
        'approved_at',
        'admin_id',
        'expired_at',
        'updated_at',
        'created_at',
        'gateway',
        'gateway_txn_id',
        'raw_response',
    ];

    protected $hidden = [];

    public $timestamps = true;

    protected $appends = [
        'status_text',
        'type_text'
    ];

    public function user()
    {
        // สมมติว่า transactions มีคอลัมน์ user_id ที่ชี้ไปที่ users.id
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function admin()
    {
        // สมมติว่า transactions มีคอลัมน์ user_id ที่ชี้ไปที่ users.id
        return $this->belongsTo(User::class, 'admin_id', 'id')->select('id', 'name', 'username', 'role');;
    }

    const STATUS_PENDING = 1;
    const STATUS_CANCEL = 2;
    const STATUS_AWAITING_APPROVAL = 3;
    const STATUS_APPROVED = 4;
    const STATUS_REJECTED = 5;
    const STATUS_FAILED = 6;
    const STATUS_REFUND = 7;
    const STATUS_REFUNDED = 8;

    // แปลงเป็นข้อความสวย ๆ เวลาอ่าน
    public static $statusLabels = [
        self::STATUS_PENDING => 'pending',
        self::STATUS_CANCEL => 'cancel',
        self::STATUS_AWAITING_APPROVAL => 'awaiting_approval',
        self::STATUS_APPROVED => 'approved',
        self::STATUS_REJECTED => 'rejected',
        self::STATUS_FAILED => 'failed',
        self::STATUS_REFUND => 'refund',
        self::STATUS_REFUNDED => 'refunded',
    ];

    public function getStatusTextAttribute()
    {
        return self::$statusLabels[$this->status] ?? 'unknown';
    }

    const DEPOSIT = 1;
    const WITHDRAW = 2;
    public static $typeLabels = [
        self::DEPOSIT => 'deposit',
        self::WITHDRAW => 'withdraw',
    ];
    public function getTypeTextAttribute()
    {
        return self::$typeLabels[$this->type] ?? 'unknown';
    }

            //     'pending',
            //     'cancle',
            //     'awaiting_approval',
            //     'approved',
            //     'rejected',
            //     'failed',
            //     'refund',
            //     'refunded'
}
