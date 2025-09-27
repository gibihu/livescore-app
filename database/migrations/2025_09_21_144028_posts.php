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

        Schema::create('posts', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('user_id', 36);
            $table->integer('ref_id')->nullable();
            $table->text('title')->nullable();
            $table->mediumText('contents')->nullable();
            $table->char('score', 20);
            $table->char('odds', 255);
            $table->unsignedBigInteger('points')->default(0);
            $table->tinyInteger('privacy')->default(1);
            // $table->enum('privacy', ['public', 'private'])->default('private');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
