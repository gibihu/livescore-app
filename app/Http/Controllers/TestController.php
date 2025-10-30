<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function plyers(Request $request)
    {
        dd($request->all());
    }
}
