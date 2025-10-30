<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Posts\Post;
use Carbon\Carbon;
use App\Helpers\PostHelper;
use App\Helpers\RateHelper;
use Illuminate\Support\Facades\Log;

class SummaryPostMatch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:summary-post-match';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $start = Carbon::now();
        Log::info('');
        Log::info('=== Start Update Summay Posts Job ===');
        try{
            $posts = Post::with('user', 'match')->where('ref_type', Post::REFTYPE_MATCH)->get();

            foreach($posts as $post){
                if($post->type == Post::TYPE_HANDICAP){
                    $post->hiddens = (object) [
                        'value_2' => RateHelper::getItem($post->hidden["value_2"]),
                    ];
                }
                if(!$post->summary_at && $post->match->live_status == 'END_LIVE' && $post->match->status == "FINISHED"){
                    $post = PostHelper::SummaryOfType($post);
                    $post->summary_at = Carbon::now();
                    unset($post->hiddens);
                    $post->save();
                }
            }
        } catch (Throwable $e) {
            Log::error('Error in Summay Posts Job', [
                'message' => $e->getMessage(),
            ]);
        }

        $end = Carbon::now();
        $diffSeconds = $end->diffInSeconds($start); // จำนวนวินาที
        $diffMilli = $end->diffInMilliseconds($start); // จำนวนมิลลิวินาที
        Log::info('=== End Summay Posts Job ===');
        Log::info('=== Duration: '.$diffSeconds.' seconds ('.$diffMilli.' ms)');
        Log::info('');
    }
}
