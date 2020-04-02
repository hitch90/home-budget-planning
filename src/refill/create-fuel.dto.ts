export class CreateFuelDto {
  readonly name: string;
  readonly description: number;
  readonly value: number;
  readonly unitValue: number;
  readonly mileage: number;
  readonly fuel: number;
  readonly car: string;
  readonly currency: string;
  readonly category?: number;
}
