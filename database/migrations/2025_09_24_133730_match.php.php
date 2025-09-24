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
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->integer('match_id')->unique();
            $table->json('json')->nullable();
            $table->enum('status', [
                'NOT STARTED',
                'IN PLAY',
                'HALF TIME BREAK',
                'ADDED TIME',
                'FINISHED'
            ])->default('FINISHED');
            $table->boolean('is_updating')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
