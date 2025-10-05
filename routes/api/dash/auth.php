<?php

use App\Http\Controllers\Apis\Dash\PostApiDashController;
use App\Http\Controllers\Apis\FollowApiController;
use App\Http\Controllers\Apis\Post\PostReportApiController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Apis\UserApiController;
use App\Http\Controllers\Apis\LiveScoreApiController;
use App\Http\Controllers\Apis\PointsApiController;
use App\Http\Controllers\Apis\TransApiController;
use App\Http\Controllers\Apis\WalletApiController;
use App\Http\Controllers\Apis\PostApisController;



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

//    dashboard
    Route::prefix('dashboard')->name('dash.')->group(function () {
        Route::controller(WalletApiController::class)->group(function(){
            Route::prefix('wallet')->name('wallet.')->group(function(){
                Route::get('history', 'showHistory')->name('history');
                Route::get('income', 'showIncome')->name('income');
            });
        });
        Route::controller(PointsApiController::class)->group(function(){
            Route::prefix('point')->name('point.')->group(function(){
                Route::get('packages', 'show')->name('packages');
                Route::get('generate', 'generatePackage')->name('generate');
            });
        });
        Route::controller(TransApiController::class)->group(function(){
            Route::prefix('transaction')->name('transaction.')->group(function(){
                Route::post('create', 'store')->name('create');
                Route::post('upload', 'UplodSlip')->name('paid');
                Route::get('history', 'showAll')->name('history');
                Route::patch('update', 'update_onec')->name('update');
                Route::get('{id}', 'show')->name('show');
                Route::post('exchange', 'withdraw')->name('exchange');
            });
        });
        Route::prefix('post')->name('post.')->group(function(){
            Route::controller(PostApisController::class)->group(function(){
                Route::get('{id}', 'show')->name('show');
                Route::patch('update', 'update')->name('update');
                Route::delete('delete/{id}', 'delete')->name('delete');
            });
            Route::controller(PostApiDashController::class)->group(function(){
                Route::get('/', 'show')->name('table');
                Route::post('create', 'store')->name('create');
            });
        });

        Route::controller(LiveScoreApiController::class)->group(function(){
            Route::prefix('match')->name('match.')->group(function(){
                Route::get('{id}', 'match_detail')->name('detail');
            });
        });
    });
});

// Route::middleware('auth')->prefix('api')->name('api.')->group(function () {
//     Route::prefix('dashboard/admin')->name('dash.admin.')->group(function () {
//         Route::controller(UserApiController::class)->group(function(){
//             Route::prefix('users')->name('users.')->group(function(){
//                 Route::get('/', 'show')->name('table');
//                 Route::patch('update', 'update')->name('update');
//                 Route::get('payment', 'showPayment')->name('payment');
//             });
//         });
//     });
// });

