/**
 * ===================================
 * UTILS - CÁC HÀM TIỆN ÍCH
 * ===================================
 */

/**
 * Format ngày tháng
 * @param {string|Date} date - Ngày cần format
 * @param {string} format - Định dạng ('date', 'datetime', 'time')
 */
export const formatDate = (date, format = 'date') => {
    if (!date) return '';

    const d = new Date(date);

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    switch (format) {
        case 'datetime':
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        case 'time':
            return `${hours}:${minutes}`;
        default:
            return `${day}/${month}/${year}`;
    }
};

/**
 * Tính BMI
 * @param {number} weight - Cân nặng (kg)
 * @param {number} height - Chiều cao (cm)
 */
export const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

/**
 * Đánh giá BMI
 * @param {number} bmi
 */
export const getBMIStatus = (bmi) => {
    if (!bmi) return null;

    if (bmi < 18.5) return { status: 'Thiếu cân', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (bmi < 25) return { status: 'Bình thường', color: 'text-green-600', bg: 'bg-green-100' };
    if (bmi < 30) return { status: 'Thừa cân', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { status: 'Béo phì', color: 'text-red-600', bg: 'bg-red-100' };
};

/**
 * Đánh giá huyết áp
 * @param {number} systolic - Tâm thu
 * @param {number} diastolic - Tâm trương
 */
export const getBloodPressureStatus = (systolic, diastolic) => {
    if (!systolic || !diastolic) return null;

    if (systolic < 90 || diastolic < 60) {
        return { status: 'Huyết áp thấp', color: 'text-blue-600', bg: 'bg-blue-100' };
    }
    if (systolic <= 120 && diastolic <= 80) {
        return { status: 'Bình thường', color: 'text-green-600', bg: 'bg-green-100' };
    }
    if (systolic <= 140 || diastolic <= 90) {
        return { status: 'Huyết áp cao nhẹ', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    }
    return { status: 'Huyết áp cao', color: 'text-red-600', bg: 'bg-red-100' };
};

/**
 * Đánh giá nhịp tim
 * @param {number} heartRate
 */
export const getHeartRateStatus = (heartRate) => {
    if (!heartRate) return null;

    if (heartRate < 60) {
        return { status: 'Nhịp tim chậm', color: 'text-blue-600', bg: 'bg-blue-100' };
    }
    if (heartRate <= 100) {
        return { status: 'Bình thường', color: 'text-green-600', bg: 'bg-green-100' };
    }
    return { status: 'Nhịp tim nhanh', color: 'text-red-600', bg: 'bg-red-100' };
};

/**
 * Lấy tên ngày trong tuần
 * @param {number} dayIndex - 0-6 (CN - T7)
 */
export const getDayName = (dayIndex) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[dayIndex];
};

/**
 * Lấy tên đầy đủ ngày trong tuần
 * @param {number} dayIndex
 */
export const getFullDayName = (dayIndex) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[dayIndex];
};

/**
 * Lấy label cho loại nhắc nhở
 * @param {string} type
 */
export const getReminderTypeLabel = (type) => {
    const types = {
        medicine: 'Uống thuốc',
        exercise: 'Tập thể dục',
        sleep: 'Ngủ nghỉ',
        water: 'Uống nước',
        meal: 'Bữa ăn',
        checkup: 'Khám sức khỏe',
        other: 'Khác'
    };
    return types[type] || 'Khác';
};

/**
 * Lấy màu cho loại nhắc nhở
 * @param {string} type
 */
export const getReminderTypeColor = (type) => {
    const colors = {
        medicine: 'bg-red-100 text-red-700',
        exercise: 'bg-green-100 text-green-700',
        sleep: 'bg-purple-100 text-purple-700',
        water: 'bg-blue-100 text-blue-700',
        meal: 'bg-orange-100 text-orange-700',
        checkup: 'bg-pink-100 text-pink-700',
        other: 'bg-gray-100 text-gray-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
};

/**
 * Truncate text
 * @param {string} text
 * @param {number} maxLength
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
