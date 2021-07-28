import * as fs from "fs";
import { glob } from "glob";
import Handlebars, { HelperOptions } from "handlebars";
import { CakeOptions, HandlebarsOptions } from "../model/CakeOptions";
import { TemplateBuilder, Templates } from "../TemplateBuilder";
import { ContentHandler } from "../ContentHandler";
import { HandlebarsHelpers } from "./HandlebarsHelpers";
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires */
const wax = require('wax-on');

export class HandlebarsTemplateBuilder extends TemplateBuilder {
  private readonly BAR_LENGTH = '/'.length;
  private readonly EXT_LENGTH = '.hbs'.length;

  private templates: Templates = {};
  private options: CakeOptions;

  constructor(userOptions: CakeOptions, private contentHandler: ContentHandler) {
    super();
    const defaults = {
      handlebars: {
        partialsFolder: 'partials',
      },
    };
    this.options = { ...defaults, ...userOptions};
    /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
    wax.on(Handlebars);
    /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
    wax.setLayoutPath(this.options.templateFolder);
    this.registerBuiltInHelpers();
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
    // If template is inside the partials folder: registerPartial removing the folder from the name
    const partialsFolder = `${(this.options.handlebars as HandlebarsOptions).partialsFolder}/`;
    for (const name in this.templates) {
      if (name.startsWith(partialsFolder)) {
        Handlebars.registerPartial(name.substr(partialsFolder.length), this.templates[name]);
      }
    }
  }

  private registerBuiltInHelpers(): void {
    const helpers = new HandlebarsHelpers(this.contentHandler);
    Handlebars.registerHelper('useContent', helpers.useContent);
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
