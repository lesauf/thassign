import { Injectable } from '@angular/core';

import { StitchService } from '@src/app/core/services/stitch.service';

@Injectable()
export class BackendService {
  async callFunction(functionName: string, params?: any[]) {
    try {
      return {};
    } catch (error) {
      throw error;
    }
  }
}
