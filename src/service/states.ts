import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StatesService {
  readonly logger: Logger;
  readonly ttl: number;

  constructor(
    private eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.logger = new Logger();
    this.ttl = 4200000; // 70min
  }

  @Cron('0 0 0 * * *')
  @OnEvent('get.states')
  private async updateStates() {
    const [error, states] = await this.getStates();
    if (error) {
      this.logger.error('Atualização dos estados - retentativa em 5s');
      setTimeout(() => this.updateStates(), 5000);
    } else if (states) {
      this.cacheManager.set('states', states, this.ttl);
      this.logger.log('-- Estados atualizado --');
      this.eventEmitter.emit('get.cities', states);
    }
  }

  @Cron('0 50 * * * *')
  private async cacheStates() {
    const states = await this.cacheManager.get('states');
    if (states) this.cacheManager.set('states', states, this.ttl);
    this.logger.log('-- cache(states) estendido --');
  }

  async getStates() {
    try {
      const { data } = await axios.get(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      );

      return [null, data.map((i) => ({ sigla: i.sigla, estado: i.nome }))];
    } catch (error) {
      return [error];
    }
  }
}
