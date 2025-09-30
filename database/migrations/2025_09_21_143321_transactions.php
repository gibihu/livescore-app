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
        Schema::create('transactions', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('user_id', 36);
            $table->char('package_id', 36)->nullable();
            $table->string('user_reference', 10)->nullable();
            $table->string('reference_code', 100)->nullable();
            $table->tinyInteger('payment_method')->default(1);
            $table->string('account_name', 100)->nullable();
            $table->string('account_number', 100)->nullable();
            $table->decimal('amount', 12, 2);
            $table->decimal('points', 12, 0);
            $table->decimal('rate', 12, 2)->nullable();
            $table->string('currency', 10)->default('THB');
            $table->tinyInteger('type')->default(1);
            $table->tinyInteger('status')->default(1);
            $table->string('slip_url', 255)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->char('admin_id', 36)->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamps();
            $table->string('gateway', 50)->nullable();
            $table->string('gateway_txn_id', 100)->nullable();
            $table->json('raw_response')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('set null');
        });
            // $table->enum('type', ['deposit', 'withdraw'])->default('deposit');
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
