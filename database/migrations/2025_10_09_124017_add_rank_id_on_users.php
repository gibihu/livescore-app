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
        Schema::table('users', function (Blueprint $table) {
            $table->char('rank_id', 36)->nullable()->after('role');
            $table->foreign('rank_id')->references('id')->on('user_ranks')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            try {
                $table->dropForeign(['rank_id']);
            } catch (\Exception $e) {
                // เงียบ ๆ ถ้าไม่มี foreign key นี้
            }
            if (Schema::hasColumn('users', 'rank_id')) {
                $table->dropColumn('rank_id');
            }
        });
    }
};
