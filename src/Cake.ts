import * as fs from 'fs';
import { glob } from 'glob';
import * as path from 'path';
import { ContentHandler } from './ContentHandler';
import { HandlebarsTemplateBuilder } from './handlebars/HandlebarsTemplateBuilder';
import { CakeOptions } from './model/CakeOptions';
import { Page, Section, SectionMeta } from './model/Content';
import { TemplateBuilder } from './TemplateBuilder';
import { Util } from './Util';

export class Cake {

  private options: CakeOptions;
  private templateBuilder: TemplateBuilder;
  private contentHandler: ContentHandler;

  constructor(private userOptions?: CakeOptions) {
    const defaultOptions = {
      templateFolder: 'templates',
      contentFolder: 'content',
      outputFolder: 'dist',
    };
    this.options = { ...defaultOptions, ...userOptions};

    this.contentHandler = new ContentHandler();
    this.templateBuilder = new HandlebarsTemplateBuilder(this.options, this.contentHandler);
  }

  private getTemplatePath(templateBuilder: TemplateBuilder, parsedPath: path.ParsedPath): string {
    let templatepath = `${parsedPath.dir}/${parsedPath.name}`;
    if (templateBuilder.exists(templatepath)) {
      return templatepath;
    }
    templatepath = `${parsedPath.dir}/${Util.PAGE}`;
    if (templateBuilder.exists(templatepath)) {
      return templatepath;
    }
    return Util.PAGE;
  }

  private writeHtml(html: string, outDir: string, filename: string) {
    const htmlDir = `${this.options.outputFolder}/${outDir}`;
    if (html.length) {
      fs.mkdirSync(htmlDir, { recursive: true });
      fs.writeFileSync(`${htmlDir}/${filename}.html`, html);
    }
  }

  /**
   * First iterates the contents folder in order to retrieve SectionMeta for every section.
   * Sections are dependant on each other so this first parse is necessary.
   */
  private getSections(): Record<string, SectionMeta> {
    const contentFolders = glob.sync(`${this.options.contentFolder}/**/**`);
    const sections: Record<string, SectionMeta> = {};
    for (const contentFolder of contentFolders) {
      if (contentFolder ==  this.options.contentFolder) {
        // ignore root content folder
        continue;
      }
      const contentFolderName = contentFolder.substring(this.options.contentFolder.length + Util.BAR_LENGTH, contentFolder.length);
      const parsedPath = path.parse(contentFolderName);
      if (!sections[parsedPath.dir]) {
        sections[parsedPath.dir] = { sections: [], pages: [] };
      }
      if (fs.lstatSync(contentFolder).isDirectory()) {
        sections[parsedPath.dir].sections.push(parsedPath.name);
      } else {
        sections[parsedPath.dir].pages.push(parsedPath.name);
      }
    }

    return sections;
  }

  /**
   * Removes content folder from file path
   * @returns ParsedPath without the content folder
   */
  private getContentParsedPath(contentPath: string): path.ParsedPath {
    const contentFileName = contentPath.substring(this.options.contentFolder.length + Util.BAR_LENGTH, contentPath.length);
    return path.parse(contentFileName);
  }

  bake(): void {
    const sections = this.getSections();
    const contentPaths = glob.sync(`${this.options.contentFolder}/**/*.*`);
    for (const contentPath of contentPaths) {
      const parsedPath = this.getContentParsedPath(contentPath);
      const content = this.contentHandler.getContent(contentPath);
      const templatepath = this.getTemplatePath(this.templateBuilder, parsedPath);

      let html: string;
      if (parsedPath.name === Util.INDEX) {
        const section: Section = { meta: sections[parsedPath.dir], content: content }
        html = this.templateBuilder.render(templatepath, section);
      } else {
        // Precisa colocar o url
        const page: Page = {
          meta: {
            url: 'teste',
          },
          content,
        };
        html = this.templateBuilder.render(templatepath, page);
      }

      this.writeHtml(html, parsedPath.dir, parsedPath.name);
    }
  }
}
