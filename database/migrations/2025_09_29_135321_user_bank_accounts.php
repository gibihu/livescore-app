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
        Schema::create('user_bank_accounts', function (Blueprint $table) {
            $table->char('id', 36)->primary()->unique();
            $table->char('user_id', 36)->index(); // foreign key ไปยัง users.id
            $table->string('bank_name_th'); // ชื่อธนาคาร
            $table->string('bank_name_en'); // ชื่อธนาคาร
            $table->string('account_number'); // เลขบัญชี
            $table->string('account_name_th'); // ชื่อบัญชี (เจ้าของ)
            $table->string('account_name_en')->nullable(); // ชื่อบัญชี (เจ้าของ)
            $table->string('branch')->nullable(); // สาขา (ไม่บังคับ)
            $table->boolean('is_primary')->default(false); // บัญชีหลักของ user
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_bank_accounts');
    }
};
