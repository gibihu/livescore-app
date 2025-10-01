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
        Schema::create('competitions', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->bigInteger('competition_id')->index();
            $table->string('name');
            $table->boolean('is_league')->default(1);
            $table->boolean('is_cup')->default(0);
            $table->integer('tier')->nullable();
            $table->boolean('has_groups')->default(0);
            $table->boolean('active')->default(0);
            $table->boolean('national_teams_only')->default(0);
            $table->char('country_id', 36)->nullable();
            $table->char('season_id', 36)->nullable();
            $table->char('federation_id', 36)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competitions');
    }
};
