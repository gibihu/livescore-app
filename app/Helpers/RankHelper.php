<?php

namespace App\Helpers;

class RankHelper
{
    public static function list(bool $asObject = true): array|object
    {
        $data = [
            [
                'id' => 0,
                'name' => 'ไม่มีอันดับ',
                'rate' => 0,
                'min_exp' => 0,
                'max_exp' => 0,
            ],
            [
                'id' => 1,
                'name' => 'bronze',
                'rate' => 5,
                'min_exp' => 1,
                'max_exp' => 99,
            ],
            [
                'id' => 2,
                'name' => 'silver',
                'rate' => 10,
                'min_exp' => 100,
                'max_exp' => 199,
            ],
            [
                'id' => 3,
                'name' => 'gold',
                'rate' => 15,
                'min_exp' => 200,
                'max_exp' => 299,
            ],
            [
                'id' => 4,
                'name' => 'platinum',
                'rate' => 20,
                'min_exp' => 300,
                'max_exp' => 399,
            ],
            [
                'id' => 5,
                'name' => 'daimon',
                'rate' => 25,
                'min_exp' => 400,
                'max_exp' => 499,
            ],
        ];

        return $asObject ? (object) $data : $data;
    }

    public static function getLevelByScore(int $score): array
    {
        $ranks = self::list(false);

        foreach ($ranks as $rank) {
            if ($score >= $rank['min_exp'] && $score <= $rank['max_exp']) {
                return $rank;
            }
        }

        // ไม่เข้า range ไหนเลย
        return [
            'id' => 0,
            'name' => 'ไม่มีอันดับ',
            'rate' => 10,
            'min_exp' => 0,
            'max_exp' => 0,
        ];
    }
}
