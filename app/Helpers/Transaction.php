<?php

namespace App\Helpers;

use App\Models\Users\Transaction as Trans;

class Transaction
{
    /**
     * ฟังก์ชันเช็คว่าค่าที่ส่งมาเป็น active หรือไม่
     *
     * @param mixed $value ค่าที่เราจะเช็ค (string หรือ int)
     * @param mixed $activeConstant ค่า instance หรือ constant ของ User::STATUS_ACTIVE
     * @return bool
     */
    public static function checkStatus(string $statusString, int $statusCode): bool
    {
        return $statusCode === self::toModelStatus($statusString);
    }

    /**
     * ฟังก์ชันแปลง string 'active' เป็นค่าใน model เช่น 1
     *
     * @param string $statusString ค่าที่เป็น string เช่น 'active'
     * @return mixed ค่าใน model เช่น User::STATUS_ACTIVE
     */
    public static function toModelStatus(string $statusString)
    {
        switch (strtolower($statusString)) {
            case 'pending':
                return Trans::STATUS_PENDING;
            case 'cancel':
                return Trans::STATUS_CANCEL;
            case 'awaiting_approval':
                return Trans::STATUS_AWAITING_APPROVAL;
            case 'approved':
                return Trans::STATUS_APPROVED;
            case 'rejected':
                return Trans::STATUS_REJECTED;
            case 'failed':
                return Trans::STATUS_FAILED;
            case 'refund':
                return Trans::STATUS_REFUND;
            case 'refunded':
                return Trans::STATUS_REFUNDED;
            default:
                return $statusString; // หรือ throw exception
        }
    }
}
