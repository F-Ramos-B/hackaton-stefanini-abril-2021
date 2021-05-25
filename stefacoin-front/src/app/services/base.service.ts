import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService {

  constructor(protected http: HttpClient) { }

  private readonly PIPE_AMOUNT = 1;

  protected takeFilter<T>(observable: Observable<T>): Observable<T> {
    return observable.pipe(take(this.PIPE_AMOUNT));
  }

}
