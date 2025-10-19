<?php

namespace App\Console\Commands;

use App\Repositories\Contracts\MatchRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class GetMatchHistory extends Command
{
    protected MatchRepository $match_;

    public function __construct(MatchRepository $match_)
    {
        parent::__construct();
        $this->match_ = $match_;
    }
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:get-match-history';

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
        set_time_limit(180);
        Log::info('');
        Log::info('=== Start Update Live Job ===');
        try{
            $API_KEY = config('api.livescore.api_key');
            $API_SECRET = config('api.livescore.api_secret');
            $LANG = config('app.locale');
            $today = Carbon::yesterday()->format('Y-m-d');

            $response = Http::get('https://livescore-api.com/api-client/matches/history.json', [
                'key' => $API_KEY,
                'secret' => $API_SECRET,
                'lang' => $LANG,
                'from' => $today,
                'to' => $today,
            ]);

            if($response->successful()){
                $date = $response->object();
                $items = $date->data->match;

                $total = [];
                foreach ($items as $item) {
                    try{
                        $save = $this->match_->saveMatch($item);
                        if($save){
                            $total['success'][] = $save->id;
                        }else{
                            $total['fail'][] = $save;
                        }
                    }catch (Exception $e){
                        Log::error($e->getMessage(), [
                            'success' => false,
                            'message' => $e->getMessage(),
                            'code' => $e->getCode(),
                        ]);
                    }
                }

                Log::info(json_encode($total));
            }else{
                Log::error(json_encode($response->json()));
            }
        } catch (Throwable $e) {
            Log::error('Error in Match Job', [
                'message' => $e->getMessage(),
            ]);
        }

        Log::info('=== End Match Job ===');
        Log::info('');
    }
}
