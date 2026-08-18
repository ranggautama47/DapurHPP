import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (process.env.ENABLE_PERF_LOG !== 'true') {
      return next.handle();
    }
    const start = Date.now();
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`[PERF] ${method} ${url} total ${duration}ms`);
      }),
    );
  }
}
