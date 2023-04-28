import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NormalizeParamMiddleware } from 'src/middleware/normalizeParam';
import { matchString } from 'src/utils';

@Controller('/todos-registros')
export class AllController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get()
  @UseGuards(NormalizeParamMiddleware)
  async findAll(@Query() { nome }) {
    const cache: any[] = await this.cacheManager.get('state.cities');
    return cache.reduce((state, item) => {
      const cidades: [] = item?.cidades?.filter((i) => matchString(nome, i));
      if (cidades.length) return [...state, { ...item, cidades }];
      return [...state];
    }, []);
  }
}
