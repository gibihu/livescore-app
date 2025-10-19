import { FavoriteType } from "@/types/app";

export class Favorite {
  private static storageKey = 'favorites';

  /** ✅ ดึงทั้งหมด */
  static get(): FavoriteType[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? (JSON.parse(data) as FavoriteType[]) : [];
  }

  /** 🔍 หา favorite ตาม match_id */
  static find(match_id: string): FavoriteType | undefined {
    const all = this.get();
    return all.find((f) => f.match_id === match_id);
  }

  /** ➕ เพิ่ม favorite ใหม่ (ถ้ามีอยู่แล้วไม่เพิ่ม) */
  static add(data: Omit<FavoriteType, 'create_at' | 'updated_at'>): FavoriteType | null {
    const all = this.get();
    const exists = all.some((f) => f.match_id === data.match_id);

    if (exists) return null; // มีอยู่แล้ว ไม่เพิ่มซ้ำ

    const now = new Date().toISOString();
    const newFav: FavoriteType = {
      ...data,
      create_at: now,
      updated_at: now,
    };

    all.push(newFav);
    localStorage.setItem(this.storageKey, JSON.stringify(all));

    return newFav;
  }

  /** 🔄 อัปเดตหรือสร้างใหม่ ถ้า match_id ไม่มีจะสร้างใหม่ */
  static update(match_id: string, newData: Partial<FavoriteType>): FavoriteType {
    const all = this.get();
    const index = all.findIndex((f) => f.match_id === match_id);
    const now = new Date().toISOString();

    if (index !== -1) {
      // มีอยู่แล้ว → อัปเดต
      all[index] = {
        ...all[index],
        ...newData,
        updated_at: now,
      };
    } else {
      // ไม่มี → สร้างใหม่
      all.push({
        match_id,
        status: newData.status ?? 'active',
        create_at: now,
        updated_at: now,
      });
    }

    localStorage.setItem(this.storageKey, JSON.stringify(all));
    return this.find(match_id)!;
  }
}
