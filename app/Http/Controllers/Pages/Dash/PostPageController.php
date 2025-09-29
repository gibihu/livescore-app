<?php

namespace App\Http\Controllers\Pages\Dash;

use App\Http\Controllers\Controller;
use App\Models\Post\PostReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostPageController extends Controller
{
    public function ReportList(Request $request)
    {
        $table = PostReport::all();
        return Inertia::render('dashboard/admins/posts/report', compact('table'));
    }
}
