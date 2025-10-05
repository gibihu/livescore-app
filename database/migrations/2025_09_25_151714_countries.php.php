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
        Schema::create('countries', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->bigInteger('country_id')->index();
            $table->string('name');
            $table->string('name_th')->nullable();
            $table->string('flag')->nullable();
            $table->string('fifa_code')->nullable();
            $table->string('uefa_code')->nullable();
            $table->boolean('is_real')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
