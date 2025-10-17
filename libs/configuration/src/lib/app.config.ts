export class AppConfiguration {
  // Define the application-specific configuration properties and methods here
  PORT: number;

  constructor() {
    this.PORT = process.env['PORT'] ? Number(process.env['PORT']) : 3300;
  }
}
