<?php

namespace App\Http\Controllers\Apis\Users;

use App\Http\Controllers\Controller;
use App\Models\Posts\Rank;
use Exception;
use Illuminate\Http\Request;

class RankUserApiController extends Controller
{
    public function feed(Request $request)
    {
        try {

            $seasonIndex = config('app.season.index');

            $ranks = Rank::with([
                'season',
                'user' => fn ($query) => $query->without('rank'),
            ])
                ->whereHas('season', fn ($query) => $query->where('season_index', $seasonIndex))
                ->limit(200)
                ->get();

            return response()->json([
                'message' => 'สำเร็จ',
                'data' => $ranks,
                'code' => 200,
            ], 200);
        } catch (Exception $e) {
            $response = [
                'message' => $e->getMessage() ?? 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if (config('app.debug')) {
                $response['debug'] = [
                    'message' => $e->getMessage(),
                ];
            }

            return response()->json($response, 500);
        }
    }
}
