<?php

namespace App\Helpers;

use App\Models\Users\User;

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
                return $roleString; // หรือ throw exception
        }
    }

    public static function checkTier(string $tierString, int $tierCode): bool
    {
        return $tierCode === self::toModelTire($tierString);
    }
    public static function toModelTire(string $tierString)
    {
        switch (strtolower($tierString)) {
            case 'bronze':
                return User::TIER_BRONZE;
            case 'silver':
                return User::TIER_SILVER;
            case 'gold':
                return User::TIER_GOLD;
            case 'vip':
                return User::TIER_VIP;
            default:
                return $tierString; // หรือ throw exception
        }
    }

    public static function MaxFromTier(int $tierCode)
    {
        switch ($tierCode) {
            case User::TIER_BRONZE:
                return 1;
                break;
            case User::TIER_SILVER:
                return 3;
                break;
            case User::TIER_GOLD:
                return 5;
                break;
            case User::TIER_VIP:
                return 5;
                break;
            default:
                return 3;
            break;
        }
    }
}
