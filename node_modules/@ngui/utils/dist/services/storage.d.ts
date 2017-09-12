export declare class Storage {
    preference: any;
    storage: any;
    constructor();
    readonly length: number;
    getItem(key: any): any;
    setItem(key: string, value: any): void;
    removeItem(key: string): void;
    clear(): void;
    private hasStorage(name);
}
