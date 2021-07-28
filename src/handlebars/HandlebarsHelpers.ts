import { HelperOptions } from "handlebars";
import { ContentHandler } from "../ContentHandler";

export class HandlebarsHelpers {

  public static useContent(this: void, contentPath: string, options: HelperOptions): string {
    const content = new ContentHandler().getContent(contentPath);
    // TODO: passar um objeto do tipo Page, não só o content
    return options.fn({ content });
  }
}
