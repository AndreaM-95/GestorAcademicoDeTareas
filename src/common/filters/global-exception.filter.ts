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

    const status = exception instanceof HttpException //Si es mi excepción personalizada
      ? exception.getStatus() //Mi excepción personalizada
      : HttpStatus.INTERNAL_SERVER_ERROR; //Excepción de nest

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : exception;

    response.status(status).json({
      success: false,
      statusCode: status, 
      path: request.url, //Ruta donde se ha producido el error
      timeStamp: new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      message: message
    });
  }
}
  