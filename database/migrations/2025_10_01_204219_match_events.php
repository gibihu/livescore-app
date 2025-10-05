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
        Schema::create('match_events', function (Blueprint $table) {
            $table->increments('id');
            $table->char('match_id', 36)->nullable()->unique();
            $table->foreign('match_id')->references('id')->on('matches')->nullOnDelete();


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
        Schema::dropIfExists('match_events');
    }
};
