import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const GetUserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    const jwtService = new JwtService(/* tus configuraciones de JWT aquí */);
    const decoded = jwtService.decode(token);
    return decoded['username']; // Asegúrate de que el claim se llama 'email'
  },
);
