import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly color: number;

  @ApiProperty()
  readonly image: string;

  @ApiProperty({
    enum: ['private', 'saving', 'main'],
  })
  readonly type: string;

  @ApiProperty({
    minimum: 0,
  })
  readonly startValue: number;

  @ApiProperty({ required: false })
  readonly currency?: string;
}
