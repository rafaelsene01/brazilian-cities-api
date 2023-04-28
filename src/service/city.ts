import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as parallel from 'async/parallel';

@Injectable()
export class CityService {
  readonly logger: Logger;
  readonly ttl: number;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.logger = new Logger();
    this.ttl = 4200000; // 70min
  }

  @OnEvent('get.cities')
  private async updateCities(payload) {
    try {
      const cities = await parallel(
        payload.reduce(
          (obj, item) => ({
            ...obj,
            [item.sigla]: async () => await this.getCitiesState(item.sigla),
          }),
          {},
        ),
      );
      const stateAndCities = payload.reduce(
        (Arr, item) => [...Arr, { ...item, cidades: cities[item.sigla] }],
        [],
      );
      stateAndCities.forEach((item) => {
        this.cacheManager.set(`${item.sigla}.cities`, item.cidades, this.ttl);
      });
      this.logger.log('-- Cidades por estado atualizado --');
      this.cacheManager.set(`state.cities`, stateAndCities, this.ttl);
      this.logger.log('-- Estados/Cidades atualizado --');
    } catch (_) {
      this.logger.error('Atualização das cidades - retentativa em 5s');
      setTimeout(() => this.updateCities(payload), 5000);
    }
  }

  @Cron('0 55 * * * *')
  private async cacheCities() {
    const states: any[] = await this.cacheManager.get('states');
    const stateAndCities = await states.reduce(async (Arr, item) => {
      const cities = await this.cacheManager.get(`${item.sigla}.cities`);
      return [...(await Arr), { ...item, cidades: cities }];
    }, Promise.resolve([]));
    stateAndCities.forEach((item) => {
      this.cacheManager.set(`${item.sigla}.cities`, item.cidades, this.ttl);
    });
    this.logger.log('-- cache(*.cities) estendido --');
    this.cacheManager.set(`state.cities`, stateAndCities, this.ttl);
    this.logger.log('-- cache(state.cities) estendido --');
  }

  async getCitiesState(state: string) {
    const { data } = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/distritos?view=nivelado`,
    );
    return data.map((i) => i['distrito-nome']);
  }
}
