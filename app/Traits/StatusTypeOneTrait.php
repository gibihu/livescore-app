<?php

namespace App\Traits;

trait StatusTypeOneTrait
{
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
}
