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
        Schema::create('wallet_history', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('wallet_id', 36);
            $table->bigInteger('change_amount')->default(0);
            $table->tinyInteger('role')->default(1);
            // $table->enum('role', ['add', 'subtract'])->default('subtract');
            $table->tinyInteger('type')->default(1);
            // $table->enum('type', ['used', 'topup', 'removed', 'income', 'bonus'])->default('bonus');
            $table->string('description', 255)->nullable();
            $table->timestamps();
            $table->foreign('wallet_id')->references('id')->on('wallet')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_history');
    }
};
