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
        Schema::create('user_seasons', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('name')->index();
            $table->bigInteger('season_index')->default(1)->index();
            $table->bigInteger('total_users')->default(0)->index();
            $table->tinyInteger('status')->default(0)->index();
            $table->tinyInteger('type')->default(0)->index();

            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('user_ranks', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('user_id', 36);
            $table->foreign('user_id')->references('id')->on('users');

            $table->integer('level')->default(0);
            $table->integer('score')->default(0);
            $table->tinyInteger('type')->default(0);
            $table->char('season_id', 36)->nullable()->index();
            $table->foreign('season_id')->references('id')->on('user_seasons')->onDelete('cascade');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_seasons');
        Schema::dropIfExists('user_ranks');
    }
};
