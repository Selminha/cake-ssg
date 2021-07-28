import { HelperOptions } from "handlebars";
import { ContentHandler } from "../ContentHandler";
import { Util } from "../Util";

export class HandlebarsHelpers {

  public static useContent(this: void, contentPath: string, options: HelperOptions): string {
    const parsedPath = Util.getContentParsedPath(contentPath);
    const content = new ContentHandler().getContent(contentPath);
    return options.fn(Util.buildPage(parsedPath, content));
  }
}
