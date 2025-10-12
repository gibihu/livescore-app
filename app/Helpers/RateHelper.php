<?php
namespace App\Helpers;

use App\Models\Posts\Post;

class RateHelper
{
    public static function Data(bool $asObject = true): array|object
    {
        $data = [
            ['title' => '+10', 'value' => 10],
            ['title' => '+9.75 (รอง 9 ลูกครึ่งควบ 10)', 'value' => 9.75],
            ['title' => '+9.5', 'value' => 9.5],
            ['title' => '+9.25 (รอง 9 ลูกควบครึ่ง)', 'value' => 9.25],
            ['title' => '+9', 'value' => 9],
            ['title' => '+8.75 (รอง 8 ลูกครึ่งควบ 9)', 'value' => 8.75],
            ['title' => '+8.5', 'value' => 8.5],
            ['title' => '+8.25 (รอง 8 ลูกควบครึ่ง)', 'value' => 8.25],
            ['title' => '+8', 'value' => 8],
            ['title' => '+7.75 (รอง 7 ลูกครึ่งควบ 8)', 'value' => 7.75],
            ['title' => '+7.5', 'value' => 7.5],
            ['title' => '+7.25 (รอง 7 ลูกควบครึ่ง)', 'value' => 7.25],
            ['title' => '+7', 'value' => 7],
            ['title' => '+6.75 (รอง 6 ลูกครึ่งควบ 7)', 'value' => 6.75],
            ['title' => '+6.5', 'value' => 6.5],
            ['title' => '+6.25 (รอง 6 ลูกควบครึ่ง)', 'value' => 6.25],
            ['title' => '+6', 'value' => 6],
            ['title' => '+5.75 (รอง 5 ลูกครึ่งควบ 6)', 'value' => 5.75],
            ['title' => '+5.5', 'value' => 5.5],
            ['title' => '+5.25 (รอง 5 ลูกควบครึ่ง)', 'value' => 5.25],
            ['title' => '+5', 'value' => 5],
            ['title' => '+4.75 (รอง 4 ลูกครึ่งควบ 5)', 'value' => 4.75],
            ['title' => '+4.5', 'value' => 4.5],
            ['title' => '+4.25 (รอง 4 ลูกควบครึ่ง)', 'value' => 4.25],
            ['title' => '+4', 'value' => 4],
            ['title' => '+3.75 (รอง 3 ลูกครึ่งควบ 4)', 'value' => 3.75],
            ['title' => '+3.5', 'value' => 3.5],
            ['title' => '+3.25 (รอง 3 ลูกควบครึ่ง)', 'value' => 3.25],
            ['title' => '+3', 'value' => 3],
            ['title' => '+2.75 (รอง 2 ลูกครึ่งควบ 3)', 'value' => 2.75],
            ['title' => '+2.5', 'value' => 2.5],
            ['title' => '+2.25 (รอง 2 ลูกควบครึ่ง)', 'value' => 2.25],
            ['title' => '+2', 'value' => 2],
            ['title' => '+1.75 (รอง 1 ลูกครึ่งควบ 2)', 'value' => 1.75],
            ['title' => '+1.5', 'value' => 1.5],
            ['title' => '+1.25 (รอง 1 ลูกควบครึ่ง)', 'value' => 1.25],
            ['title' => '+1', 'value' => 1],
            ['title' => '+0.75 (รอง ครึ่งควบลูก)', 'value' => 0.75],
            ['title' => '+0.5', 'value' => 0.5],
            ['title' => '+0.25 (รอง ปป.)', 'value' => 0.25],
            ['title' => '0 (เสมอ)', 'value' => 0],
            ['title' => '-0.25 (ต่อ ปป.)', 'value' => -0.25],
            ['title' => '-0.5', 'value' => -0.5],
            ['title' => '-0.75 (ต่อ ครึ่งควบลูก)', 'value' => -0.75],
            ['title' => '-1', 'value' => -1],
            ['title' => '-1.25 (ต่อ 1 ลูกควบครึ่ง)', 'value' => -1.25],
            ['title' => '-1.5', 'value' => -1.5],
            ['title' => '-1.75 (ต่อ 1 ลูกครึ่งควบ 2)', 'value' => -1.75],
            ['title' => '-2', 'value' => -2],
            ['title' => '-2.25 (ต่อ 2 ลูกควบครึ่ง)', 'value' => -2.25],
            ['title' => '-2.5', 'value' => -2.5],
            ['title' => '-2.75 (ต่อ 2 ลูกครึ่งควบ 3)', 'value' => -2.75],
            ['title' => '-3', 'value' => -3],
            ['title' => '-3.25 (ต่อ 3 ลูกควบครึ่ง)', 'value' => -3.25],
            ['title' => '-3.5', 'value' => -3.5],
            ['title' => '-3.75 (ต่อ 3 ลูกครึ่งควบ 4)', 'value' => -3.75],
            ['title' => '-4', 'value' => -4],
            ['title' => '-4.25 (ต่อ 4 ลูกควบครึ่ง)', 'value' => -4.25],
            ['title' => '-4.5', 'value' => -4.5],
            ['title' => '-4.75 (ต่อ 4 ลูกครึ่งควบ 5)', 'value' => -4.75],
            ['title' => '-5', 'value' => -5],
            ['title' => '-5.25 (ต่อ 5 ลูกควบครึ่ง)', 'value' => -5.25],
            ['title' => '-5.5', 'value' => -5.5],
            ['title' => '-5.75 (ต่อ 5 ลูกครึ่งควบ 6)', 'value' => -5.75],
            ['title' => '-6', 'value' => -6],
            ['title' => '-6.25 (ต่อ 6 ลูกควบครึ่ง)', 'value' => -6.25],
            ['title' => '-6.5', 'value' => -6.5],
            ['title' => '-6.75 (ต่อ 6 ลูกครึ่งควบ 7)', 'value' => -6.75],
            ['title' => '-7', 'value' => -7],
            ['title' => '-7.25 (ต่อ 7 ลูกควบครึ่ง)', 'value' => -7.25],
            ['title' => '-7.5', 'value' => -7.5],
            ['title' => '-7.75 (ต่อ 7 ลูกครึ่งควบ 8)', 'value' => -7.75],
            ['title' => '-8', 'value' => -8],
            ['title' => '-8.25 (ต่อ 8 ลูกควบครึ่ง)', 'value' => -8.25],
            ['title' => '-8.5', 'value' => -8.5],
            ['title' => '-8.75 (ต่อ 8 ลูกครึ่งควบ 9)', 'value' => -8.75],
            ['title' => '-9', 'value' => -9],
            ['title' => '-9.25 (ต่อ 9 ลูกควบครึ่ง)', 'value' => -9.25],
            ['title' => '-9.5', 'value' => -9.5],
            ['title' => '-9.75 (ต่อ 9 ลูกครึ่งควบ 10)', 'value' => -9.75],
            ['title' => '-10', 'value' => -10],
        ];

        return $asObject ? (object) $data : $data;
    }
    public static function getItem($value, bool $asObject = true)
    {
        // ข้อมูลต้นฉบับ
        $data = self::Data(false);

        // ตรวจสอบก่อนว่า value เป็นตัวเลขหรือไม่ (รองรับ string ที่เป็นตัวเลข เช่น "1.5")
        if (is_string($value)) {
            // ถ้าเป็น string ที่เป็นตัวเลข ก็แปลงให้
            if (is_numeric($value)) {
                $value = (float)$value;
            } else {
                return [
                    'error' => true,
                    'message' => 'Invalid value: not numeric string'
                ];
            }
        } elseif (!is_numeric($value)) {
            // ถ้าไม่ใช่ string และไม่ใช่ numeric → error ทันที
            return [
                'error' => true,
                'message' => 'Invalid value: not a number'
            ];
        }

        // หา element ที่มีค่า value ตรงกัน
        $index = array_search($value, array_column($data, 'value'));

        // ถ้าไม่พบ
        if ($index === false) {
            return [
                'error' => true,
                'message' => 'Value not found in dataset'
            ];
        }

        // เตรียมผลลัพธ์
        $result = [
            'error' => false,
            'title' => $data[$index]['title'],
            'value' => $data[$index]['value'],
        ];

        // แปลงเป็น object หรือ array ตาม flag
        return $asObject ? (object)$result : $result;
    }
}
