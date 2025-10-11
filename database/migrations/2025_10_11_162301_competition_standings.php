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
        Schema::create('competition_group_standings', function (Blueprint $table) {
           $table->char('id', 36)->primary();
           $table->integer('rank');
           $table->integer('points');
           $table->integer('matches');
           $table->integer('goal_diff');
           $table->integer('goals_scored');
           $table->integer('goals_conceded');
           $table->integer('lost');
           $table->integer('drawn');
           $table->integer('won');
           $table->char('team_id', 36)->nullable();
           $table->foreign('team_id')->references('id')->on('teams')->onDelete('set null');

           $table->softDeletes();
           $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competition_group_standings');
    }
};
