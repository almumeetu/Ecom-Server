import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsObject, IsOptional } from "class-validator";

export class UpdatePolicyDto {
  @ApiPropertyOptional({ description: 'Delivery policy (title, content)' })
  @IsObject()
  @IsOptional()
  delivery?: { title: string; content: string };

  @ApiPropertyOptional({ description: 'Return policy (title, content)' })
  @IsObject()
  @IsOptional()
  return?: { title: string; content: string };

  @ApiPropertyOptional({ description: 'Refund policy (title, content)' })
  @IsObject()
  @IsOptional()
  refund?: { title: string; content: string };

  @ApiPropertyOptional({ description: 'Cancellation policy (title, content)' })
  @IsObject()
  @IsOptional()
  cancellation?: { title: string; content: string };

  @ApiPropertyOptional({ description: 'Privacy policy (title, content)' })
  @IsObject()
  @IsOptional()
  privacy?: { title: string; content: string };

  @ApiPropertyOptional({ description: 'Terms & conditions (title, content)' })
  @IsObject()
  @IsOptional()
  terms?: { title: string; content: string };
}
