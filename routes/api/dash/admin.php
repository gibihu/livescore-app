<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Apis\Dash\Admin\User\UserAdminDashApiController;
use App\Http\Controllers\Apis\Admins\UserAdminApiController;
use App\Http\Controllers\Apis\Admins\TransAdminApiController;
use App\Http\Controllers\Apis\Admins\WalletAdminApiController;


Route::middleware('auth', 'role:admin')->prefix('api')->name('api.')->group(function () {
    Route::prefix('dashboard/admin')->name('dash.admin.')->group(function () {
        Route::controller(UserAdminApiController::class)->group(function(){
            Route::prefix('users')->name('users.')->group(function(){
                Route::get('/', 'show')->name('table');
                Route::patch('update', 'update')->name('update');
                Route::get('payment', 'showPayment')->name('payment');
                Route::prefix('tier')->name('tier.')->group(function(){
                    Route::patch('{user_id}/tier', 'update_tier', )->name('update');
                });
            });
        });
        Route::controller(UserAdminDashApiController::class)->group(function(){
            Route::prefix('users')->name('users.')->group(function(){
                Route::post('setting/{id}', 'store')->name('store');
            });
        });
        Route::controller(TransAdminApiController::class)->group(function(){
            Route::prefix('trans')->name('trans.')->group(function(){
                Route::get('/', 'userPayment')->name('users.payment');
                Route::get('history', 'userPaymentHistory')->name('users.history');
                Route::patch('update', 'update')->name('update');
                Route::post('exchange', 'UpdateExchange')->name('exchange');
            });
        });
        Route::controller(WalletAdminApiController::class)->prefix('wallet')->name('wallet.')->group(function(){
            Route::get('/', 'show')->name('table');
        });
    });
});

