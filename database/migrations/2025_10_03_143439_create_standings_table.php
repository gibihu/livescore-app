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
        Schema::create('standings', function (Blueprint $table) {
            $table->char('id', 36)->primary();

            $table->char('league_id', 36)->nullable();
            $table->char('season_id', 36)->nullable()->unique();
            $table->foreign('season_id')->references('id')->on('seasons')->onDelete('set null');
            $table->char('team_id', 36)->nullable()->unique();
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('set null');
            $table->char('competition_id', 36)->nullable()->unique();
            $table->foreign('competition_id')->references('id')->on('competitions')->onDelete('set null');
            $table->char('group_id', 36)->nullable();
            $table->char('stage_id', 36)->nullable();

            $table->string('name'); // ชื่อทีม เช่น Arsenal
            $table->string('group_name')->nullable();
            $table->string('stage_name')->nullable();

            $table->integer('rank')->nullable();
            $table->integer('points')->default(0);
            $table->integer('matches')->default(0);
            $table->integer('won')->default(0);
            $table->integer('drawn')->default(0);
            $table->integer('lost')->default(0);

            $table->integer('goals_scored')->default(0);
            $table->integer('goals_conceded')->default(0);
            $table->integer('goal_diff')->default(0);

            // form เก็บ array W/D/L ล่าสุด
            $table->json('form')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('standings');
    }
};
