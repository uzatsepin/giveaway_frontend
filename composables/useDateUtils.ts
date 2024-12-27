import { format } from "date-fns";
import {uk} from "date-fns/locale";

export const formatDate = (date: string) => {
    return new Date(date).toISOString().slice(0, 16);
};

export const formatDateTable = (date: string | Date) => {
    try {
        const parsedDate = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date');
        }
        return format(parsedDate, "dd MMMM yyyy, HH:mm", { locale: uk });
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Invalid date';
    }
};

export const validateDates = (startDate: Date, endDate: Date): boolean => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    return start < endDate && start >= now;
};

export const formatDateCard = (date: Date) => {
    return new Date(date).toLocaleString("uk-UA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};