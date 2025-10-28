<?php

use App\Http\Controllers\Apis\Football\CompetitionApiController as LeagueApiController;
use App\Http\Controllers\Apis\Football\LiveScoreApiController;
use App\Http\Controllers\Apis\Post\PostApisController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Apis\Users\RankUserApiController;

Route::prefix('api')->name('api.')->group(function(){
    Route::controller(PostApisController::class)->group(function(){
        Route::prefix('post')->name('post.')->group(function(){
            Route::get('', 'feed')->name('feed');
            Route::get('{id}', 'show')->name('show');
        });
    });
    Route::controller(RankUserApiController::class)->prefix('rank')->name('rank.')->group(function(){
        Route::get('/feed', 'feed')->name('feed');
    });

    Route::controller(LiveScoreApiController::class)->group(function(){
        Route::prefix('match')->name('match.')->group(function(){
            Route::get('live', 'LiveScore')->name('live');
            Route::get('event', 'event')->name('event');
            Route::get('history', 'history')->name('history');
            Route::get('live', 'LiveScore')->name('live');
            Route::get('fixture', 'fixture')->name('fixture');
        });
    });

    Route::controller(LeagueApiController::class)->prefix('league')->name('league.')->group(function(){
        Route::get('football/all', 'all')->name('all');
        Route::get('football/{id}', 'show')->name('show');
    });

});


require __DIR__ . '/api/dash/auth.php';
require __DIR__.'/api/dash/admin.php';
