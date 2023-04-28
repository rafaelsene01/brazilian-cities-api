import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {} from 'src/controller/all';

@Injectable()
export class NormalizeParamMiddleware implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;
    request.params = { ...params, state: params?.state?.toUpperCase() };
    return true;
  }
}
