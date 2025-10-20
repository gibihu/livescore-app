<?php

namespace App\Console\Commands;

use App\Helpers\ConJobHelper;
use App\Models\Football\Competition;
use App\Models\Football\CompetitionGroup;
use App\Models\Football\CompetitionGroupStanding;
use App\Models\Football\CompetitionStage;
use App\Models\Football\Seasons;
use App\Models\Football\Team;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GetStandings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:get-standings';

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
        Log::info('=== Start Update Standing Job ===');
        try{
            set_time_limit(180);
            $API_KEY = config('api.livescore.api_key');
            $API_SECRET = config('api.livescore.api_secret');
            $LANG = config('app.locale');

            $competitions = Competition::query()
                ->where('is_league', true)
                ->where('tier', '<', 3)
                ->whereHas('season', function ($q) {
                    $q->whereRaw("CAST(SUBSTRING_INDEX(name, '/', 1) AS UNSIGNED) >= 2025");
                })
                ->with('season')
                ->whereIn('name', [
                    'Bundesliga', 'LaLiga Santander', 'Premier League', 'J. League',
                    'Serie A', 'UEFA EURO Qualification', 'UEFA Nations League',
                    'UEFA EURO', 'UEFA Conference League'
                ])
                ->orderBy('competition_id', 'asc')
                ->get()
                ->unique('name'); // เอาแค่ตัวแรกต่อชื่อ

            if($competitions->isNotEmpty()){

                $all = [];
                $fail = [];
                foreach ($competitions as $competition) {
                    $response = Http::get('https://livescore-api.com/api-client/competitions/table.json', [
                        'key' => $API_KEY,
                        'secret' => $API_SECRET,
                        'lang' => $LANG,
                        'competition_id' => $competition->competition_id,
                    ]);
                    if ($response->successful()) {
                        $data = $response->object();
                        $item = $data->data;

                        $group_id = [];
                        foreach ($item->stages[0]->groups[0]->standings as $stan) {
                            $standing = Team::where('team_id', $stan->team->id)->first() ? CompetitionGroupStanding::where('team_id', Team::where('team_id', $stan->team->id)->first()->id)->first() : null;
                            if(!$standing){ $standing = new CompetitionGroupStanding(); }

                            $standing->rank = $stan->rank;
                            $standing->points = $stan->points;
                            $standing->matches = $stan->matches;
                            $standing->goal_diff = $stan->goal_diff;
                            $standing->goals_scored = $stan->goals_scored;
                            $standing->goals_conceded = $stan->goals_conceded;
                            $standing->lost = $stan->lost;
                            $standing->drawn = $stan->drawn;
                            $standing->won = $stan->won;
                            $standing->team_id = ConJobHelper::CheckTeamAndInsert($stan->team)->id ?? null;
                            $standing->save();
                            $group_id[] = $standing->id;
                        }

                        $i_group = $item->stages[0]->groups[0];
                        $group = CompetitionGroup::where('group_id', $i_group->id)->first();
                        if(!$group){ $group = new CompetitionGroup(); }

                        $group->group_id = $i_group->id;
                        $group->name = $i_group->name;
                        $group->standings_id = $group_id;
                        $group->save();

                        $i_stage = $item->stages[0]->stage;
                        $stage = CompetitionStage::where('stage_id', $i_stage->id)->first();
                        if(!$stage){ $stage = new CompetitionStage(); }

                        $stage->stage_id = $i_stage->id;
                        $stage->name = $i_stage->name;
                        $stage->competition_id = Competition::where('competition_id', $item->competition->id)->first()->id ?? $item->competition->id;
                        $stage->season_id = Seasons::where('season_id', $item->season->id)->first()->id ?? $item->season->id;
                        $stage->group_id = $group->id;
                        $stage->save();

                        $all[] = $stage;
                    }else{
                        $fail[] = [
                            'message' => 'ไม่สำเร็จ',
                            'data' => $response->object(),
                            'code' => $response->status()
                        ];
                    }
                }
                return Log::info('สำเร็จ', [
                    'message' => 'สำเร็จ',
                    'data' => $all,
                    'fail' => $fail,
                    'code' => $response->status(),
                ]);
            }

        } catch (Throwable $e) {
            Log::error('Error in Standing Job', [
                'message' => $e->getMessage(),
            ]);
        }

        Log::info('=== End Standing Job ===');
        Log::info('');
    }
}
