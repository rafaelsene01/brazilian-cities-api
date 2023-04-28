import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from '../service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req) {
    return this.appService.getDoc(req.headers.host);
  }
}
