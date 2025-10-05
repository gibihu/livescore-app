<?php

use App\Http\Controllers\Football\LiveScoreController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\Pages\WebPageController;
use App\Http\Controllers\Pages\Webs\PostWebPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
});

//Route::get('/', function () {
//    return Inertia::render('home');
//})->name('home');


// show upload
Route::get('flag', [LiveScoreController:: class, 'showFlag'])->name('flag');
Route::get('image/{name}', [ImageController:: class, 'show'])->name('image.show');



require __DIR__.'/api.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/dashboard.php';
