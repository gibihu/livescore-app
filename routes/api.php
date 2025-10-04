<?php

use App\Http\Controllers\Apis\FollowApiController;
use App\Http\Controllers\Apis\Post\PostReportApiController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Apis\UserApiController;
use App\Http\Controllers\Apis\LiveScoreApiController;
use App\Http\Controllers\Apis\PointsApiController;
use App\Http\Controllers\Apis\TransApiController;
use App\Http\Controllers\Apis\WalletApiController;
use App\Http\Controllers\Apis\PostApisController;
use App\Http\Controllers\Apis\Football\CompetitionApiController as LeagueApiController;

Route::prefix('api')->name('api.')->group(function(){
    Route::controller(PostApisController::class)->group(function(){
        Route::prefix('post')->name('post.')->group(function(){
            Route::get('', 'feed')->name('feed');
            Route::get('{id}', 'show')->name('show');
        });
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

Route::middleware('auth')->prefix('api')->name('api.')->group(function () {
    Route::controller(PostApisController::class)->prefix('post')->name('post.')->group(function(){
        Route::patch('{id}', 'unlock')->name('unlock');

        Route::controller(PostReportApiController::class)->prefix('report')->name('report.')->group(function(){
            Route::post('{post_id}', 'create')->name('create');
        });
    });

    Route::controller(FollowApiController::class)->prefix('follow')->name('follow.')->group(function(){
        Route::get('following', 'following_list')->name('following');
        Route::get('following/{id}', 'following')->name('following.id');
        Route::post('{user_id}', 'update')->name('update');
    });
});


require __DIR__ . '/api/dash/auth.php';
require __DIR__.'/api/dash/admin.php';
