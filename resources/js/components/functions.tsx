import { useEffect, useState } from "react";


function Countdown({ date, time }: { date: string; time: string }) {
    const [remaining, setRemaining] = useState<number>(0); // millisecond

    useEffect(() => {
        // รวม date + time เป็น string แบบ ISO
        // สมมติ date = "2025-10-05", time = "20:00:00"
        // UTC+7 = ต้องลบ 7 ชั่วโมงเพื่อแปลงเป็น UTC
        const [hours, minutes, seconds] = time.split(":").map(Number);
        const target = new Date(date);
        target.setHours(hours, minutes, seconds, 0); // แปลงเป็น UTC

        const interval = setInterval(() => {
            const now = new Date();
            const diff = target.getTime() - now.getTime();
            setRemaining(diff > 0 ? diff : 0); // ไม่ให้เป็นค่าลบ
        }, 1000);

        return () => clearInterval(interval);
    }, [date, time]);

    // แปลง millisecond เป็น hh:mm:ss
    const hours = Math.floor(remaining / 1000 / 60 / 60);
    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    return (
        <div>
            {hours.toString().padStart(2, "0")}:
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
        </div>
    );
}


export {
    Countdown, //นับถอยหลัง
}
