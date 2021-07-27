import { HelperOptions } from "handlebars";
import { ContentHandler } from "../ContentHandler";

export class HandlebarsHelpers {

  constructor(private contentHandler: ContentHandler) {
  }

  public useContent(value: string, options: HelperOptions): string {
    const content = this.contentHandler.getContent(value);
    return options.fn({ content });
  }
}
