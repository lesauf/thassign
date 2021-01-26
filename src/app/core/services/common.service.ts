import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

import { MessageService } from '@src/app/core/services/message.service';
import { BackendService } from '@src/app/core/services/backend.service';

/**
 * M type stand for 'Model', the model type
 */
@Injectable()
export abstract class CommonService<M> {
  /**
   * Observable data service
   * the type will be converted to Map<string, M>
   */
  protected dataStore: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  public readonly data: Observable<any>; //  = this.dataStore.asObservable();

  protected collectionName: string;
  protected serviceName: string;
  protected messageService: MessageService;
  protected backendService: BackendService;

  constructor() {
    this.data = this.dataStore.asObservable();
  }

  /**
   * Generic function to encapsulate any Baas used
   */
  protected callFunction<T>(functionName, parameters?: any[]): Promise<any> {
    return this.backendService.callFunction(functionName, parameters);
  }

  /**
   * Generic function to encapsulate any Baas used
   */
  // protected callFunctionViaHook<T>(
  //   functionName,
  //   parameters?: T[]
  // ): Promise<any> {
  //   return this.backendService.callFunctionViaHook(functionName, parameters);
  // }

  /**
   * Update the store with the most recent data from the DB
   * @param values
   */
  protected updateStore(values: any): void {
    this.dataStore.next(values);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @Todo Fix this
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<T>(
    operation = 'operation',
    error: any,
    result?: T,
    service?: string
  ): T {
    // For now, just throw the error.
    if (error) {
      throw error;
    }

    return result;
    // return (error: any): Observable<T> => {
    //   // TODO: send the error to remote logging infrastructure
    //   console.error(error); // log to console instead

    //   const errorMsg =
    //     error.error && error.error.message
    //       ? error.error.message
    //       : error.statusText;
    //   // TODO: better job of transforming error for user consumption
    //   this.log(`${operation} failed: ${errorMsg}`);

    //   // Let the app keep running by returning an empty result.
    //   // return of(result as T);
    // };
  }

  /**
   * Log an error/message to send the developer
   */
  protected log(message: string, service?: string) {
    service = service !== undefined ? service : this.constructor.name;
    this.messageService.add(`${service}: ${message}`);
  }
}
