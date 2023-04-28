import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDoc(host: string) {
    return host;
  }
}
