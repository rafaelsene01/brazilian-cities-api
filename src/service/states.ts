import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { GlobalClass } from 'src/common/globalClass';

@Injectable()
export class StatesService extends GlobalClass {
  @Cron('0 0 0 * * *')
  private async handleCron() {
    this.getAllStates();
  }

  @OnEvent('get.states')
  async getAllStates() {
    const { data } = await axios.get(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
    );
    console.log(data);
  }
}
