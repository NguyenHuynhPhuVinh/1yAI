/**
 * Lấy giá trị từ localStorage.
 * @param key Khóa cần lấy.
 * @param defaultValue Giá trị mặc định nếu không tìm thấy khóa.
 * @returns Giá trị từ localStorage hoặc giá trị mặc định.
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") {
        return defaultValue; // Trả về mặc định nếu không ở môi trường trình duyệt
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
        console.error(`Lỗi khi đọc localStorage key "${key}":`, error);
        return defaultValue;
    }
}

/**
 * Lưu giá trị vào localStorage.
 * @param key Khóa cần lưu.
 * @param value Giá trị cần lưu.
 */
export function setLocalStorage<T>(key: string, value: T): void {
    if (typeof window === "undefined") {
        console.warn("Không thể lưu vào localStorage: không ở môi trường trình duyệt.");
        return;
    }
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Lỗi khi ghi localStorage key "${key}":`, error);
    }
}

/**
 * Xóa giá trị khỏi localStorage.
 * @param key Khóa cần xóa.
 */
export function removeLocalStorage(key: string): void {
    if (typeof window === "undefined") {
        console.warn("Không thể xóa khỏi localStorage: không ở môi trường trình duyệt.");
        return;
    }
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.error(`Lỗi khi xóa localStorage key "${key}":`, error);
    }
}
