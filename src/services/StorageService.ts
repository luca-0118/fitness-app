/**
 * SRP: Concrete implementation of IStorageService that delegates to the
 * browser's localStorage API.  Keeping storage access in one place makes it
 * easy to swap the persistence mechanism (e.g. sessionStorage, an in-memory
 * store for tests) without touching business logic.
 */
export class LocalStorageService implements IStorageService {
    getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}
