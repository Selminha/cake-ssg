import { HelperOptions } from "handlebars";
import { ContentHandler } from "../ContentHandler";

export class HandlebarsHelpers {

  constructor(private contentHandler: ContentHandler) {
  }

  public useContent(value: string, options: HelperOptions): string {
    const contentHandler = new ContentHandler();
    // TODO mudar para o this.contentHandler
    const content = contentHandler.getContent(value);
    return options.fn({ content });
  }
}
