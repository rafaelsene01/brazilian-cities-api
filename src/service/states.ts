import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class StatesService {
  readonly logger: Logger;
  readonly ttl: number;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.logger = new Logger();
    this.ttl = 600000;
  }

  @Cron('0 0 0 * * *')
  @OnEvent('get.states')
  private async handleCron() {
    const [error, states] = await this.getAllStates();
    if (error) {
      this.logger.error('Erro na busca dos estados');
    } else if (states) {
      this.cacheManager.set('states', states, this.ttl);
    }
  }

  @Cron('0 */5 * * * *')
  private async cacheStates() {
    const states = await this.cacheManager.get('states');
    if (states) this.cacheManager.set('states', states, this.ttl);
  }

  async getAllStates() {
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
