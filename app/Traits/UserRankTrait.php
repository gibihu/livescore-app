<?php

namespace App\Traits;

trait UserRankTrait
{
    const TYPE_NONE = 0;
    const TYPE_NEWPAYER = 1;

    // แปลงเป็นข้อความสวย ๆ เวลาอ่าน
    public static $typeLabels = [
        self::TYPE_NONE => null,
        self::TYPE_NEWPAYER => 'มือใหม่',
    ];

    public function getTypeTextAttribute()
    {
        return self::$typeLabels[$this->type] ?? 'unknown';
    }
}
