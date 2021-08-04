import * as fs from 'fs';
import * as path from 'path';
import merge from 'ts-deepmerge';
import { ContentHandler } from './ContentHandler';
import { HandlebarsTemplateBuilder } from './handlebars/HandlebarsTemplateBuilder';
import { CakeOptions } from './model/CakeOptions';
import { GlobalData, PageMeta, SectionMeta } from './model/Content';
import { TemplateBuilder } from './TemplateBuilder';
import { Util } from './Util';

export class Cake {

  private options: CakeOptions;
  private templateBuilder: TemplateBuilder;
  private contentHandler: ContentHandler;

  constructor(private userOptions?: CakeOptions) {
    const defaultOptions = {
      outputFolder: 'dist',
    };
    if (userOptions === undefined) {
      this.options = defaultOptions;
    } else {
      this.options = merge(defaultOptions, userOptions);
    }

    this.contentHandler = new ContentHandler();
    this.templateBuilder = new HandlebarsTemplateBuilder(this.options, this.contentHandler);
  }

  private getTemplatePath(templateBuilder: TemplateBuilder, parsedPath: path.ParsedPath): string {
    let templatepath = `${parsedPath.dir}/${parsedPath.name}`;
    if (templateBuilder.exists(templatepath)) {
      return templatepath;
    }

    const defaultTemplateName: string = (parsedPath.name === Util.INDEX) ? Util.INDEX : Util.PAGE;
    templatepath = parsedPath.dir ? `${parsedPath.dir}/${defaultTemplateName}` : `${defaultTemplateName}`;
    if (templateBuilder.exists(templatepath)) {
      return templatepath;
    }
    return `${Util.DEFAULT_FOLDER}/${defaultTemplateName}`;
  }

  private writeHtml(html: string, parsedPath: path.ParsedPath) {
    if (!html.length) return;
    const htmlDir = `${this.options.outputFolder}/${parsedPath.dir}`;
    fs.mkdirSync(htmlDir, { recursive: true });
    fs.writeFileSync(`${htmlDir}/${parsedPath.name}.html`, html);
  }

  private getSectionData(contentPath: string): SectionMeta {
    const itemsFolder = fs.readdirSync(contentPath);
    const section: SectionMeta = {
      name: path.basename(contentPath),
      url: contentPath.substring(Util.CONTENT_FOLDER.length + Util.BAR_LENGTH, contentPath.length),
      sectionPath: contentPath,
    };

    for (const itemFolder of itemsFolder) {
      const itemPath = contentPath.length > 0 ? `${contentPath}/${itemFolder}` : itemFolder;
      if (Util.isSection(`${contentPath}/${itemFolder}`)) {
        if (!section.sections) {
          section.sections = [];
        }
        section.sections.push(this.getSectionData(itemPath));
      } else {
        const parsedPath = Util.getContentParsedPath(itemPath);
        // Content of the section
        if (parsedPath.name === Util.INDEX) {
          section.contentPath = itemPath;
        } else {
          if (!section.pages) {
            section.pages = [];
          }
          const itemPage: PageMeta = {
            name: parsedPath.name,
            url: parsedPath.dir.length> 0 ? `${parsedPath.dir}/${parsedPath.name}.html` : `${parsedPath.name}.html`,
            contentPath: itemPath,
          };
          section.pages.push(itemPage);
        }
      }
    }

    return section;
  }

  private getGlobalData(): GlobalData {
    const globalData: GlobalData = {
      rootSection: this.getSectionData(Util.CONTENT_FOLDER),
    };

    return globalData;
  }

  private renderContent(meta: PageMeta|SectionMeta, contentPath: string, globalData: GlobalData) {
    const parsedPath = Util.getContentParsedPath(contentPath);
    const content = this.contentHandler.getContent(contentPath);
    const templatepath = this.getTemplatePath(this.templateBuilder, parsedPath);

    let html: string;
    if (parsedPath.name === Util.INDEX) {
      html = this.templateBuilder.render(templatepath, Util.buildSectionContext(globalData, meta as SectionMeta, content));
    } else {
      html = this.templateBuilder.render(templatepath, Util.buildPageContext(globalData, meta as PageMeta, content));
    }

    this.writeHtml(html, parsedPath);
  }

  private renderContents(section: SectionMeta, globalData: GlobalData): void {
    if (section.contentPath) {
      this.renderContent(section, section.contentPath, globalData);
    }

    if (section.pages) {
      for (const page of section.pages) {
        this.renderContent(page, page.contentPath, globalData);
      }
    }

    if (section.sections) {
      for (const childSection of section.sections) {
        this.renderContents(childSection, globalData);
      }
    }
  }

  bake(): void {
    const globalData = this.getGlobalData();
    this.renderContents(globalData.rootSection, globalData);
  }
}
