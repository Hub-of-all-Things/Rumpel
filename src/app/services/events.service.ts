import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import { Event } from '../shared/index';
import * as moment from 'moment';

@Injectable()
export class EventsService {
  events$: Observable<any>;
  private _eventsObserver: Observer<any>;
  private _dataLoaded: boolean;
  private _store: { events: Array<Event> };

  constructor(private _http: Http) {
    this._dataLoaded = false;
    this._store = { events: [] };
    this.events$ = new Observable(observer => this._eventsObserver = observer).share();
  }

  loadAll() {
    if (this._dataLoaded) return this._eventsObserver.next(this._store.events);

    this._http.get('/mock-data/events.json').map(res => res.json())
      .map((data: Array<any>) => {
        const newEvents: Array<Event> = data.map((event) => {
          return {
            title: event.title,
            start: moment(event.start),
            end: event.end ? moment(event.end) : null
          };
        });
        return newEvents;
      })
      .subscribe(data => {
        this._dataLoaded = true;
        this._store.events = data;
        this._eventsObserver.next(this._store.events);
      }, err => console.log('There was an error loading events from HAT', err));
  }
}
