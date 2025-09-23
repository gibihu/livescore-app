<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PackPoints;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::firstOrCreate(
        //     ['email' => 'test@example.com'],
        //     [
        //         'name' => 'Test User',
        //         'password' => Hash::make('password'),
        //         'email_verified_at' => now(),
        //     ]
        // );

        $packs = [
            [
                'points' => 100,
                'price' => 10,
                'description' => 'แพ็คเริ่มต้นสำหรับผู้ใช้ใหม่',
            ],
            [
                'points' => 200,
                'price' => 20,
                'description' => '',
            ],
            [
                'points' => 500,
                'price' => 45,
                'description' => 'แพ็คยอดนิยม',
            ],
            [
                'points' => 1000,
                'price' => 80,
                'description' => '',
            ],
            [
                'points' => 2000,
                'price' => 150,
                'description' => 'แพ็คสุดคุ้มสำหรับผู้ใช้ประจำ',
            ],
        ];

        foreach ($packs as $pack) {
            PackPoints::firstOrCreate(
                ['points' => $pack['points']], // เงื่อนไขในการหา
                $pack, // ข้อมูลที่จะใส่ถ้าไม่เจอ
            );
        }
    }
}
