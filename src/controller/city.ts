import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NormalizeParamMiddleware } from 'src/middleware/normalizeParam';
import { matchString } from 'src/utils';

@Controller('/estado/:state/cidades')
export class CityController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get()
  @UseGuards(NormalizeParamMiddleware)
  async findAll(@Param() { state }, @Query() { nome }) {
    const cache: [] = await this.cacheManager.get(`${state}.cities`);
    return cache.filter((i) => matchString(nome, i));
  }
}
