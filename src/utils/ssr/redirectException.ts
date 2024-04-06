export class RedirectException extends Error {
    destination=''
    constructor(destination:string) {
      super('RedirectException');
      this.destination = destination;
    }
  }
  