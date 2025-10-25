import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); //contexto de la peticion
    const response = ctx.getResponse(); // respuesta de la peticion
    const request = ctx.getRequest(); // Obtiene el objeto de solicitud -contiene toda la información que envía el cliente

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException 
      ? exception.getResponse : exception;

     response.status(status).json({
      success: false,
      statusCode: status,
      message:
        typeof response === 'string'
          ? response
          : (response as any).message || 'Unexpected error occurred',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
  