import { HelperOptions } from "handlebars";
import { ContentHandler } from "../ContentHandler";

export class HandlebarsHelpers {

  public static useContent(this:void, value: string, options: HelperOptions): string {
    const content = new ContentHandler().getContent(value);
    // TODO: passar um objeto do tipo Page, não só o content
    return options.fn({ content });
  }
}
