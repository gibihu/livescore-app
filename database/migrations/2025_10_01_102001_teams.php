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
        Schema::create('teams', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->bigInteger('team_id')->index();
            $table->string('name');
            $table->string('name_th')->nullable();
            $table->string('logo')->nullable();
            $table->string('stadium')->nullable();

            // FK ไป countries
            $table->char('country_id', 36)->nullable()->index();
            $table->foreign('country_id')->references('id')->on('countries')->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('teams');
        Schema::enableForeignKeyConstraints();
    }
};
