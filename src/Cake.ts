import * as glob from 'glob';
import { CakeOptions }  from './CakeOptions';

export class Cake {

  private options: CakeOptions;

  constructor(private userOptions?: CakeOptions) {
    const defaultOptions = {
      templateGlob: 'templates/**/*.hbs',
      dataGlob: 'content/**/*.json',
    };
    this.options = { ...defaultOptions, ...userOptions};
  }

  buildHtml(): void {
    console.log(this.options.templateGlob);
    const templates = glob.sync(this.options.templateGlob);
    console.log(templates);
  }
}
