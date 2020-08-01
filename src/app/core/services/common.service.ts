import { Observable, of, BehaviorSubject } from 'rxjs';

import { StitchService } from './stitch.service';
import { MessageService } from './message.service';
import { RealmService } from './realm.service';

/**
 * M type stand for 'Model', the model type
 */
export abstract class CommonService<M> {
  /**
   * Attempt to code a Observable data service
   */
  protected dataStore: BehaviorSubject<M[]> = new BehaviorSubject<M[]>(null);

  public readonly data: Observable<M[]> = this.dataStore.asObservable();

  protected collectionName: string;
  protected serviceName: string;
  protected messageService: MessageService;
  protected backendService: RealmService;

  constructor() {}

  /**
   * Generic function to encapsulate any Baas used
   */
  protected callFunction<T>(functionName, parameters?: T[]): Promise<any> {
    return this.backendService.callFunction(functionName, parameters);
  }

  protected updateStore(values: M[]): void {
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

  /** Log a UserService message with the MessageService */
  protected log(message: string, service?: string) {
    service = service !== undefined ? service : 'UserService';
    this.messageService.add(`${service}: ${message}`);
  }
}
