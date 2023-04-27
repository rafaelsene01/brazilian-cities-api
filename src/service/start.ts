import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StartService implements OnApplicationBootstrap {
  constructor(private eventEmitter: EventEmitter2) {}

  onApplicationBootstrap() {
    this.eventEmitter.emit('get.states');
  }
}
