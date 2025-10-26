<?php

namespace App\Providers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        App::setLocale(session('locale', config('app.locale')));

        // แชร์ locale ปัจจุบันให้ React
        Inertia::share('locale', fn () => App::getLocale());

        // แชร์ translations — โหลดไฟล์ที่ต้องการและส่งเป็น array
        Inertia::share('translations', function () {
            $locale = App::getLocale();

            // แก้ตรงนี้เพื่อเพิ่ม/ลดไฟล์ที่ต้องการส่ง
            $groups = ['auth', 'messages'];

            // cache เล็กน้อยเพื่อ performance (cache per locale)
            return Cache::remember("translations.{$locale}", 60, function () use ($groups, $locale) {
                $out = [];
                foreach ($groups as $group) {
                    // ดึง trans file แบบ group (ex: 'auth.login')
                    $out[$group] = trans($group);
                }
                return $out;
            });
        });
    }
}
