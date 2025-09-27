<?php
namespace App\Helpers;

use App\Models\Post;

class PostHelper
{
    public static function checkPrivacy(string $privacyString, int $Code): bool
    {
        return $Code === self::toModelPrivacy($privacyString);
    }
    public static function toModelPrivacy(string $privacyString)
    {
        switch (strtolower($privacyString)) {
            case 'public':
                return Post::PUBLIC;
            case 'private':
                return Post::PRIVATE;
            default:
                return $privacyString; // หรือ throw exception
        }
    }

}
