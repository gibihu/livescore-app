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
            $table->char('ref_id', 36)->nullable();
            $table->tinyInteger('ref_type')->default(0);

            $table->string('title')->nullable();
            $table->unsignedBigInteger('points')->default(0);

            $table->json('show')->nullable();
            $table->json('hidden')->nullable();

            $table->text('description')->nullable();

            $table->tinyInteger('type')->default(1);
            $table->tinyInteger('privacy')->default(1);
            $table->tinyInteger('status')->default(2);
            // $table->enum('privacy', ['public', 'private'])->default('private');
            $table->softDeletes();
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
