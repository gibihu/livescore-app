<?php

namespace App\Models\Posts;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class PostReport extends Model
{
    use SoftDeletes;

    protected $table = 'report_posts';
    public $incrementing = false;
    protected $keyType = 'string'; // เพราะใช้ char(36)

    protected $fillable = [
        'id',
        'user_id',
        'post_id',
        'title',
        'description',
        'category',
        'status',
        'meta',
        'attachments',
        'priority',
    ];

    protected $casts = [
        'meta' => 'json',
        'attachments' => 'json',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    // Relation
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id', 'id');
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
