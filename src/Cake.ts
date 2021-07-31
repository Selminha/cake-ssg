import * as fs from 'fs';
import { glob } from 'glob';
import { url } from 'inspector';
import * as path from 'path';
import merge from 'ts-deepmerge';
import { ContentHandler } from './ContentHandler';
import { HandlebarsTemplateBuilder } from './handlebars/HandlebarsTemplateBuilder';
import { CakeOptions } from './model/CakeOptions';
import { SectionMeta } from './model/Content';
import { GlobalData, Item, Section } from './model/GlobalData';
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

  private getSectionData(contentPath: string): Section {
    console.log(contentPath);
    const itemsFolder = fs.readdirSync(contentPath);
    const section: Section = {
      name: path.basename(contentPath),
      url: contentPath,
      contentPath: contentPath,
    };

    for (const itemFolder of itemsFolder) {
      const itemPath = contentPath.length > 0 ? `${contentPath}/${itemFolder}` : itemFolder;
      if (fs.lstatSync(`${contentPath}/${itemFolder}`).isDirectory()) {
        if (!section.sections) {
          section.sections = [];
        }
        section.sections.push(this.getSectionData(itemPath));
      } else {
        if (!section.pages) {
          section.pages = [];
        }
        const parsedPath = path.parse(itemPath);
        const itemPage: Item = {
          name: parsedPath.name,
          url: parsedPath.dir.length> 0 ? `/${parsedPath.dir}/${parsedPath.name}.html` : `/${parsedPath.name}.html`,
          contentPath: itemPath,
        };
        section.pages.push(itemPage);
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

  private renderContent(section: Section): void {
    if (section.pages) {
      for (const page of section.pages) {
        const parsedPath = Util.getContentParsedPath(page.contentPath);
        const content = this.contentHandler.getContent(page.contentPath);
        const templatepath = this.getTemplatePath(this.templateBuilder, parsedPath);

        let html: string;
        if (parsedPath.name === Util.INDEX) {
          // hml = this.templateBuilder.render(templatepath, Util.buildSectionContext(sections[parsedPath.dir], content));
          console.log(page.contentPath);
          html = this.templateBuilder.render(templatepath, Util.buildPageContext(parsedPath, content));
        } else {
          html = this.templateBuilder.render(templatepath, Util.buildPageContext(parsedPath, content));
        }

        this.writeHtml(html, parsedPath);
      }
    }

    if (section.sections) {
      for (const childSection of section.sections) {
        this.renderContent(childSection);
      }
    }
  }

  bake(): void {
    const globalData = this.getGlobalData();
    console.log(JSON.stringify(globalData));

    this.renderContent(globalData.rootSection);
  }
}
