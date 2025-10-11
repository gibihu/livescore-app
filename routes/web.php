<?php

use App\Http\Controllers\Football\LiveScoreController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\Pages\WebPageController;
use App\Http\Controllers\Pages\Webs\PostWebPageController;
use App\Http\Controllers\Pages\Webs\UserWebPageController;
use Illuminate\Support\Facades\Route;

Route::controller(WebPageController::class)->name('web.')->group(function () {
    Route::get('/', 'home')->name('home');

    route::prefix('match')->name('match.')->group(function(){
        Route::get('history', 'historyMatch')->name('history');
        Route::get('fixture', 'fixturesMatch')->name('fixture');
        Route::get('show/{id}', 'showMatch')->name('view');
    });


    Route::prefix('post')->controller(PostWebPageController::class)->name('post.')->group(function(){
        Route::get('', 'PostShowAll')->name('all');
        Route::get('{id}', 'PostShowOne')->name('view');
        Route::prefix('report')->name('report.')->group(function(){
            Route::get('{post_id}', 'ReportPage')->name('index');
        });
    });
    Route::controller(UserWebPageController::class)->prefix('user')->name('user.')->group(function(){
        Route::get('{id}', 'view')->name('view');
    });
});

//Route::get('/', function () {
//    return Inertia::render('home');
//})->name('home');


// show upload
Route::get('flag', [LiveScoreController:: class, 'showFlag'])->name('flag');
Route::get('image/{name}', [ImageController:: class, 'show'])->name('image.show');

Route::prefix('test')->name('test.')->group(function(){
    Route::get('/', [\App\Http\Controllers\Users\SeasonController::class, 'GetRank'])->name('index');
    Route::get('standing', [\App\Http\Controllers\Football\CompetitionStandingController::class, 'index'])->name('standing');
});


require __DIR__.'/api.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/dashboard.php';
