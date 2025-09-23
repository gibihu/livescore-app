function ShortName(name: string): string {
    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
        // ถ้ามีคำเดียว → 2 ตัวแรก
        return parts[0].slice(0, 2);
    } else if (parts.length === 2) {
        // ถ้ามี 2 คำ → ตัวแรกของแต่ละคำ
        return (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
        // ถ้ามี 3 คำขึ้นไป → เอา 3 คำแรก แล้วเอาตัวแรกของแต่ละคำ
        return parts.slice(0, 3).map(p => p[0].toUpperCase()).join("");
    }
}

function EventTrans(event: string): string {
    let text = '';
    switch (event) {
        case 'GOAL':
            text = 'ทำประตู';
            break;
        case 'GOAL_PENALTY':
            text = 'ทำประตูจุดโทษ';
            break;
        case 'YELLOW_CARD':
            text = 'ใบเหลือง';
            break;
        case 'RED_CARD':
            text = 'ใบเแดง';
            break;
        case 'SUBSTITUTION':
            text = 'เปลี่ยนตัว';
            break;
        default:
            text = 'ไม่ทราบอีเว้น';
    }

    return text;
}

function timeDiff(futureDate: string | Date): string {
    const now: Date = new Date();
    const future: Date = typeof futureDate === "string" ? new Date(futureDate) : futureDate;

    // คำนวณส่วนต่าง (มิลลิวินาที)
    let diffMs: number = future.getTime() - now.getTime();

    if (diffMs < 0) {
        return "เวลาที่กำหนดผ่านมาแล้ว";
    }

    const days: number = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    diffMs -= days * (1000 * 60 * 60 * 24);

    const hours: number = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= hours * (1000 * 60 * 60);

    const minutes: number = Math.floor(diffMs / (1000 * 60));
    diffMs -= minutes * (1000 * 60);

    const seconds: number = Math.floor(diffMs / 1000);

    return `${days} วัน ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
}

function timeDiffRounded(futureDate: string | Date): string {
    const now: Date = new Date();
    const future: Date = typeof futureDate === "string" ? new Date(futureDate) : futureDate;

    let diffMs: number = future.getTime() - now.getTime();

    if (diffMs <= 0) {
        return "เวลาที่กำหนดผ่านมาแล้ว";
    }

    const days: number = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days > 0) {
        return `${days} ว.`;
    }

    const hours: number = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours > 0) {
        return `${hours} ชม.`;
    }

    const minutes: number = Math.floor(diffMs / (1000 * 60));
    if (minutes > 0) {
        return `${minutes} น.`;
    }

    const seconds: number = Math.floor(diffMs / 1000);
    return `${seconds} วิ.`;
}
function formatDateTime(input: string): string {
    if (!input) return input;
    const date = new Date(input.replace(" ", "T"));
    // แปลง "2025-09-19 09:54:16" → "2025-09-19T09:54:16"

    const day = date.getDate();
    const month = date.getMonth() + 1; // เดือนเริ่มนับจาก 0
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // ทำให้ minutes เป็นสองหลัก เช่น 09:05
    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${day}/${month} ${hours}:${pad(minutes)}`;
}


function isUpper(amount: number) {
    return amount >= 0 ? true : false;
}

function timeAgoShort(isoDate?: string): string {
    if (!isoDate) { return isoDate || ''; }
    const date = new Date(isoDate);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) return `${diffSec} วิ`;
    if (diffMin < 60) return `${diffMin} น.`;
    if (diffHour < 24) return `${diffHour} ชม.`;
    if (diffDay < 30) return `${diffDay} วัน`;
    if (diffMonth < 12) return `${diffMonth} เดือน`;
    return `${diffYear} ปี`;
}

function truncateMessage(message: string, maxLength = 200, dot = false): string {
    let show = message.length > maxLength ? message.slice(0, maxLength) : message;
    return show+(dot && '...');
}

function translateStatus(status: string) {
    let text = '';
    switch (status) {
        case 'pending':
            text = 'รอดำเนินการ';
            break;
        case 'cancel':
            text = 'ยกเลิก';
            break;
        case 'awaiting_approval':
            text = 'รออนุมัติ';
            break;
        case 'approved':
            text = 'อนุมัติแล้ว';
            break;
        case 'rejected':
            text = 'ปฏิเสธ';
            break;
        case 'failed':
            text = 'ล้มเหลว';
            break;
        case 'refund':
            text = 'ขอเงินคืน';
            break;
        case 'refunded':
            text = 'คืนเงิน';
            break;
        case 'public':
            text = 'เผยแพร่';
            break;
        case 'private':
            text = 'ส่วนตัว';
            break;
        default:
            text = 'ไม่พบสถาณะ';
    }
    return text;
}

export {
    ShortName, // แปลงชื่อเป็ตัวย่อ
    EventTrans, //แปลง status เป็นภาษาไทย
    timeDiff, //แปลง Data เป็นวันที่ภาษาไทย
    timeDiffRounded, // แปลง Data เป็นวันที่แบบย่อ
    formatDateTime, // แปลงวันที่เต็มเป็นสั่นๆ 9/19 22:30
    isUpper, //เพิ่มขึ้นหรือลดลง
    timeAgoShort, //แปลงวันที่เป็นอดีตแบบสั้น
    truncateMessage, // ตัดข้อความ
    translateStatus, // แปลงสถานะเป็นภาษาไทย
}
