import { glob } from "glob";
import Handlebars from "handlebars";
import { CakeOptions } from "./CakeOptions";
import { TemplateBuilder, Templates } from "./TemplateBuilder";

export class HandlebarsTemplateBuilder extends TemplateBuilder {

  private readonly BAR_LENGTH = '/'.length;
  private readonly EXT_LENGTH = '.hbs'.length;

  constructor(private options: CakeOptions) {
    super();
  }

  build(): Templates {
    const templates: Templates = {};
    const templatePaths = glob.sync(`${this.options.templateFolder}/**/*.hbs`);
    for (const templatePath of templatePaths) {
      templates[this.getTemplateName(templatePath)] = Handlebars.compile(templatePath);
    }
    return templates;
  }

  private getTemplateName(templatePath: string): string {
    return templatePath.substring(this.options.templateFolder.length + this.BAR_LENGTH, templatePath.length - this.EXT_LENGTH);
  }
}
