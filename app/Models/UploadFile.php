<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UploadFile extends Model
{
    protected $table = 'uploadfiles';

    protected $fillable = [
        'name',
        'root',
        'path',
        'type',
        'source_type',
        'source_id',
        'status',
    ];

    protected $hidden = [];
    public $timestamps = true;
    protected $appends = ['status_text'];

    const STATUS_UNUSED = 1;
    const STATUS_ACTIVE = 2;
    const STATUS_PENDING = 3;
    const STATUS_DELETED = 4;
    public static $statusLabels = [
        self::STATUS_UNUSED => 'unused',
        self::STATUS_ACTIVE => 'active',
        self::STATUS_PENDING => 'pending',
        self::STATUS_DELETED => 'deleted',
    ];
    public function getStatusTextAttribute()
    {
        return self::$statusLabels[$this->status] ?? 'unknown';
    }
}
