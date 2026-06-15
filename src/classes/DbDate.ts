/**
 * A class that helps use and parse the data coming from the database.
 */
export default class DbDate extends Date
{
    constructor(dbDate?:string) {
        if (!dbDate) {
            super();
            return;
        }
        // Normalize the string: handle the fractional seconds and timezone offset
        // Format: "2026-05-05 9:23:28.0317886 +00"

        // Replace space before timezone offset with nothing, normalize to ISO-like format
        const normalized = dbDate
            .trim()
            // Pad single-digit hour if needed: "9:23" -> "09:23"
            .replace(/^(\d{4}-\d{2}-\d{2})\s+(\d):/, '$1 0$2:')
            // Truncate fractional seconds to 3 digits (milliseconds)
            .replace(/(\.\d{3})\d+/, '$1')
            // Normalize timezone: "+00" -> "+00:00", "-05" -> "-05:00"
            .replace(/\s([+-]\d{2})$/, '$1:00')
            // Replace space separator with "T" for ISO 8601
            .replace(' ', 'T');

        const date = new Date(normalized);

        if (isNaN(date.getTime())) {
            throw new Error(`Unable to parse date string: "${dbDate}"`);
        }

        super(date);
    }

    public toDMY() {
        return `${this.getDate()}-${this.getMonth()}-${this.getFullYear()}`;
    }

    public toHS() {
        return `${this.getHours()}:${this.getMinutes().toString().padStart(2, "0")}`
    }

    static TimeDifference(date1:DbDate,date2:DbDate): {hours:number,minutes:number,seconds:number} {
        const diffMs = Math.abs(date2.getTime() - date1.getTime()); // difference in milliseconds

        const hours   = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);

        return { hours, minutes, seconds };
    }
}