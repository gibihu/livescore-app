<?php

use App\Http\Controllers\Pages\Dash\Admins\PostAdminDashPage;
use App\Http\Controllers\Pages\Dash\Admins\UserAdminDashController;
use App\Http\Controllers\Pages\Dash\PostPageController;
use App\Http\Controllers\Pages\Dash\Users\WalletPageController;
use App\Http\Controllers\Pages\DashPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware('auth')->prefix('dashboard')->name('dash.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard/page');
    })->name('index');

    Route::controller(WalletPageController::class)->prefix('wallet')->group(function () {
        Route::get('', 'index')->name('wallet');
    });

    Route::get('point', function () {
        return Inertia::render('dashboard/point-page');
    })->name('point');

    Route::prefix('payment')->name('payment.')->group(function(){
        Route::get('{id}', function ($id) {
            return Inertia::render('dashboard/payment', ['id' => $id]);
        })->name('show');
        Route::get('upload/{id}', function ($id) {
            return Inertia::render('dashboard/payment-upload-page', ['id' => $id]);
        })->name('upload');
    });

    Route::controller(PostPageController::class)->prefix('post')->name('post.')->group(function () {
        Route::get('', 'PostTable')->name('index');
        Route::get('create', 'CreatePostPage')->name('create');
    });
});



Route::middleware('auth', 'role:admin')->prefix('dashboard/admin')->name('dash.admin.')->group(function () {
    Route::controller(UserAdminDashController::class)->prefix('users')->name('users.')->group(function(){
        Route::get('table', 'table')->name('table');
        Route::get('setting/{id}', 'setting')->name('setting');
        Route::get('payment', function () {
            return Inertia::render('dashboard/admins/payment-list');
        })->name('payment');
    });

    Route::prefix('wallet')->name('wallet.')->group(function(){
        Route::get('table', function () {
            return Inertia::render('dashboard/admins/wallet');
        })->name('table');
    });

    Route::controller(PostAdminDashPage::class)->prefix('post')->name('post.')->group(function(){
        Route::get('table', 'PostTable')->name('table');
        Route::get('summary/{id}', 'PostSummary')->name('summary');
        Route::prefix('report')->name('report.')->group(function(){
            Route::get('/', 'ReportList')->name('list');
        });
    });

    Route::controller(DashPageController::class)->group(function(){
        Route::prefix('exchange')->name('exchange.')->group(function (){
            Route::get('{id}', 'exchangePage')->name('index');
        });
    });

});



