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
        Schema::create('uploadfiles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('root');
            $table->text('path');
            $table->text('name');
            $table->string('type', 10)->default('image');
            $table->string('source_type', 20)->nullable();
            $table->char('source_id', 36);
            $table->tinyInteger('status')->default(1);
            // $table->enum('status', ['unused', 'active', 'pending', 'deleted'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uploadfiles');
    }
};
