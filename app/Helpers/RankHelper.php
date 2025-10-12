<?php

namespace App\Helpers;

use App\Models\Users\User;

class RankHelper
{
    public static function list(bool $asObject = true): array|object
    {
        $data = [
            [
                'id' => 0,
                'name' => 'ไม่มีอันดับ',
                'min_exp' => 0,
                'max_exp' => 0,
            ],
            [
                'id' => 1,
                'name' => 'bronze',
                'min_exp' => 1,
                'max_exp' => 99,
            ],
            [
                'id' => 2,
                'name' => 'silver',
                'min_exp' => 100,
                'max_exp' => 199,
            ],
            [
                'id' => 3,
                'name' => 'gold',
                'min_exp' => 200,
                'max_exp' => 299,
            ],
            [
                'id' => 4,
                'name' => 'platinum',
                'min_exp' => 300,
                'max_exp' => 399,
            ],
            [
                'id' => 5,
                'name' => 'daimon',
                'min_exp' => 400,
                'max_exp' => 499,
            ],
        ];

        return $asObject ? (object) $data : $data;
    }
}
