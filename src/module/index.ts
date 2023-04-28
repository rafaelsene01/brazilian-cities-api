import { Module } from '@nestjs/common';
import {
  AppController,
  StateController,
  CityController,
  AllController,
} from '../controller';
import {
  AppService,
  CityService,
  StartService,
  StatesService,
} from '../service';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, StateController, CityController, AllController],
  providers: [AppService, StartService, StatesService, CityService],
})
export class AppModule {}
