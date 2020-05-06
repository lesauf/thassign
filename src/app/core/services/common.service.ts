import { Observable, of } from 'rxjs';

import { StitchService } from './stitch.service';
import { MessageService } from './message.service';

export abstract class CommonService {
  /**
   * DB collection
   */
  collection: any;

  /**
   * Webhook root URL
   */
  // webHookUrl: string;

  /**
   * DB service
   */
  // dbService: any;

  constructor(
    protected collectionName: string,
    protected serviceName: string,
    protected messageService?: MessageService,
    protected stitchService?: StitchService
  ) {
    this.collection = stitchService.getCollectionByName('parts');
    // this.webHookUrl = stitchService.getServiceWebHookUrl('PartService');
    // this.dbService = stitchService.getDbService('PartService');
  }

  /**
   * Generic function to encapsulate any Baas used
   */
  protected callFunction<T>(functionName, parameters: T[]): Promise<any> {
    return this.stitchService.callFunction(functionName, parameters);
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
    result?: T,
    service?: string
  ) {
    // For now, just throw the error.
    if (result) {
      throw result;
    }
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
