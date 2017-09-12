"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var memory_storage_1 = require("./memory-storage");
var Storage = (function () {
    function Storage() {
        // preference && (this.preference = preference);   //'localStorage' or 'sessionStorage'
        this.preference = 'sessionStorage';
        if (this.preference == 'localStorage' && this.hasStorage('localStorage')) {
            this.storage = window.localStorage;
        }
        else if (this.preference == 'sessionStorage' && this.hasStorage('sessionStorage')) {
            this.storage = window.sessionStorage;
        }
        else {
            this.storage = new memory_storage_1.MemoryStorage();
        }
    }
    Object.defineProperty(Storage.prototype, "length", {
        get: function () { return this.storage.length; },
        enumerable: true,
        configurable: true
    });
    Storage.prototype.getItem = function (key) {
        var strValue = this.storage.getItem(key);
        try {
            return JSON.parse(strValue);
        }
        catch (e) {
            return strValue;
        }
    };
    Storage.prototype.setItem = function (key, value) {
        var strValue = typeof value === 'object' ? JSON.stringify(value) : value.toString();
        this.storage.setItem(key, strValue);
    };
    Storage.prototype.removeItem = function (key) { this.storage.removeItem(key); };
    Storage.prototype.clear = function () { this.storage.clear(); };
    Storage.prototype.hasStorage = function (name) {
        try {
            window[name].setItem('test', '1');
            window[name].removeItem('test');
            return true;
        }
        catch (e) {
            return false;
        }
    };
    return Storage;
}());
Storage = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], Storage);
exports.Storage = Storage;
//# sourceMappingURL=storage.js.map