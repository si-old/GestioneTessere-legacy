import { DataSource, CollectionViewer } from '@angular/cdk/collections'
import { Sort } from '@angular/material'

import { debounceTime, distinctUntilChanged, startWith, tap, map } from 'rxjs/operators'

import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs'

export class ObservableDataSource<T> implements DataSource<T>{

    constructor(private _obs: Observable<T[]>) { }

    connect(cv: CollectionViewer): Observable<T[]> { return this._obs; }

    disconnect() { }
}

export class SubjectDataSource<T> implements DataSource<T>{

    _sub: Subject<T[]> = new BehaviorSubject<T[]>(null);

    constructor() { }

    update(value: T[]) { this._sub.next(value); }

    connect(cv: CollectionViewer): Observable<T[]> { return this._sub; }

    disconnect() { }
}

export class FilteredSortedDataSource<T extends Searchable & Comparable<T>> extends DataSource<T>{

    _filter: Observable<string>;
    _sort: Observable<Sort>;

    constructor(private _data: Observable<T[]>, _sort: Observable<Sort>, _filter: Observable<string>) {
        super();
        this._sort = _sort.pipe(startWith<Sort>({ active: '', direction: '' }));
        this._filter = _filter.pipe(startWith<string>(''), debounceTime(150), distinctUntilChanged());
    }

    connect(cv: CollectionViewer): Observable<T[]> {
        return combineLatest( this._filter, this._sort, this._data).pipe(
            map(
                ((a: [string, Sort, T[]]) => {
                    let filter = a[0];
                    let sort = a[1];
                    let dataIn = a[2];

                    let data = dataIn.slice().filter((item: T) => {
                        return item.contains(filter.toLowerCase());
                    })
                    
                    if (!sort.active || sort.direction == '') {
                        return data;
                    } else {
                        return data.sort((a, b) => {
                            return a.compare(b, sort.active, sort.direction);
                        });
                    }

                })
            )
        );
    }

    disconnect() { }
}

export interface Comparable<T> {
    compare(other: T, property: string, order: string): number;
}

export interface Searchable {
    contains(needle: string): boolean;
}
