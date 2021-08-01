import * as path from 'path';
import * as fs from 'fs';
import { GlobalData, Meta, PageContext, SectionContext, SectionMeta } from './model/Content';

export class Util {

  public static readonly BAR_LENGTH = '/'.length;
  public static readonly PAGE = 'page';
  public static readonly INDEX = 'index';

  public static readonly CONTENT_FOLDER = 'content';
  public static readonly TEMPLATE_FOLDER = 'templates';
  public static readonly DEFAULT_FOLDER = 'default'

  public static isSection(contentPath: string): boolean {
    if (fs.lstatSync(contentPath).isDirectory()) {
      return true;
    }

    return false;
  }

  public static getMetaByContentPath(section: SectionMeta, sectionPath: string): Meta | SectionMeta | undefined {
    let returnValue: Meta | SectionMeta | undefined = undefined;
    if (section.pages) {
      for (const page of section.pages) {
        if (page.contentPath === sectionPath) {
          returnValue = page;
          break;
        }
      }
    }

    if (!returnValue) {
      if (section.sections) {
        for (const childSection of section.sections) {
          if (childSection.contentPath === sectionPath) {
            returnValue = childSection;
            break;
          }
          returnValue = Util.getMetaByContentPath(childSection, sectionPath);
        }
      }
    }

    return returnValue;
  }

  public static buildSectionContext(globalData: GlobalData, content: unknown, meta: SectionMeta): SectionContext {
    return {
      rootSection: globalData.rootSection,
      content: content,
      meta: meta,
    };
  }

  public static buildPageContext(globalData: GlobalData, meta: Meta, content: unknown): PageContext {
    return {
      rootSection: globalData.rootSection,
      meta: meta,
      content: content,
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
