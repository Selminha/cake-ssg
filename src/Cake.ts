import * as glob from 'glob';
import { CakeOptions }  from './CakeOptions';

export class Cake {
  options: CakeOptions = new CakeOptions();

  constructor(options?: CakeOptions) {
    if (options) {
      this.options = options;
    }    
  }

  buildHtml() {
    console.log(this.options.templateGlob);
    var templates = glob.sync(this.options.templateGlob);
    console.log(templates);
  }
}
