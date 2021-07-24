import { CakeOptions }  from './CakeOptions';
import { HandlebarsTemplateBuilder } from './HandlebarsTemplateBuilder';

export class Cake {

  private options: CakeOptions;

  constructor(private userOptions?: CakeOptions) {
    const defaultOptions = {
      templateFolder: 'templates',
      contentFolder: 'content',
    };
    this.options = { ...defaultOptions, ...userOptions};
  }

  bake(): void {
    const templates = new HandlebarsTemplateBuilder(this.options).build();
    console.log(templates);
  }
}
