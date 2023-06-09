import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetPaystackHeaders = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.headers[data];
    }
    return false;
  },
);
