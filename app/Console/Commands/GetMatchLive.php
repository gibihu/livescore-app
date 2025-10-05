<?php

namespace App\Console\Commands;

use App\Helpers\ConJobHelper;
use App\Models\Football\Matchs;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class GetMatchLive extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:get-match-live';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'ดึงตารางคะแนนสด';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('');
        Log::info('=== Start Update Live Job ===');

        try {
            $API_KEY = env('LIVE_SCORE_API_KEY');
            $API_SECRET = env('LIVE_SCORE_API_SECRET');
            $LANG = env('APP_LOCALE');

            $response = Http::get('https://livescore-api.com/api-client/matches/live.json', [
                'key' => $API_KEY,
                'secret' => $API_SECRET,
                'lang' => $LANG,
            ]);

            if ($response->getStatusCode() === 200) {
                Log::info('รับ api');
                $data = $response->object();
                if ($data->success && !empty($data->data->match)) {
                    Log::info('มีข้อมูล');
                    $matches = collect($data->data->match);

                    Matchs::where('live_status', 'LIVE')->update(['live_status' => 'END_LIVE']);

                    // บันทึกหรืออัพเดทข้อมูลแมช
                    $matches->each(function ($item) {
                        $match = Matchs::where('fixture_id', $item->fixture_id)
                            ->orWhere('match_id', $item->id)
                            ->first();

                        if (!$match) {
                            $match = new Matchs;
                        }
                        $match->match_id = $item->id ?? null;
                        $match->fixture_id = $item->fixture_id ?? null;
                        $match->competition_id = $item->competition ? ConJobHelper::CheckCompetitionAndInsert($item->competition)->id : null;
                        $match->country_id = $item->country ? ConJobHelper::CheckCountryAndInsert($item->country)->id : null;
                        $match->home_team_id = $item->home ? ConJobHelper::CheckTeamAndInsert($item->home)->id : null;
                        $match->away_team_id = $item->away ? ConJobHelper::CheckTeamAndInsert($item->away)->id : null;
                        $match->federation_id = $item->federation ? ConJobHelper::CheckFederationAndInsert($item->federation)->id : null;
                        $match->status = $item->status ?? null;
                        $match->location = $item->location ?? null;
                        $match->odds = $item->odds ?? null;
                        $match->scores = $item->scores ?? null;
                        $match->outcomes = $item->outcomes ?? null;

                        $match->time = $item->time;
                        $match->scheduled = Carbon::parse($item->scheduled, 'UTC')->setTimezone('Asia/Bangkok')->format('H:i:s');
                        $match->added = Carbon::parse($item->added, 'UTC')->setTimezone('Asia/Bangkok');
                        $match->last_changed = Carbon::parse($item->last_changed, 'UTC')->setTimezone('Asia/Bangkok');

                        $match->live_status = 'LIVE';
                        $match->urls = $item->urls ?? null;
                        if($match->save()){
                            Log::info('บันทกสำเร็จ', ['id' => $match->id]);
                        }else{
                            Log::error('บันทึไม่ผ่าน', ['api_id' => $match->id ?? $item->id]);
                        }
                        if ($match->isDirty()) {
                            Log::info('มีการเปลี่ยนแปลง', $match->getDirty());
                        } else {
                            Log::info('ไม่มีอะไรเปลี่ยน');
                        }
                    });

                    Log::info('สำเร็จหมดแล้ว');
                }
            }else{
                Log::error('Api Match error', [json_encode($response->json())]);
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
