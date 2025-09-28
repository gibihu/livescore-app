<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('points_exchange', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('user_id', 36);
            $table->string('name')->nullable();
            $table->unsignedBigInteger('amount')->unsigned();
            $table->decimal('rate', 12, 2)->unsigned();
            $table->decimal('price', 12, 2)->unsigned();
            $table->string('account', 100);
            $table->string('currency', 10)->default('THB');
            $table->text('description');
            $table->tinyInteger('status')->default(1);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('points_exchange');
    }
};
