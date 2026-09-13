import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { RoleType } from '../../generated/prisma/client';

export class CreateRoleApplicationDto {
  @IsEnum(RoleType)
  role: RoleType;

  @IsOptional()
  @IsInt()
  @Min(1)
  vereinId?: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
