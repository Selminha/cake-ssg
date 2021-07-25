import { CakeOptions }  from './CakeOptions';
import { HandlebarsTemplateBuilder } from './HandlebarsTemplateBuilder';

export class Cake {

  private options: CakeOptions;

  constructor(private userOptions?: CakeOptions) {
    const defaultOptions = {
      templateFolder: 'templates',
      contentFolder: 'content',
      outputFolder: 'dist',
    };
    this.options = { ...defaultOptions, ...userOptions};
  }

  bake(): void {
    const builder = new HandlebarsTemplateBuilder(this.options);
    console.log(builder.render('index', {}));
  }
}
