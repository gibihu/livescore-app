<?php

namespace App\Http\Controllers\Football;

use App\Helpers\ConJobHelper;
use App\Http\Controllers\Controller;
use App\Models\Football\Competition;
use App\Models\Football\Federation;
use App\Models\Football\Matchs;
use App\Models\Football\Standing;
use App\Models\Football\Team;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Exception;

use App\Models\Football\Country;
use App\Models\Football\Seasons;
use stdClass;

class CompetitionController extends Controller
{
    public function index(Request $request){
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
                    $league->save();

                }

                return response()->json($leagues, 200);
            }

            return response()->json($response, 200);
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }

    public function show($id){
        try{
            $leagues = League::find($id);
            return response()->json($leagues, 200);
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }


    public function all(){
        try{
            $leagues = League::get();
            $leagues->transform(function($item){
                $item->session = Seasons::find($item->season_id);
                $item->federations = Feder::whereIn('id', [$item->federation_id])->get();
                $item->countries = Country::whereIn('id', [$item->country_id])->get();

                return $item;
            });
            return response()->json($leagues, 200);
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }






    public function fixture()
    {
        try{
            $API_KEY = env('LIVE_SCORE_API_KEY');
            $API_SECRET = env('LIVE_SCORE_API_SECRET');
            $LANG = env('APP_LOCALE');
            $date = Carbon::tomorrow()->format('Y-m-d');

            $finish = [];

            $config = new stdClass();
            $config->next_page = 'have next';
            $config->page = 1;
            while($config->next_page !== false){
                $response = Http::get('https://livescore-api.com/api-client/fixtures/list.json', [
                    'key' => $API_KEY,
                    'secret' => $API_SECRET,
                    'lang' => $LANG,
                    'date' => $date,
                    'page' => $config->page,
                ]);
                if ($response->getStatusCode() === 200) {
                    $data = $response->object();
                    if ($data->success) {
                        if (!empty($data->data->fixtures)) {
                            $fixture = $data->data->fixtures;
                            foreach ($fixture as $item) {
                                $match = Matchs::where('fixture_id', $item->id)->first() ?? new Matchs;

                                $match->fixture_id = $item->id ?? $match->fixture_id;
                                $match->round = $item->round ?? $match->round;

                                $utcDateTime = Carbon::parse(($item->date) . ' ' . ($item->time), 'UTC');
                                $bangkokDateTime = $utcDateTime->setTimezone('Asia/Bangkok');
                                $match->date = $bangkokDateTime->format('Y-m-d');
                                $match->time = $bangkokDateTime->format('H:i:s');

                                $match->location = $item->location ?? $match->location;
                                $match->odds = $item->odds ?? $match->odds;
                                $match->group_id = $item->group_id ?? $match->group_id;

                                if (!empty($item->away)) {
                                    $team = Team::where('team_id', $item->away->id)->first() ?? new Team;
                                    $team->team_id = $item->away->id;
                                    $team->logo = $item->away->logo;
                                    $team->name = $item->away->name ?? $team->name;
                                    if(preg_match('/\p{Thai}/u', $item->away->name)){
                                        $team->name = $item->away->name;
                                    }
                                    $team->country_id = Country::where('country_id', $item->away->country_id)->value('id');
                                    $team->stadium = $item->away->stadium ?? $team->stadium;
                                    $team->save();
                                    $match->away_team_id = $team->id;
                                }
                                if (!empty($item->home)) {
                                    $team = Team::where('team_id', $item->home->id)->first() ?? new Team;
                                    $team->team_id = $item->home->id;
                                    $team->logo = $item->home->logo;
                                    $team->name = $item->home->name ?? null;
                                    $team->name = $item->home->name ?? $team->name;
                                    if(preg_match('/\p{Thai}/u', $item->home->name)){
                                        $team->name = $item->home->name;
                                    }
                                    $team->country_id = Country::where('country_id', $item->away->country_id)->value('id');
                                    $team->stadium = $item->home->stadium ?? null;
                                    $team->save();
                                    $match->home_team_id = $team->id;
                                }
                                if (!empty($item->federation) && $item->federation != null) {
                                    $feder = Federation::where('federation_id', $item->federation->id)->first() ?? new Federation;
                                    $feder->federation_id = $item->federation->id;
                                    $feder->name = $item->federation->name;
                                    if(preg_match('/\p{Thai}/u', $feder->name)){
                                        $feder->name_th = $feder->name;
                                    }
                                    $feder->save();
                                    $match->federation_id = $feder->id;
                                }

                                if(!empty($item->country) && $item->country != null) {
                                    $country = Country::where('country_id', $item->country->id)->first() ?? new Country;
                                    $country->country_id = $item->country->id;
                                    $country->name = $item->country->name;
                                    if(preg_match('/\p{Thai}/u', $country->name)){
                                        $country->name_th = $country->name;
                                    }
                                    $country->uefa_code = $item->country->uefa_code ?? null;
                                    $country->fifa_code = $item->country->fifa_code ?? null;
                                    $country->flag = $item->country->flag ?? null;
                                    $country->is_real = $item->country->is_real ?? null;
                                    $country->save();
                                    $match->country_id = $country->id;
                                }

                                if (!empty($item->competition) && $item->competition != null) {
                                    $league = Competition::where('competition_id', $item->competition->id)->first() ?? new Competition;
                                    $league->competition_id = $item->competition->id;
                                    $league->name = $item->competition->name;
                                    if(preg_match('/\p{Thai}/u', $league->name)){
                                        $league->name_th = $league->name;
                                    }
                                    $league->is_league = $item->competition->is_league ?? $league->is_league;
                                    $league->is_cup = $item->competition->is_cup ?? $league->is_cup;
                                    $league->tier = $item->competition->tier ?? $league->tier;
                                    $league->has_groups = $item->competition->has_groups ?? $league->has_groups;
                                    $league->national_teams_only = $item->competition->national_teams_only ?? $league->national_teams_only;
                                    $league->active = $item->competition->active ?? $league->active;
                                    $league->save();
                                    $match->competition_id = $league->id;
                                }

                                if ($match->save()) {
                                    $finish[] = [
                                        'id' => $match->id,
                                    ];
                                }
                            }
                        }
                        $config->next_page = $data->data->next_page ?? false;
                        $config->page = $data->data->next_page !== false ? $config->page + 1 : $config->page;
                    }
                }
            }
            return response()->json([$finish], 201);
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }


    public function match()
    {
        try{
            $API_KEY = env('LIVE_SCORE_API_KEY');
            $API_SECRET = env('LIVE_SCORE_API_SECRET');
            $LANG = env('APP_LOCALE');

            // ตรวจสอบว่าควรเรียก API หรือไม่
            $shouldCallApi = false;

            // เช็คข้อมูลล่าสุดจาก updated_at
            $latestMatch = Matchs::latest('updated_at')->first();

            if ($latestMatch) {
                $lastUpdateTime = Carbon::parse($latestMatch->updated_at);
                $now = Carbon::now();
                $hoursDifference = $now->diffInHours($lastUpdateTime);

                // ถ้าข้อมูลล่าสุดอัพเดทไม่เกิน 3 ชั่วโมง แสดงว่ายังมีแมชอยู่
                if ($hoursDifference < 3) {
                    $shouldCallApi = true;
                } else {
                    // ถ้าข้อมูลเก่าเกิน 3 ชั่วโมงแล้ว ให้เช็คว่ามีแมชที่กำลังจะมาถึงหรือไม่
                    // หาแมชที่จะมาถึงเร็วที่สุด (status ยังไม่เสร็จ และ date/time อยู่ในอนาคต)
                    $upcomingMatch = Matchs::where('status', '!=', 'finished')
                        ->where(function($query) use ($now) {
                            // เช็คว่า date มากกว่าหรือเท่ากับวันนี้
                            $query->whereDate('date', '>=', $now->toDateString())
                                ->orWhereNull('date');
                        })
                        ->orderBy('date', 'asc')
                        ->orderBy('time', 'asc')
                        ->first();

                    if ($upcomingMatch && $upcomingMatch->date && $upcomingMatch->time) {
                        // รวม date และ time เป็น datetime
                        $matchDateTime = Carbon::parse($upcomingMatch->date . ' ' . $upcomingMatch->time);

                        // คำนวณว่าห่างจากตอนนี้กี่นาที
                        $minutesUntilMatch = $now->diffInMinutes($matchDateTime, false);

                        // ถ้าเหลือเวลา 0-60 นาที (หรือเริ่มแล้วแต่ไม่เกิน 60 นาที) ให้เรียก API
                        if ($minutesUntilMatch >= -60 && $minutesUntilMatch <= 60) {
                            $shouldCallApi = true;
                        }
                    }
                }
            } else {
                // ถ้าไม่มีข้อมูลเลย ให้เรียก API
                $shouldCallApi = true;
            }

            // เรียก API เฉพาะเมื่อควรเรียก
            if ($shouldCallApi) {
                $response = Http::get('https://livescore-api.com/api-client/matches/live.json', [
                    'key' => $API_KEY,
                    'secret' => $API_SECRET,
                    'lang' => $LANG,
                ]);

                if ($response->getStatusCode() === 200) {
                    $data = $response->object();
                    if ($data->success && !empty($data->data->match)) {
                        $matches = collect($data->data->match);

                        // บันทึกหรืออัพเดทข้อมูลแมช
                        $matches->each(function ($item) {
                            $match = Matchs::where('match_id', $item->id)->whereOr('fixture_id',$item->fixture_id)->first() ?? new Matchs;
                            $match->match_id = $item->id ?? null;
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

                            $match->urls = $item->urls ?? null;
                            $match->save();
                        });


                        return response()->json([
                            'success' => true,
                            'message' => 'API called and data updated',
                            'matches_count' => $matches->count(),
                            'data' => $matches,
                        ], 200);
                    }
                }
            } else {
                // ไม่เรียก API เพราะไม่จำเป็น
                return response()->json([
                    'success' => true,
                    'message' => 'API call skipped - no matches in progress or upcoming within 1 hour',
                    'cached' => true
                ], 200);
            }
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }

    public function standing()
    {
        try{
            $results = [];
            $competitions = Competition::query()
                ->where('active', true)
                ->where('is_league', true)
                ->where('tier', '<', 3)
                ->whereHas('season', function ($q) {
                    $q->whereRaw("CAST(SUBSTRING_INDEX(name, '/', 1) AS UNSIGNED) >= 2025");
                })
                ->with('season')
                ->get();

//            return response()->json([$competitions],200);
            foreach ($competitions as $competition) {
                $exists = Standing::where('competition_id', $competition->competition_id)
                    ->where('season_id', $competition->season->id)
                    ->exists();

                if (!$exists) {
                    $response = Http::get('https://livescore-api.com/api-client/competitions/standings.json', [
                        'key' => env('LIVE_SCORE_API_KEY'),
                        'secret' => env('LIVE_SCORE_API_SECRET'),
                        'lang' => env('APP_LOCALE'),
                        'competition_id' => $competition->competition_id,
                    ]);
                    if ($response->getStatusCode() === 200) {
                        $data = $response->object();
                        if ($data->success && !empty($data->data->table)) {
                            foreach ($data->data->table as $item) {
                                $standing = Standing::firstOrNew([
                                    'competition_id' => $item->competition_id
                                ]);

                                $standing->league_id = $item->league_id ?? $standing->league_id;
                                $standing->season_id = Seasons::where('season_id', $item->season_id)->first()->id ?? $standing->season_id;
                                $standing->team_id = Team::where('team_id', $item->team_id)->first()->id ?? $standing->team_id;
                                $standing->competition_id = Competition::where('competition_id', $item->competition_id)->first()->id ?? $item->competition_id;
                                $standing->group_id = $item->group_id ?? $standing->group_id;
                                $standing->stage_id = $item->stage_id ?? $standing->stage_id;
                                $standing->name = $item->name ?? $standing->name;
                                $standing->group_name = $item->group_name ?? $standing->group_name;
                                $standing->stage_name = $item->stage_name ?? $standing->stage_name;
                                $standing->rank = $item->rank ?? $standing->rank;
                                $standing->points = $item->points ?? $standing->points;
                                $standing->matches = $item->matches ?? $standing->matches;
                                $standing->won = $item->won ?? $standing->won;
                                $standing->drawn = $item->drawn ?? $standing->drawn;
                                $standing->lost = $item->lost ?? $standing->lost;
                                $standing->goals_scored = $item->goals_scored ?? $standing->goals_scored;
                                $standing->goals_conceded = $item->goals_conceded ?? $standing->goals_conceded;

                                $standing->save();
                            };
                        }
                    }
                }
            };


            return response()->json([
                'status' => true,
            ], 200);


        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response()->json($response, 500);
        }
    }
}
