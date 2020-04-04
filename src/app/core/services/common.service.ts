import { Observable, of } from 'rxjs';
const { AnonymousCredential } = require('mongodb-stitch-browser-sdk');
const { HttpServiceClient } = require('mongodb-stitch-browser-services-http');

import { ConstantsService } from './constants.service';
import { MessageService } from './message.service';

export abstract class CommonService {
  protected stitchAppClient: any;

  protected db: any;

  dbService: any;

  constructor(
    protected messageService?: MessageService,
    protected constantsService?: ConstantsService
  ) {
    this.stitchAppClient = this.constantsService.stitchAppClient;
    this.db = this.constantsService.db;

    this.dbService = this.stitchAppClient.getServiceClient(
      HttpServiceClient.factory,
      'PartService'
    );
  }

  authenticate() {
    return this.stitchAppClient.auth.loginWithCredential(
      new AnonymousCredential()
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<T>(
    operation = 'operation',
    result?: T,
    service?: string
  ) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const errorMsg =
        error.error && error.error.message
          ? error.error.message
          : error.statusText;
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${errorMsg}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a UserService message with the MessageService */
  protected log(message: string, service?: string) {
    service = service !== undefined ? service : 'UserService';
    this.messageService.add(`${service}: ${message}`);
  }
}
