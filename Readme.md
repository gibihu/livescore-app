
<!-- link storage กับ ublic -->

``` bash
php artisan storage:link
```

``` bash
php artisan route:clear
php artisan config:clear
php artisan view:clear

php artisan optimize:clear

php artisan config:cache
php artisan route:cache

php artisan migrate

php artisan make:migration add_title_to_posts_table --table=posts

php artisan migrate:rollback

php artisan migrate --path=/database/migrations/2025_09_24_112233_create_posts_table.php

php artisan migrate:reset --path=/database/migrations/2025_09_27_123456_create_users_table.php

php artisan migrate:rollback --path=/database/migrations/2025_09_21_144028_posts.php.php
php artisan migrate:fresh
php artisan migrate:refresh



dashboard/admin/football/setup



php artisan queue:work
# background
php artisan queue:work --daemon &
php artisan schedule:run


# เช็ค
php artisan queue:failed
# ลบ
php artisan queue:flush

php artisan schedule:work

php artisan queue:work
php artisan queue:work --daemon

php artisan schedule:run




```


มาตรฐาน error

``` json
{
  "message": "The given data was invalid.",
  "errors": {
    "username": [
      "The username field is required."
    ],
    "email": [
      "The email must be a valid email address."
    ]
  }
}

```

``` json  (ไม่ผ่าน)
{
    "error": {
        "message": "The given data was invalid.",
        "errors": {
            "username": [
            "The username field is required."
            ],
            "email": [
            "The email must be a valid email address."
            ]
        }
    }
}


```



``` bash 
npm install lucide-react@latest
# อัพเดท Icon
```

🔹 1xx – Informational

100 Continue – client สามารถส่ง request body ต่อได้

101 Switching Protocols – เปลี่ยน protocol ตามที่ request

น้อยคนนิยมใช้ใน API ปกติ

🔹 2xx – Success

200 OK – request สำเร็จ, มี response data

201 Created – resource ถูกสร้างแล้ว (เช่น POST /users)

202 Accepted – request ถูกยอมรับ แต่ยังไม่ได้ process

204 No Content – request สำเร็จ แต่ไม่มี content ตอบกลับ

🔹 3xx – Redirection

301 Moved Permanently – resource ย้ายถาวร

302 Found / 307 Temporary Redirect – resource ย้ายชั่วคราว

API ปกติไม่ค่อยใช้เยอะ

🔹 4xx – Client Error

400 Bad Request – request ผิดพลาด, parameter ไม่ถูกต้อง

401 Unauthorized – ยังไม่ได้ login / token ไม่ถูกต้อง

403 Forbidden – login แล้ว แต่ไม่มีสิทธิ์เข้าถึง

404 Not Found – resource ไม่เจอ

405 Method Not Allowed – method HTTP ไม่ถูกต้อง

409 Conflict – ข้อมูลซ้ำ / conflict เช่น register email ซ้ำ

422 Unprocessable Entity – validation error (Laravel ใช้ default)

429 Too Many Requests – rate limit เกิน

🔹 5xx – Server Error

500 Internal Server Error – server error, exception ไม่คาดคิด

501 Not Implemented – server ไม่รองรับ method

502 Bad Gateway – server proxy รับ response ผิด

503 Service Unavailable – server ปิดชั่วคราว / maintenance

504 Gateway Timeout – server timeout

🔹 Tips สำหรับ API

ใช้ 2xx กับ 4xx/5xx ให้ถูกประเภท → frontend จะ handle ง่าย

422 → validation error

401 → auth fail

403 → permission fail

404 → resource ไม่มี

500 → bug / exception

| Method   | ความหมาย / การใช้งานตรงไปตรงมา |
|----------|----------------------------------|
| GET      | ใช้ดึงข้อมูล (อ่านข้อมูลมาแสดง) |
| POST     | ใช้สร้างข้อมูลใหม่ หรือบันทึกข้อมูลใหม่ |
| PUT      | ใช้อัพเดทข้อมูลทั้งหมด (แทนที่ข้อมูลเดิมทั้งก้อน) |
| PATCH    | ใช้อัพเดทข้อมูลบางส่วน (แก้ไขเฉพาะฟิลด์ที่ส่งมา) |
| DELETE   | ใช้ลบข้อมูล หรืออัพเดทสถานะเป็น “ลบ” |
| OPTIONS  | ใช้ตรวจสอบว่า endpoint รองรับ method อะไรบ้าง |
| HEAD     | ใช้ดึงแค่ header ของ resource (ไม่เอาตัวเนื้อหา) |



✅ 1. Basic Validation Rules
| Rule       | ความหมาย                                                        |
| ---------- | --------------------------------------------------------------- |
| `required` | ต้องกรอก                                                        |
| `nullable` | อนุญาตให้ว่างได้                                                |
| `filled`   | ต้องไม่ว่าง ถ้ามีอยู่ใน input                                   |
| `present`  | ต้องมี key นี้ใน input แม้ว่าจะว่างก็ตาม                        |
| `accepted` | ต้องมีค่าเป็น `yes`, `on`, `1`, หรือ `true` (เหมาะกับ checkbox) |
| `declined` | ต้องมีค่าเป็น `no`, `off`, `0`, หรือ `false`                    |

🔢 2. Numeric Rules
| Rule                     | ความหมาย                                             |
| ------------------------ | ---------------------------------------------------- |
| `numeric`                | ต้องเป็นตัวเลข                                       |
| `integer`                | ต้องเป็นเลขจำนวนเต็ม                                 |
| `digits:value`           | ต้องเป็นเลขจำนวน `value` หลัก                        |
| `digits_between:min,max` | ต้องเป็นตัวเลข และมีจำนวนหลักระหว่าง `min` ถึง `max` |
| `min:value`              | ต้องมีค่ามากกว่าหรือเท่ากับ `value`                  |
| `max:value`              | ต้องมีค่าน้อยกว่าหรือเท่ากับ `value`                 |
| `between:min,max`        | ต้องอยู่ในช่วง `min` ถึง `max`                       |

🔤 3. String/Text Rules
| Rule              | ความหมาย                                    |
| ----------------- | ------------------------------------------- |
| `string`          | ต้องเป็นข้อความ                             |
| `alpha`           | ต้องมีเฉพาะ a-z A-Z                         |
| `alpha_num`       | ต้องเป็น a-z A-Z 0-9                        |
| `alpha_dash`      | เหมือน `alpha_num` แต่เพิ่ม `_` และ `-` ได้ |
| `min:x` / `max:x` | ความยาวขั้นต่ำ/สูงสุดของ string             |
| `size:x`          | ความยาวต้องเท่ากับ `x` พอดี                 |
| `between:x,y`     | ความยาวต้องอยู่ระหว่าง `x` ถึง `y`          |

📧 4. Format Rules
| Rule                    | ความหมาย                     |
| ----------------------- | ---------------------------- |
| `email`                 | ต้องเป็นอีเมลที่ถูกต้อง      |
| `url`                   | ต้องเป็น URL ที่ถูกต้อง      |
| `ip`                    | ต้องเป็น IP Address          |
| `ipv4` / `ipv6`         | ต้องเป็น IP ตามประเภทนั้น    |
| `uuid`                  | ต้องเป็น UUID                |
| `regex:/pattern/`       | ตรวจด้วย Regular Expression  |
| `starts_with:value,...` | ต้องขึ้นต้นด้วยค่าใดค่าหนึ่ง |
| `ends_with:value,...`   | ต้องลงท้ายด้วยค่าใดค่าหนึ่ง  |

🔐 5. Password & Confirm
| Rule        | ความหมาย                                                     |
| ----------- | ------------------------------------------------------------ |
| `confirmed` | ต้องมีฟิลด์ `xxx_confirmation` ที่ตรงกับ `xxx`               |
| `password`  | ตรวจรหัสผ่านตาม strength ที่ Laravel กำหนด (>= Laravel 8.43) |

📅 6. Date/Time Rules
| Rule                   | ความหมาย                 |
| ---------------------- | ------------------------ |
| `date`                 | ต้องเป็นวันที่ที่ถูกต้อง |
| `after:date`           | ต้องหลังจากวันที่ที่ระบุ |
| `before:date`          | ต้องก่อนวันที่ที่ระบุ    |
| `after_or_equal:date`  | หลังหรือเท่ากับวันที่    |
| `before_or_equal:date` | ก่อนหรือเท่ากับวันที่    |

📁 7. File Upload
| Rule                 | ความหมาย                                     |
| -------------------- | -------------------------------------------- |
| `file`               | ต้องเป็นไฟล์                                 |
| `image`              | ต้องเป็นภาพ (jpeg, png, bmp, gif, svg, webp) |
| `mimes:jpg,png,...`  | ต้องเป็นประเภทไฟล์ตามที่กำหนด                |
| `mimetypes:type/...` | ตรวจ MIME type                               |
| `max:x`              | ขนาดไฟล์สูงสุด (KB)                          |

🧩 8. Array / JSON
| Rule                   | ความหมาย                   |
| ---------------------- | -------------------------- |
| `array`                | ต้องเป็น array             |
| `json`                 | ต้องเป็น JSON ที่ valid    |
| `distinct`             | ห้ามซ้ำกันใน array         |
| `in:value1,value2`     | ต้องมีค่าตรงกับค่าที่กำหนด |
| `not_in:value1,value2` | ห้ามมีค่าตรงกับค่าที่กำหนด |

👥 9. Relationship / DB
| Rule                  | ความหมาย                           |
| --------------------- | ---------------------------------- |
| `exists:table,column` | ค่านี้ต้องมีอยู่ในตารางนั้นจริง    |
| `unique:table,column` | ห้ามซ้ำกับค่าที่มีอยู่ในตาราง      |
| `sometimes`           | ตรวจเฉพาะตอนที่ field มีมาเท่านั้น |

✅ 10. Boolean & Logic
| Rule            | ความหมาย                        |
| --------------- | ------------------------------- |
| `boolean`       | ต้องเป็น true/false หรือ 0/1    |
| `in` / `not_in` | ต้องตรงหรือไม่ตรงกับค่าที่กำหนด |

🧠 11. Custom Rule / เงื่อนไขพิเศษ
| Rule                              | ความหมาย                        |
| --------------------------------- | ------------------------------- |
| `required_if:field,value,...`     | จำเป็น ถ้าเงื่อนไขเป็นจริง      |
| `required_unless:field,value,...` | จำเป็น ถ้าไม่ตรงกับค่า          |
| `required_with:field,...`         | จำเป็น ถ้ามี field อื่นอยู่ด้วย |
| `required_without:field,...`      | จำเป็น ถ้าไม่มี field อื่น      |
| `prohibited`                      | ห้ามมีฟิลด์นี้มา                |
| `prohibited_if:...`               | ห้าม ถ้าเงื่อนไขเป็นจริง        |



สิ่งที่ต้องอัพขึ้นไป แน่ ๆ

ไฟล์ Laravel ทั้งหมด ยกเว้นบางโฟลเดอร์ (ตามลิสต์ด้านล่าง)

app/

bootstrap/

config/

database/

public/ (อันนี้สำคัญมาก เพราะเป็น entry point)

resources/

routes/

artisan และไฟล์ .php ที่อยู่ root (เช่น server.php)

.env.example (ไม่จำเป็น แต่เผื่อไว้)

ไฟล์ .env (ค่าจริงที่ใช้บน server)

ตั้งค่า DB, APP_KEY, URL, cache driver, mail ฯลฯ ให้ตรงกับ server จริง

ห้ามเอา .env ของ local ที่มีรหัสลับไปใช้ตรง ๆ ควรแก้ใหม่

composer.json และ composer.lock

เอาไว้ให้ server รู้ว่าเราต้องการ dependency อะไร

สิ่งที่ ไม่ควรอัพ

node_modules/

vendor/ (แนะนำให้รัน composer install --optimize-autoloader --no-dev บน server แทน)

storage/logs/* (ไม่ต้องยกเว้นทั้งโฟลเดอร์ เพราะต้องใช้เวลาเขียน log)

.env.local, .env.testing, อะไรที่ไม่ใช่ production

ไฟล์พวก test (tests/) ถ้าไม่จำเป็น

