// import {
//   HttpEvent,
//   HttpInterceptor,
//   HttpHandler,
//   HttpRequest,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { Observable } from 'rxjs';

// import { tap } from "rxjs/operators";

// export class HttpErrorInterceptor implements HttpInterceptor {
//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     return next.handle(request).tap(
//       (event: HttpEvent<any>) => { },
//       (err: any) => {
//         if (err instanceof HttpErrorResponse) {
//           const text =
//             err.error && err.error.message ? err.error.message : err.statusText;
//           // (<any>window).globalEvents.emit('open error dialog', text);
//         }
//       }
//     );
//   }
// }
