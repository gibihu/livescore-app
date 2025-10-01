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
        Schema::create('match_players', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('player_id', 36);
            $table->char('team_id', 36)->nullable()->unique();
            $table->foreign('team_id')->references('id')->on('teams')->nullOnDelete();

            $table->string('name');
            $table->boolean('substitution')->default(false);
            $table->string('shirt_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('match_players');
    }
};
