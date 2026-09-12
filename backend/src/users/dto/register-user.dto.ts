import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
  })
  @Matches(/[a-z]/, {
    message: 'Das Passwort muss mindestens einen Kleinbuchstaben enthalten.',
  })
  @Matches(/[A-Z]/, {
    message: 'Das Passwort muss mindestens einen Großbuchstaben enthalten.',
  })
  @Matches(/[0-9]/, {
    message: 'Das Passwort muss mindestens eine Zahl enthalten.',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  birthDate: string;
}

