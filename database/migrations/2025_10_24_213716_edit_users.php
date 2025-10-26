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
        Schema::table('users', function (Blueprint $table) {
            $table->text('avatar')->nullable()->after('email');
            $table->text('bio')->nullable()->after('avatar');
            $table->timestamp('paid_at')->nullable()->after('rank_id');
            $table->decimal('custom_rate', 20, 2)->default(0)->after('paid_at');
        });
    }
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('avatar');
            $table->dropColumn('bio');
            $table->dropColumn('paid_at');
            $table->dropColumn('custom_rate');
        });
    }
};
