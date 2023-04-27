import { Controller, Get, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppService } from '../service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/a')
  async findAll() {
    const cacheStatus: URL[] = await this.cacheManager.get('all-status');
    if (cacheStatus) return cacheStatus;

    const status = await this.appService.getHello();
    this.cacheManager.set('all-status', status, 30);

    return status;
  }
}
