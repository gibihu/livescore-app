<?php

namespace App\Http\Controllers\Football;

use App\Http\Controllers\Controller;
use App\Models\Flag;
use App\Models\Football\MatchEvent;
use App\Models\Football\Matchs;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class LiveScoreController extends Controller
{
    public static function LiveScore()
    {
        try {
            $matches = Matchs::query()
                // ต้องมี match_id (ไม่เป็น null)
                ->whereNotNull('match_id')
                // ต้องมี status (ไม่เป็น null)
                ->whereNotNull('status')
                // กรองตาม status
                ->where(function ($query) {
                    $query
                        // Status ที่ดึงมาหมด (ไม่ต้องเช็คเวลา)
                        ->whereIn('status', ['NOT STARTED', 'IN PLAY', 'HALF TIME BREAK', 'ADDED TIME'])
                        // หรือ Status FINISHED ที่ updated_at ยังไม่เกิน 3 ชั่วโมง
                        ->orWhere(function ($q) {
                            $q->where('status', 'FINISHED')
                                ->where('updated_at', '>', Carbon::now()->subHours(3));
                        });
                })
                ->get();

            return $matches;
        } catch (\Exception $e) {
            throw $e;
            return false;
        }
    }

    // แก้ไขจาก private เป็น protected หรือ public
    protected function getFlag($type, $id)
    {
        try {
            $type_int = $type == 'country' ? Flag::COUNTRY : Flag::TEAM;
            $flag = Flag::where('type', $type_int)->where('flag_id', $id)->first();

            if (!$flag) {
                // ถ้าไม่มีใน DB → ดึงจาก API
                $API_KEY = env('LIVE_SCORE_API_KEY');
                $API_SECRET = env('LIVE_SCORE_API_SECRET');
                $LANG = env('APP_LOCALE');

                $response = Http::get('https://livescore-api.com/api-client/countries/flag.json', [
                    'key' => $API_KEY,
                    'secret' => $API_SECRET,
                    'lang' => $LANG,
                    'country_id' => $id,
                ]);

                if ($response->getStatusCode() === 200) {
                    $imageData = $response->getBody()->getContents();

                    $path = "uploads/flag/{$type}/{$id}.png";

                    // สร้างโฟลเดอร์อัตโนมัติและบันทึกไฟล์
                    Storage::disk('public')->put($path, $imageData);

                    // บันทึก record ลง DB
                    Flag::create([
                        'type' => $type_int,
                        'flag_id' => $id,
                        'path' => "/uploads/flag/$type/$id.png",
                    ]);

                    return "/{$path}";
                }
            } else {
                // ถ้ามีใน DB → return path
                return $flag->path;
            }
        } catch (\Exception $e) {
            throw $e;
            return false;
            // return [
            //     'message' => $e->getMessage(),
            //     'status' => false,
            // ];
        }
    }

    public function showFlag(Request $request)
    {
        $type = $request->type ?? 'country';
        $id = $request->id ?? 23;

        $path = $this->getFlag($type, $id); // เรียกใช้ function ที่แก้ไขแล้ว

        if ($path) {
            // เช็คว่าไฟล์มีอยู่ไหม
            if (!Storage::disk('public')->exists($path)) {
                return response()->json(
                    [
                        'message' => 'Flag file not found',
                    ],
                    Response::HTTP_NOT_FOUND,
                );
            }

            // ส่งไฟล์กลับเป็น response
            $fullPath = Storage::disk('public')->path($path);
            return response()->file($fullPath, [
                'Content-Type' => 'image/png',
            ]);
        } else {
            return response()->json(
                [
                    'message' => 'Could not retrieve flag',
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static function LiveEvent($match_id, $status)
    {
        try {
            $match = MatchEvent::where('match_id', $match_id)->first();
            if ($match) {
                $item = json_decode($match->json, true);

                // ถ้าสถานะ FINISHED แล้ว ไม่ต้องเรียก API อีก
                if ($match->status == 'FINISHED') {
                    return $item;
                }

                // เช็คเวลาว่าผ่านมากกว่า 1 นาที และไม่มีใครกำลังเรียก API อยู่
                $updated_at = Carbon::parse($match->updated_at)->format('Y-m-d H:i');
                $now = Carbon::now()->format('Y-m-d H:i');

                // ถ้ายังไม่เกิน 1 นาที หรือมีคนกำลังเรียก API อยู่ ให้ return ข้อมูลเดิม
                if ($updated_at == $now || $match->is_updating == 1) {
                    return $item;
                }
                $match->update(['is_updating' => 1]);
            } else {
                $match = MatchEvent::create([
                    'match_id' => $match_id,
                    'is_updating' => 1,
                    'status' => $status,
                ]);
            }

            try {
                // เรียก API
                $API_KEY = env('LIVE_SCORE_API_KEY');
                $API_SECRET = env('LIVE_SCORE_API_SECRET');

                $response = Http::get('https://livescore-api.com/api-client/scores/events.json', [
                    'id' => $match_id,
                    'key' => $API_KEY,
                    'secret' => $API_SECRET,
                ]);

                if ($response->successful()) {
                    $data = $response->object(); // ใช้ object() แทน json_decode()

                    if ($data && $data->success) {
                        if (!empty($data->data)) {
                            $match->update([
                                'json' => json_encode($data->data),
                                'is_updating' => 0,
                                'status' => $data->data->match->status ?? null,
                            ]);

                            return $data->data;
                        }
                    }
                }

                // ถ้า API ไม่สำเร็จ ยกเลิกสถานะ updating
                $match->update(['is_updating' => 0]);
                return json_decode($match->json);
            } catch (\Exception $apiException) {
                // ถ้าเกิดข้อผิดพลาดในการเรียก API ยกเลิกสถานะ updating
                $match->update(['is_updating' => 0]);
                throw $apiException;
                return $apiException;
            }
        } catch (\Exception $e) {
            error_log($e);
            throw $e;
            return $e;
        }
    }

    public static function HistoryScore($page = 1)
    {
        try {
            $API_KEY = env('LIVE_SCORE_API_KEY');
            $API_SECRET = env('LIVE_SCORE_API_SECRET');
            $LANG = env('APP_LOCALE');
            $now = Carbon::now()->format('Y-m-d');
            $twoWeeksAgo = Carbon::now()->subWeeks(2)->format('Y-m-d');

            $response = Http::get('https://livescore-api.com/api-client/matches/history.json', [
                'key' => $API_KEY,
                'secret' => $API_SECRET,
                'lang' => $LANG,
                'from' => $twoWeeksAgo,
                'to' => $now,
                'page' => $page,
            ]);

            // ตรวจสอบสถานะ
            if ($response->getStatusCode() === 200) {
                $data = $response->object(); // ใช้ object() แทน json_decode()
                return (object) [
                    'success' => true,
                    'data' => $data->data->match,
                    'from_cache' => true,
                    'message' => 'Data retrieved from database (last update was less than 1 minute ago)',
                ];
            }
            return false;
        } catch (\Exception $e) {
            throw $e;
            return false;
        }
    }

    public static function SaveMatch($matches)
    {
        try {
            // dd($matches);
            foreach ($matches->match as $item) {
                // dd($item);
                $match = Matchs::where('match_id', $item->id)->first();
                if ($match && $match->status != 'FINISHED') {
                    $match->update([
                        'json' => json_encode($item),
                        'status' => $item->status,
                    ]);
                } elseif ($match && $match->status == 'FINISHED') {
                    // ถ้าสถานะเป็น FINISHED แล้ว ไม่ต้องอัพเดท
                    continue;
                } else {
                    Matchs::create([
                        'match_id' => $item->id,
                        'json' => json_encode($item),
                        'status' => $item->status,
                    ]);
                }
            }
            return true;
        } catch (\Exception $e) {
            throw $e;
            return false;
        }
    }

    public static function getFixture($date)
    {
        try {
            $API_KEY = env('LIVE_SCORE_API_KEY');
            $API_SECRET = env('LIVE_SCORE_API_SECRET');
            $LANG = env('APP_LOCALE');
            $date_carbon = Carbon::parse($date);
            $date_format = $date_carbon->format('Y-m-d');

            $response = Http::get('https://livescore-api.com/api-client/fixtures/list.json', [
                'key' => $API_KEY,
                'secret' => $API_SECRET,
                'lang' => $LANG,
                'date' => $date_format
            ]);

            // ตรวจสอบสถานะ
            if ($response->getStatusCode() === 200) {
                $data = $response->object();
                if($data->success){
                    return $data->data->fixtures;
                }
            }

            throw new Exception("ไม่สามารถดำเนินการได้!");
        } catch (\Exception $e) {
            throw $e;
            return false;
        }
    }
}
