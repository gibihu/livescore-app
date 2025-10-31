<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Users\User;
use App\Models\Users\Wallet;

class StarterSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'username' => 'FirstUserName',
                'email' => 'a@gmail.com',
                'password' => 'asdasdasd',
                'role' => 1,
            ],
            [
                'username' => 'FruitFishForFive',
                'email' => 'b@gmail.com',
                'password' => 'asdasdasd',
            ],
        ];

        foreach($data as $item){
            $user = User::create([
                'username' => $item->username,
                'email' => $item->email,
                'password' => $item->password,
            ]);

            $wallet = Wallet::create([
                'user_id' => $user->id,
            ]);
        }
    }
}
