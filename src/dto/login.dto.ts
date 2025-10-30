import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength, MaxLength } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: 'jp@gmail.com', description: 'Email valido del usuario' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', description: 'Contraseña minima de 6 caracteres y maximo 20' })
    @MinLength(6)
    @MaxLength(20)
    password: string;
}