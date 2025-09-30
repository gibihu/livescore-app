<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('report_posts', function (Blueprint $table) {
            $table->char('id', 36)->primary();

            // FK ไป users.id (คนรายงาน)
            $table->char('user_id', 36)->nullable()->index();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            // FK ไป posts.id (โพสต์ที่ถูกรายงาน)
            $table->char('post_id', 36)->nullable()->index();
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('set null');

            // หัวข้อ / ข้อความหลักของ report
            $table->string('title')->nullable();
            $table->text('description')->nullable();

            // category เช่น spam / abuse / inappropriate
            $table->string('category')->nullable()->index();

            // สถานะ report
            $table->tinyInteger('status')->default(1)->index();

            // เก็บข้อมูลเพิ่มเติม / attachments เป็น JSON
            $table->json('meta')->nullable();
            $table->json('attachments')->nullable();

            // priority หรือ severity
            $table->tinyInteger('priority')->default(0)->index();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('report_posts');
    }
};
