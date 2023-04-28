import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDoc(host: string) {
    return [
      {
        estados: {
          url: `${host}/estados`,
        },
        cidades: {
          url: `${host}/estado/\${UF}/cidades`,
          param: ['UF'],
          query: ['name'],
        },
        'todos-registros': {
          url: `${host}/todos-registros`,
          query: ['name'],
        },
      },
    ];
  }
}
