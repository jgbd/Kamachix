export declare class MemoryStorage {
    data: any;
    readonly length: number;
    getItem(key: string): any;
    setItem(key: string, value: any): void;
    removeItem(key: string): void;
    clear(): void;
    key(num: number): string;
}
