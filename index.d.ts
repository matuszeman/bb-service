declare module "@kapitchi/bb-service" {
  import * as Joi from 'joi';
  export {Joi};

  interface Logger {
    log(entry: any);
  }

  export class AbstractService {
    public options: any;
    constructor(options?: any, optionsSchema?: any);
    public setLogger(logger: Logger);
    protected params(params: any, schema: any): any;
    protected paramsAsync(params: any, schema: any): Promise<any>;
  }
}
