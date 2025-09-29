<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class UserBankAccount extends Model
{
    use HasFactory;

    protected $table = 'user_bank_accounts';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'bank_name_th',
        'bank_name_en',
        'account_number',
        'account_name_th',
        'account_name_en',
        'branch',
        'is_primary',
    ];
    public $timestamps = true;

    protected static function boot()
    {
        parent::boot();

        // ก่อนบันทึก record ใหม่
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
    // Mutators - เข้ารหัสเวลา set ค่า
    public function setAccountNumberAttribute($value)
    {
        $this->attributes['account_number'] = Crypt::encryptString($value);
    }

    public function setAccountNameThAttribute($value)
    {
        $this->attributes['account_name_th'] = Crypt::encryptString($value);
    }

    public function setAccountNameEnAttribute($value)
    {
        $this->attributes['account_name_en'] = Crypt::encryptString($value);
    }

    // Accessors - ถอดรหัสเวลา get ค่า
    public function getAccountNumberAttribute($value)
    {
        return Crypt::decryptString($value);
    }

    public function getAccountNameThAttribute($value)
    {
        return Crypt::decryptString($value);
    }

    public function getAccountNameEnAttribute($value)
    {
        return Crypt::decryptString($value);
    }

    // Relation
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
