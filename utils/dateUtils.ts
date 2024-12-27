

export class DateUtils {
    static getCurrentKievDate(): Date {
        return new Date(new Date().toLocaleString('en-US', { timeZone: process.env.timezone }));
    }

    static isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
        const timestamp = date.getTime();
        return timestamp >= startDate.getTime() && timestamp <= endDate.getTime();
    }

    static formatDate(date: Date): string {
        return date.toLocaleString('uk-UA', {
            timeZone: process.env.timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static isValidGiveawayDate(startDate: Date, endDate: Date): boolean {
        const currentDate = this.getCurrentKievDate();

        if (startDate < currentDate) {
            return false;
        }

        if (endDate <= startDate) {
            return false;
        }

        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        if (endDate.getTime() - startDate.getTime() > thirtyDays) {
            return false;
        }

        return true;
    }

    static getTimeRemaining(endDate: Date): string {
        const total = endDate.getTime() - this.getCurrentKievDate().getTime();

        if (total <= 0) {
            return 'Розыгрыш завершен';
        }

        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((total / 1000 / 60) % 60);

        return `${days}д ${hours}ч ${minutes}м`;
    }

    static canParticipateNow(startDate: Date, endDate: Date): boolean {
        const currentDate = this.getCurrentKievDate();
        return this.isDateInRange(currentDate, startDate, endDate);
    }

    static getNextUpdateDate(startDate: Date, endDate: Date): Date {
        const currentDate = this.getCurrentKievDate();

        if (currentDate < startDate) {
            return startDate;
        }

        if (this.isDateInRange(currentDate, startDate, endDate)) {
            return endDate;
        }

        return currentDate;
    }
}