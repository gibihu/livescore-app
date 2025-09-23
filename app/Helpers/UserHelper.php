<?php

namespace App\Helpers;

use App\Models\User;

class UserHelper
{
    public static function checkRole(string $roleString, int $roleCode): bool
    {
        return $roleCode === self::toModelRole($roleString);
    }
    public static function toModelRole(string $roleString)
    {
        switch (strtolower($roleString)) {
            case 'user':
                return User::ROLE_USER;
            case 'admin':
                return User::ROLE_ADMIN;
            default:
                return $statusString; // หรือ throw exception
        }
    }

    public static function checkTier(string $tireString, int $tireCode): bool
    {
        return $tireCode === self::toModelTire($tireString);
    }
    public static function toModelTire(string $tireString)
    {
        switch (strtolower($tireString)) {
            case 'bronze':
                return User::TIRE_BRONZE;
            case 'silver':
                return User::TIRE_SILVER;
            case 'gold':
                return User::TIRE_GOLD;
            case 'vip':
                return User::TIRE_VIP;
            default:
                return $statusString; // หรือ throw exception
        }
    }
}
