import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly parent?: number;

  @ApiProperty()
  readonly image: string;

  @ApiProperty()
  readonly color: string;
}
