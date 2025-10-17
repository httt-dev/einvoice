import { IsNumber } from 'class-validator';

export class AppConfiguration {
  // Define the application-specific configuration properties and methods here
  @IsNumber()
  PORT: number;

  constructor() {
    this.PORT = process.env['PORT'] ? Number(process.env['PORT']) : 3300;
  }
}
