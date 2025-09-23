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
        Schema::create('packages', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->unsignedBigInteger('points');
            $table->decimal('price', 21, 2)->unsigned();
            $table->decimal('price_per_points', 12, 2)->unsigned()->nullable();
            $table->boolean('published')->default(true);
            $table->boolean('is_promo')->default(false);
            $table->string('promo_title', 50)->nullable();
            $table->string('note', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
