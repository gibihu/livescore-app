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
        Schema::create('competition_stages', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->integer('stage_id');
            $table->string('name');

            $table->char('competition_id', 36)->nullable();
            $table->foreign('competition_id')->references('id')->on('competitions')->onDelete('set null');

            $table->char('season_id', 36)->nullable();
            $table->foreign('season_id')->references('id')->on('seasons')->onDelete('set null');

            $table->char('group_id', 36)->nullable();
            $table->foreign('group_id')->references('id')->on('competition_groups')->onDelete('set null');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competition_stages');
    }
};
