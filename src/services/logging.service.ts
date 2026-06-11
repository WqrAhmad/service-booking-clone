/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

export default class LoggingService {
  public log(message: string): void {
    console.log(`%cLOG: %c${message}`, 'color: yellow;', 'color: white');
  }

  public error(message: string, payload: unknown = null): void {
    console.log(`%cERR: %c${message}`, 'color: red; font-weight: bold', 'color: red');

    if (payload) {
      console.error('ERR: ', payload);
    }
  }
}
