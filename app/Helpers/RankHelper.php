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
                'rate' => 10,
                'min_exp' => 0,
                'max_exp' => 0,
            ],
            [
                'id' => 1,
                'name' => 'bronze',
                'rate' => 20,
                'min_exp' => 1,
                'max_exp' => 99,
            ],
            [
                'id' => 2,
                'name' => 'silver',
                'rate' => 30,
                'min_exp' => 100,
                'max_exp' => 199,
            ],
            [
                'id' => 3,
                'name' => 'gold',
                'rate' => 40,
                'min_exp' => 200,
                'max_exp' => 299,
            ],
            [
                'id' => 4,
                'name' => 'platinum',
                'rate' => 50,
                'min_exp' => 300,
                'max_exp' => 399,
            ],
            [
                'id' => 5,
                'name' => 'daimon',
                'rate' => 60,
                'min_exp' => 400,
                'max_exp' => 499,
            ],
        ];

        return $asObject ? (object) $data : $data;
    }
}
