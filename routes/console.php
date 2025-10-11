<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

//Artisan::command('inspire', function () {
//    $this->comment(Inspiring::quote());
//})->purpose('Display an inspiring quote');


Schedule::command('app:get-match-live')->everyMinute();
//Schedule::command('app:get-match-fixture')->everyMinute();
//Schedule::command('app:get-match-fixture')->dailyAt('00:15');
Schedule::command('app:get-competition')->monthly()->at('01:00');


//require __DIR__.'/console/external-api.php'; // ไว้ทดสอบ
