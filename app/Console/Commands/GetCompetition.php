<?php

namespace App\Console\Commands;

use App\Models\Football\Competition;
use App\Models\Football\Country;
use App\Models\Football\Federation;
use App\Models\Football\Seasons;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class GetCompetition extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:get-competition';

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
        Log::info('');
        Log::info('=== Start Update Competition Job ===');
        try{
            $API_KEY = env('LIVE_SCORE_API_KEY');
            $API_SECRET = env('LIVE_SCORE_API_SECRET');
            $LANG = env('APP_LOCALE');

            $response = Http::get('https://livescore-api.com/api-client/competitions/list.json', [
                'key' => $API_KEY,
                'secret' => $API_SECRET,
                'lang' => $LANG,
            ]);

            if ($response->successful()) {
                $data = $response->object();

                $leagues = $data->data->competition;

                foreach($leagues as $item){
                    $league = Competition::where('competition_id', $item->id)->first() ?? new Competition;

                    if(!empty($item->federations)){
                        $feders = $item->federations;
                        foreach($feders as $feder){
                            $exists = Federation::where('federation_id', $feder->id)->first() ?? new Federation;
                            $exists->federation_id = (int) $feder->id;
                            $exists->name = $feder->name;
                            $exists->save();
                            $league->federation_id = $exists->id;
                        }
                    }
                    if(!empty($item->countries)){
                        $countrys = $item->countries;
                        foreach($countrys as $country){
                            $exists = Country::where('country_id', $country->id)->first() ?? new Country;

                            $exists->country_id = (int) $country->id;
                            $exists->name = $country->name;
                            $exists->flag = $country->flag;
                            $exists->fifa_code = $country->fifa_code;
                            $exists->uefa_code = $country->uefa_code;
                            $exists->is_real = (int) $country->is_real;
                            $exists->save();
                            $league->country_id = $exists->id;
                        }
                    }
                    if(!empty($item->season)){
                        $ss = $item->season;
                        $exists = Seasons::where('season_id', $ss->id)->first() ?? new Seasons;

                        $exists->season_id = (int) $ss->id;
                        $exists->name = $ss->name;
                        $exists->start = $ss->start;
                        $exists->end = $ss->end;
                        $exists->save();
                        $league->season_id = $exists->id;
                    }


                    $league->competition_id = $item->id;
                    $league->name = $item->name;
                    $league->is_league = $item->is_league;
                    $league->is_cup = $item->is_cup;
                    $league->tier = (int) $item->tier;
                    $league->has_groups = $item->has_groups;
                    $league->active = $item->active;
                    $league->national_teams_only = $item->national_teams_only;
                    if ($league->save()) {
                        Log::info('บันทกสำเร็จ', ['id' => $league->id]);
                    }else{
                        Log::error('บันทึไม่ผ่าน', ['api_id' => $league->id ?? $item->id]);
                    }
                }
                Log::info("สำเร็จหมดแล้ว");
                Log::info("Data",  [json_encode($response->json())]);
            }
            Log::info("response",  [json_encode($response)]);
        } catch (Throwable $e) {
            Log::error('Error in Match Job', [
                'message' => $e->getMessage(),
            ]);
        }

        Log::info('=== End Competition Job ===');
        Log::info('');
    }
}
