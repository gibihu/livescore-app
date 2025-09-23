<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


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
        Route::get('create', function () {
            return Inertia::render('dashboard/create-post');
        })->name('create');
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
});



