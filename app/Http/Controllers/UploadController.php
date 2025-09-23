<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use App\Models\UploadFile;


class UploadController extends Controller
{

    private static function storeFile($file, $path = 'uploads/other/', $newFileName = 'user')
    {
        // สร้างชื่อไฟล์ใหม่โดยการเพิ่ม timestamp
        $filename = Str::limit($newFileName, 100) . '_' . date('Ymd_His') . '_' . Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();

        // บันทึกไฟล์ในตำแหน่งที่กำหนด
        $filePath = $file->storeAs($path, $filename, 'public');

        // dd($filename, $filePath);
        return $filename ?? $filePath;
    }


    public static function uploadFileGetId($file, $source, $id , $type)
    {
        $root = "uploads/";
        $path = "{$source}/{$id}/{$type}";
        $fileSaveToName = self::storeFile($file, $root.$path, $source);

        $data = new \stdClass();

        if (!$fileSaveToName) {
            $data->uploadSuccess = false;
        } else {
            $data->uploadSuccess = true;

            $file = UploadFile::create([
                'name'        => $fileSaveToName,
                'root'        => $root,
                'path'        => $path."/" ,
                'type'        => $type,
                'source_type' => $source,
                'source_id'   => $id,
                'status'      => UploadFile::STATUS_ACTIVE,
            ]);

            $fileId = $file->id;



            if ($fileId) {
                $data->status = 'success';
                $data->id = $fileId;
                $data->name = $fileSaveToName;
            } else {
                $data->status = 'fail';
            }
        }

        return $data;
    }

}
