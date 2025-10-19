<?php

namespace App\Providers;

use App\Repositories\Contracts\MatchRepository;
use App\Repositories\Eloquent\MatchEloquentRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // bind interface → class implement
        $this->app->bind(MatchRepository::class, MatchEloquentRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
