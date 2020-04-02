export class CreateIncomeDto {
  readonly name: string;
  readonly description: number;
  readonly value: number;
  readonly currency: string;
  readonly category?: number;
  readonly image: string;
}
