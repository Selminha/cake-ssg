import * as fs from "fs";
import { glob } from "glob";
import Handlebars from "handlebars";
import * as wax from 'wax-on';
import merge from 'ts-deepmerge';
import { ContentHandler } from "../ContentHandler";
import { CakeOptions, HandlebarsOptions } from "../model/CakeOptions";
import { TemplateBuilder, Templates } from "../TemplateBuilder";
import { Util } from "../Util";
import { HandlebarsHelpers } from "./HandlebarsHelpers";

export class HandlebarsTemplateBuilder extends TemplateBuilder {
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
    this.options = merge(defaults, userOptions);
    wax.on(Handlebars);
    wax.setLayoutPath(Util.TEMPLATE_FOLDER);
    this.registerBuiltInHelpers();
    this.registerUserHelpers();
    this.compileAll();
    this.registerPartials();
  }

  private compileAll(): void {
    const templatePaths = glob.sync(`${Util.TEMPLATE_FOLDER}/**/*.hbs`);
    for (const templatePath of templatePaths) {
      const templateName = templatePath.substring(Util.TEMPLATE_FOLDER.length + Util.BAR_LENGTH, templatePath.length - this.EXT_LENGTH);
      const fileContents = fs.readFileSync(templatePath, { encoding: 'utf-8' });
      console.log(templateName);
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
    Handlebars.registerHelper('useContent', HandlebarsHelpers.useContent);
  }

  private registerUserHelpers(): void {
    if (this.options.handlebars?.helpers === undefined) {
      return;
    }

    for (const helperKey in this.options.handlebars.helpers) {
      Handlebars.registerHelper(helperKey, this.options.handlebars.helpers[helperKey]);
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
