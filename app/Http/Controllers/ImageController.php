<?php
namespace App\Http\Controllers;


use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Auth;

use App\Models\UploadFile;
use App\Models\Blog;


class ImageController extends Controller
{
    public static function TransNameToURL($name)
    {
        $data = new \stdClass();
        $data->url = env('APP_URL').'/image/'.$name;
        $data->normal = env('APP_URL').'/image/'.$name;
        $data->original = env('APP_URL').'/image/'.$name;
        $data->resize = env('APP_URL').'/image/resized/'.$name;

        return $data;
    }

    public function show($filename)
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Content-Type");
        header("Access-Control-Allow-Methods: GET, POST");
        $img = UploadFile::where('name', $filename)->firstOrFail();

        if($img->status != UploadFile::STATUS_ACTIVE){
            $type = $img->source_type;
            $id = $img->source_id;
            if($type == 'blog' && $id){
                $blog = Blog::where('id', $id)->firstOrFail();
                if($blog->user_id !== Auth::id()){
                    abort(404, 'Image not found or inactive');
                }
            }
        }

        $filePath = $img->root . $img->source_type . '/' . $img->source_id . '/' . $img->type . '/' . $img->name;
        // $filePath = $img->root . $img->path . $img->name;
        // dd($filePath);

        if (Storage::disk('public')->exists($filePath)) {
            $mimeType = Storage::disk('public')->mimeType($filePath);
            $fileContent = Storage::disk('public')->get($filePath);

            return response($fileContent, 200)
                ->header('Content-Type', $mimeType)
                ->header('Cache-Control', 'public, max-age=604800, immutable');
        }

        abort(404); // หากไม่พบไฟล์
    }

    public function showResizedImage($filename)
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Content-Type");
        header("Access-Control-Allow-Methods: GET, POST");

        // ดึงข้อมูลไฟล์จาก DB
        $img = UploadFile::where('name', $filename)->firstOrFail();
        if($img->status != UploadFile::STATUS_ACTIVE){
            $type = $img->source_type;
            $id = $img->source_id;
            if($type == 'blog' && $id){
                $blog = Blog::where('id', $id)->firstOrFail();
                if($blog->user_id !== Auth::id()){
                    abort(404, 'Image not found or inactive');
                }
            }
        }

        $filePath = $img->root . $img->source_type . '/' . $img->source_id . '/' . $img->type . '/' . $img->name;

        // หาโฟลเดอร์ source + เพิ่ม thumbs
        $dir = dirname($filePath); // upload/blog/image
        $thumbPath = $dir . '/thumbs/' . basename($filePath); // upload/blog/image/thumbs/abd.jpg

        // ถ้ามีไฟล์ย่อแล้ว -> ส่งกลับเลย
        if (Storage::disk('public')->exists($thumbPath)) {
            $mimeType = Storage::disk('public')->mimeType($thumbPath);
            $content = Storage::disk('public')->get($thumbPath);
            return response($content, 200)->header('Content-Type', $mimeType);
        }

        // ถ้าไฟล์ต้นฉบับไม่มี -> 404
        if (!Storage::disk('public')->exists($filePath)) {
            abort(404, 'Image not found');
        }

        // โหลดไฟล์ต้นฉบับ
        $imgContent = Storage::disk('public')->get($filePath);
        $mimeType = Storage::disk('public')->mimeType($filePath);

        // ลดขนาดรูป
        $manager = new ImageManager(new Driver());
        $img = $manager->read($imgContent)->scaleDown(width: 250);

        // สร้างโฟลเดอร์ thumbs ถ้ายังไม่มี
        Storage::disk('public')->makeDirectory($dir . '/thumbs');

        // เก็บไฟล์ย่อไว้ใน path ใหม่
        Storage::disk('public')->put($thumbPath, (string) $img->encode());

        // ส่งรูปย่อกลับ
        return response($img->encode(), 200)->header('Content-Type', $mimeType)->header('Cache-Control', 'public, max-age=604800, immutable');
    }

    public static function ChangeStatus($filename, $status = UploadFile::STATUS_ACTIVE){
        $file = UploadFile::where('name', $filename)->first();
        if (!$file) {
            // กรณีไม่พบไฟล์ อาจจะ throw error หรือ return false
            return false;
        }
        $file->status = $status;
        $file->save();
        return true;
    }



}
