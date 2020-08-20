import { Injectable } from '@angular/core';

import { RealmService } from '@src/app/core/services/realm.service';

@Injectable()
export class BackendService extends RealmService {
  async callFunction(functionName: string, params?: any[]) {
    try {
      return {};
    } catch (error) {
      throw error;
    }
  }
}
