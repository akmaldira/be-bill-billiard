export class HttpException extends Error {
  public status: number;
  public message: string;
  public errorKey: string;
  constructor(status: number, message: string, errorKey: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.errorKey = "API_ERROR_" + errorKey.toUpperCase();
  }
}
