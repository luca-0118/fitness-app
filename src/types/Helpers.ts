export default async function FakeDelay(timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export const parseNumberInput = (value: string): number | null => {
    if (value.trim() === "") return 0;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
};

export function formatSecondsToHMS(totalSeconds: number): string {
    const safe = Math.max(0, Math.floor(totalSeconds));

    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const seconds = safe % 60;

    const pad = (n: number) => String(n).padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}


export function capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}