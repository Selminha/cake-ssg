import * as fs from "fs";
import { glob } from "glob";
import Handlebars from "handlebars";
import { CakeOptions } from "./CakeOptions";
import { TemplateBuilder, Templates } from "./TemplateBuilder";
const wax = require('wax-on');

export class HandlebarsTemplateBuilder extends TemplateBuilder {
  private readonly BAR_LENGTH = '/'.length;
  private readonly EXT_LENGTH = '.hbs'.length;

  private templates: Templates = {};
  private options: CakeOptions;

  constructor(userOptions: CakeOptions) {
    super();
    const defaults = {
      handlebars: {
        partialsFolder: 'partials',
      },
    };
    this.options = { ...defaults, ...userOptions};
    wax.on(Handlebars);
    wax.setLayoutPath(this.options.templateFolder);
    this.compileAll();
    this.registerPartials();
  }

  private compileAll(): void {
    const templatePaths = glob.sync(`${this.options.templateFolder}/**/*.hbs`);
    for (const templatePath of templatePaths) {
      const templateName = templatePath.substring(this.options.templateFolder.length + this.BAR_LENGTH, templatePath.length - this.EXT_LENGTH);
      const fileContents = fs.readFileSync(templatePath, { encoding: 'utf-8' });
      this.templates[templateName] = Handlebars.compile(fileContents) as (data: unknown) => string;
    }
  }

  private registerPartials(): void {
    // If template starts with the partials folder, then it is a partial: registerPartial and remove the folder from the name
    const partialsFolder = `${this.options.handlebars?.partialsFolder}/`;
    for (const name in this.templates) {
      if (name.startsWith(partialsFolder)) {
        Handlebars.registerPartial(name.substr(partialsFolder.length), this.templates[name]);
      }
    }
  }

  exists(templateName: string): boolean {
    if (this.templates[templateName]) {
      return true;
    }
    return false;
  }

  render(template: string, data: unknown): string {
    const func = this.templates[template];
    if (!func) {
      console.error(`Template ${template} not found`);
      return '';
    }
    return func(data);
  }
}
