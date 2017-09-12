import {Injectable} from "@angular/core";

@Injectable()
export class MemoryStorage {
  data: any = {};
  get length(): number                   { return Object.keys(this.data).length; }
  getItem(key: string)                   { return this.data[key]; }
  setItem(key: string, value: any): void { this.data[key] = value; }
  removeItem(key: string): void          { delete this.data[key]; }
  clear(): void                          { this.data = {} }
  key(num: number): string               { return Object.keys(this.data)[num]; }
}

