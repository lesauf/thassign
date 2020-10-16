import { Pipe, PipeTransform } from '@angular/core';
import { MessageService } from '@src/app/core/services/message.service';
import { isObservable, of } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';

@Pipe({
  name: 'withLoading',
})
export class WithLoadingPipe implements PipeTransform {
  constructor(protected messageService: MessageService) {}

  transform(val) {
    return isObservable(val)
      ? val.pipe(
          map((value: any) => ({ loading: false, value })),
          startWith({ loading: true }),
          catchError((error) => {
            // Notify the dev
            this.messageService.presentToast(error.message);
            this.messageService.log(error.message, error);
            return of({ loading: false, error });
          })
        )
      : val;
  }
}
