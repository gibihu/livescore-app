<?php

namespace App\Helpers;

use App\Models\Users\User;

class RankHelper
{
    public static function list(bool $asObject = true): array|object
    {
        $data = [
            [
                'name' => 'bronze',
                'need_exp' => 1,
                'max_exp' => 99,
            ],
            [
                'name' => 'silver',
                'need_exp' => 100,
                'max_exp' => 199,
            ],
            [
                'name' => 'gold',
                'need_exp' => 200,
                'max_exp' => 299,
            ],
            [
                'name' => 'platinum',
                'need_exp' => 300,
                'max_exp' => 399,
            ],
            [
                'name' => 'daimon',
                'need_exp' => 400,
                'max_exp' => 499,
            ],
        ];

        return $asObject ? (object) $data : $data;
    }
}
