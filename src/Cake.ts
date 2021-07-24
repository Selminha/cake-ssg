import * as glob from 'glob';
import { Options }  from './Options';

export class Cake {
  options: Options = new Options();

  constructor(options?: Options) {
    if(options) {
      this.options = options;
    }    
  }

  buildHtml() {
    console.log(this.options.templatePattern);
    var templates = glob.sync(this.options.templatePattern);
    console.log(templates);
  }
}
