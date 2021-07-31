import * as path from 'path';
import { Page, Section, SectionMeta } from "./model/Content";

export class Util {

  public static readonly BAR_LENGTH = '/'.length;
  public static readonly PAGE = 'page';
  public static readonly INDEX = 'index';

  public static readonly CONTENT_FOLDER = 'content';
  public static readonly TEMPLATE_FOLDER = 'templates';
  public static readonly DEFAULT_FOLDER = 'default'

  public static buildSectionContext(meta: SectionMeta, content: unknown): Section {
    return {
      meta: meta,
      content,
    };
  }

  public static buildPageContext(parsedPath: path.ParsedPath, content: unknown): Page {
    return {
      meta: {
        url: `/${parsedPath.dir}/${parsedPath.name}.html`,
        name: parsedPath.name,
      },
      content,
    };
  }

  /**
   * Removes content folder from file path
   * @returns ParsedPath without the content folder
   */
  public static getContentParsedPath(contentPath: string): path.ParsedPath {
    const contentFileName = contentPath.substring(Util.CONTENT_FOLDER.length + Util.BAR_LENGTH, contentPath.length);
    return path.parse(contentFileName);
  }
}
