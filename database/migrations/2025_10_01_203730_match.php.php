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
        Schema::create('matches', function (Blueprint $table) {
            $table->uuid('id')->primary(); // uuid สำหรับระบบเรา
            $table->unsignedBigInteger('match_id')->nullable()->index(); // id จาก API (อาจเป็น null ในกรณีแมตช์ล่วงหน้า)
            $table->unsignedBigInteger('fixture_id')->nullable()->index();

            // FK competition
            $table->char('competition_id', 36)->nullable()->index();
            $table->foreign('competition_id')->references('id')->on('competitions')->nullOnDelete();

            // FK country
            $table->char('country_id', 36)->nullable()->index();
            $table->foreign('country_id')->references('id')->on('countries')->nullOnDelete();

            // FK team (home/away)
            $table->char('home_team_id', 36)->nullable()->index();
            $table->foreign('home_team_id')->references('id')->on('teams')->nullOnDelete();

            $table->char('away_team_id', 36)->nullable()->index();
            $table->foreign('away_team_id')->references('id')->on('teams')->nullOnDelete();

            // fields อื่น ๆ
            $table->string('round')->nullable();
            $table->date('date')->nullable();
            $table->string('location')->nullable();
            $table->string('status')->nullable();
            $table->string('time')->nullable();
            $table->time('scheduled')->nullable();
            $table->string('live_status')->default('NOT_LIVE');

            // odds
            $table->text('odds')->nullable();

            // scores / outcomes
            $table->text('scores')->nullable();
            $table->text('outcomes')->nullable();

            // federation / group
            $table->char('federation_id', 36)->nullable();
            $table->foreign('federation_id')->references('id')->on('federations')->nullOnDelete();
            $table->char('group_id', 36)->nullable();

            // URLs
            $table->text('urls')->nullable();

            $table->timestamp('added')->nullable();
            $table->timestamp('last_changed')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('matches');
        Schema::enableForeignKeyConstraints();
    }
};
