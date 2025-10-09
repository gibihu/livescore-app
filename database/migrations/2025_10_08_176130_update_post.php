<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->tinyInteger('result')->default(0);
            $table->integer('exp')->default(0);
            $table->char('ss_id', 36)->nullable()->index();
            $table->foreign('ss_id')->references('id')->on('user_seasons')->onDelete('set null');
            $table->integer('view')->default(0);
            $table->timestamp('summary_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            try {
                $table->dropForeign(['ss_id']);
            } catch (\Exception $e) {
                // เงียบ ๆ ถ้าไม่มี foreign key นี้
            }
            if (Schema::hasColumn('posts', 'ss_id')) {
                $table->dropColumn('ss_id');
            }
            $table->dropColumn(['result', 'exp', 'view', 'summary_at']);
        });
    }
};
