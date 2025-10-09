<?php
namespace App\Helpers;

use App\Models\Posts\Post;

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

    public static function SummaryOfType($post)
    {
        $match = $post->match;
        $score = $match->scores['score'];
        $home_score = (int) substr($score, 0, 1);
        $away_score = (int) substr($score, -1);
        switch ($post->type) {
            case Post::TYPE_HANDICAP:
                $post->result = self::CalHandicap($post, $home_score, $away_score);
                break;
            case Post::TYPE_HIGHLOW:
                $post->result = self::CalHighLow($post, $home_score, $away_score);
                break;
            case Post::TYPE_EVENODD:
                $post->result = self::CalEvenOdd($post, $home_score, $away_score);
                break;
            case Post::TYPE_1X2:
                $post->result = self::Cal1X2($post, $home_score, $away_score);
                break;
            default:
                return false;
        }

        return $post;
    }

    private static function CalHandicap($post, $h_score, $a_score)
    {
        $value = $post->hiddens->value_6->value;
        $sum_score = $h_score - $a_score;
        $sum = $sum_score + $value;
        $decimal = $sum - floor($sum);
        if($decimal == 0.5 || $decimal == 0.75){
            return 2;
        }elseif($decimal == 0.25){
            return 1;
        }elseif($decimal == 0){
            return 0;
        }elseif ($decimal == -0.25) {
            return -1;
        }elseif ($decimal == -0.5 || $decimal == -0.75) {
            return -2;
        }else{
            return false;
        }
    }

    private static function CalHighLow($post, $h_score, $a_score)
    {
        $sum = $h_score + $a_score;
        $value_1 = (int) $post->hidden['value_1'];
        $value_2 = (int) $post->hidden['value_2'];

//        dd($sum, $value_1, $value_2, $sum > $value_2);

        if($value_1 == 1){ //สูง
            if($sum > $value_2){
                return 2;
            }else{
                return -2;
            }
        }else{
            if($sum < $value_2){
                return 2;
            }else{
                return -2;
            }
        }
    }

    private static function CalEvenOdd($post, $h_score, $a_score)
    {
        $sum = $h_score + $a_score;
        $value_1 = (int) $post->hidden['value_1'];

        if($value_1 == 1) { // คู่่
            if ($sum % 2 == 0) {
                return 2;
            }else{
                return -2;
            }
        }else{
            if ($sum % 2 == 0) {
                return -2;
            }else{
                return 2;
            }
        }
    }

    private static function Cal1X2($post, $h_score, $a_score)
    {
        $value = $post->hidden['value_1'];
        $winer = $h_score > $a_score ? 1 : ($h_score < $a_score ? 2 : 'x');
        if($winer == $value){
            return 2;
        }else{
            return -2;
        }
    }
}
