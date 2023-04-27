import { Logger } from '@nestjs/common';

export class GlobalClass {
  readonly logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
}
