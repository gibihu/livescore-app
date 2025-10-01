<?php

use App\Http\Controllers\Pages\WebPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\LiveScoreController;
use App\Http\Controllers\ImageController;

Route::controller(WebPageController::class)->name('web.')->group(function () {
    Route::get('/', 'home')->name('home');

    route::prefix('match')->name('match.')->group(function(){
        Route::get('history', function () {
            return Inertia::render('history');
        })->name('history');
        Route::get('fixture', function(){
            return Inertia::render('fixture');
        })->name('fixture');
        Route::get('show/{match_id}', 'showMatch')->name('show');
    });


    Route::prefix('post')->name('post.')->group(function(){
        Route::get('/ ', 'showPostAll')->name('show');
        Route::get('{id}', function ($id) {
            return Inertia::render('posts/view', ['id' => $id]);
        })->name('view');

        Route::controller(WebPageController::class)->prefix('report')->name('report.')->group(function(){
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
