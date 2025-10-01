<?php

use App\Http\Controllers\Pages\Dash\PostPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Football\CompetitionController as LeagueController;
use App\Http\Controllers\Pages\DashPageController;


Route::middleware('auth')->prefix('dashboard')->name('dash.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard/page');
    })->name('index');

    Route::get('wallet', function () {
        return Inertia::render('dashboard/wallet');
    })->name('wallet');

    Route::get('point', function () {
        return Inertia::render('dashboard/point-page');
    })->name('point');

    Route::prefix('post')->name('post.')->group(function(){
        Route::get('/', function () {
            return Inertia::render('dashboard/posts-page');
        })->name('index');
        // Route::get('edit/{id}', function ($id) {
        //     return Inertia::render('dashboard/post-edit-page', ['id' => $id]);
        // })->name('edit');
    });

    Route::prefix('payment')->name('payment.')->group(function(){
        Route::get('{id}', function ($id) {
            return Inertia::render('dashboard/payment', ['id' => $id]);
        })->name('show');
        Route::get('upload/{id}', function ($id) {
            return Inertia::render('dashboard/payment-upload-page', ['id' => $id]);
        })->name('upload');
    });

    Route::controller(PostPageController::class)->prefix('post')->name('post.')->group(function () {
        Route::get('create', 'CreatePostPage')->name('create');
    });
});



Route::middleware('auth', 'role:admin')->prefix('dashboard/admin')->name('dash.admin.')->group(function () {
    Route::prefix('users')->name('users.')->group(function(){
        Route::get('table', function () {
            return Inertia::render('dashboard/admins/users');
        })->name('table');
        Route::get('payment', function () {
            return Inertia::render('dashboard/admins/user-payment');
        })->name('payment');
    });

    Route::prefix('wallet')->name('wallet.')->group(function(){
        Route::get('table', function () {
            return Inertia::render('dashboard/admins/wallet');
        })->name('table');
    });

    Route::prefix('post')->name('post.')->group(function(){
        Route::get('table', function () {
            return Inertia::render('dashboard/admins/posts');
        })->name('table');

        Route::controller(PostPageController::class)->prefix('report')->name('report.')->group(function(){
            Route::get('/', 'ReportList')->name('list');
        });
    });

    Route::controller(LeagueController::class)->group(function(){
        Route::get('football/setup', 'index')->name('setup');
        Route::get('football/setup/fixture', 'fixture')->name('fixture');
        Route::get('football/setup/match', 'match')->name('match');

    });

    Route::controller(DashPageController::class)->group(function(){
        Route::prefix('exchange')->name('exchange.')->group(function (){
            Route::get('{id}', 'exchangePage')->name('index');
        });
    });

});



