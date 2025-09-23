<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

use Carbon\Carbon;

use App\Models\User;
use App\Models\Flag;
use App\Models\MatchEvent;

class LiveScoreController extends Controller
{
    public static function LiveScore()
    {
        try {
            $API_KEY = env('LIVE_SCORE_API_KEY');
            $API_SECRET = env('LIVE_SCORE_API_SECRET');
            $LANG = env('APP_LOCALE');

            $response = Http::get('https://livescore-api.com/api-client/matches/live.json', [
                'key' => $API_KEY,
                'secret' => $API_SECRET,
                'lang' => $LANG,
            ]);

            if ($response->successful()) {
                return json_decode($response);
            }

            return false;
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
                return $response->object(); // ใช้ object() แทน json_decode()
            }
            return false;
        } catch (\Exception $e) {
            throw $e;
            return false;
        }
    }
}
