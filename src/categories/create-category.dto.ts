import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ required: true })
  readonly name: string;

  @ApiProperty({ required: false })
  readonly description: string;

  @ApiProperty({ required: false })
  readonly parent?: number;

  @ApiProperty({
    description: 'Icon from Font Awesome library',
    required: true,
  })
  readonly image: string;

  @ApiProperty({
    description: 'Color use as background in front, hex value',
    required: true,
  })
  readonly color: string;

  @ApiProperty({
    description: 'Define what type of category it is',
    required: true,
    enum: ['income', 'expense'],
  })
  readonly type: string;
}
