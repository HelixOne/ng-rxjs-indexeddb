import { Injectable, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as idbKeyVal from 'idb-keyval';

@Injectable()
export class NgRxjsIndexeddbService {

    private _data = {}
    private sync = false
   
    constructor() { }


    init(key) {
        if (this._data[key]) {
            return
        }
        this._data[key] = new BehaviorSubject(null);
        addEventListener('storage', (e: StorageEvent) => {
            let key = e.key.slice(18)
            if (key && this._data[key]) {
                this.get(key)
            }
        }, false);

    }
    setSync(sync){
        this.sync = !!(sync)
    }
    set(key, value) {
        this.init(key)
        idbKeyVal.set(key, value)
            .then(() => {
                this._data[key].next(value)
            })
            if(this.sync){
                localStorage.setItem('ng-rxjs-indexeddb-' + key, Math.random().toString())
            }
        
    }
    get(key) {
        this.init(key)
        idbKeyVal.get(key)
            .then((value) => {
                this._data[key].next(value)
            })
        return this.watch(key)
    }
    del(key) {
        this.init(key)
        idbKeyVal.get(key)
            .then(() => {
                this._data[key].next(null)
            })
    }
    private watch(key) {
        this.init(key)
        return new Observable(fn => this._data[key].subscribe(fn));
    }

}