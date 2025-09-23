<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Apis\Admins\UserAdminApiController;
use App\Http\Controllers\Apis\Admins\TransAdminApiController;


Route::middleware('auth')->prefix('api')->name('api.')->group(function () {
    Route::prefix('dashboard/admin')->name('dash.admin.')->group(function () {
        Route::controller(UserAdminApiController::class)->group(function(){
            Route::prefix('users')->name('users.')->group(function(){
                Route::get('/', 'show')->name('table');
                Route::patch('update', 'update')->name('update');
                Route::get('payment', 'showPayment')->name('payment');
            });
        });
        Route::controller(TransAdminApiController::class)->group(function(){
            Route::prefix('trans')->name('trans.')->group(function(){
                Route::get('/', 'userPayment')->name('users.payment');
                Route::patch('update', 'update')->name('update');
            });
        });
    });
});

