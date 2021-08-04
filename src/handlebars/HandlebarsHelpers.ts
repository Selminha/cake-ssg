import { HelperOptions } from "handlebars";
import { ContentHandler } from "../ContentHandler";
import { Util } from "../Util";
import { GlobalData, PageMeta, SectionMeta } from '../model/Content';

interface Data {
  root: GlobalData
}
export class HandlebarsHelpers {

  public static useContent(this: void, contentPath: string, options: HelperOptions): string {
    const data = options.data as Data;
    const meta = Util.getMetaByContentPath(data.root.rootSection, contentPath);
    if (!meta) {
      console.log(`useContent - Content Meta of ${contentPath} not found`);
    }

    if (Util.isSection(contentPath)) {
      const content = new ContentHandler().getContent(`${contentPath}/${Util.INDEX}.json`);
      return options.fn(Util.buildSectionContext(data.root, meta as SectionMeta, content));
    }

    const content = new ContentHandler().getContent(contentPath);
    return options.fn(Util.buildPageContext(data.root, meta as PageMeta, content));
  }
}
