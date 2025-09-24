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
        Schema::create('inventory', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('user_id', 36)->uniqid();
            $table->char('source_id', 36);
            $table->string('source_type', 20)->nullable();
            $table->integer('amount')->default(1);
            $table->tinyInteger('status')->default(1);
            // $table->enum('status', [
            //     'pending',
            //     'cancle',
            //     'awaiting_approval',
            //     'approved',
            //     'rejected',
            //     'failed',
            //     'refund',
            //     'refunded'
            // ])->default('pending');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
