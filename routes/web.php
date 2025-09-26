<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\LiveScoreController;
use App\Http\Controllers\ImageController;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

route::prefix('match')->name('match.')->group(function(){
    Route::get('history', function () {
        return Inertia::render('history');
    })->name('history');
});


Route::prefix('post')->name('post.')->group(function(){
    Route::get('{id}', function ($id) {
        return Inertia::render('posts/view', ['id' => $id]);
    })->name('view');
});

// show upload
Route::get('flag', [LiveScoreController:: class, 'showFlag'])->name('flag');
Route::get('image/{name}', [ImageController:: class, 'show'])->name('image.show');

require __DIR__.'/api.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/dashboard.php';
