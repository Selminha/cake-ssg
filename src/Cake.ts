import * as fs from 'fs';
import { glob } from 'glob';
import * as path from 'path';
import merge from 'ts-deepmerge';
import { ContentHandler } from './ContentHandler';
import { HandlebarsTemplateBuilder } from './handlebars/HandlebarsTemplateBuilder';
import { CakeOptions } from './model/CakeOptions';
import { SectionMeta } from './model/Content';
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
    templatepath = `${parsedPath.dir}/${Util.PAGE}`;
    if (templateBuilder.exists(templatepath)) {
      return templatepath;
    }
    return Util.PAGE;
  }

  private writeHtml(html: string, parsedPath: path.ParsedPath) {
    if (!html.length) return;
    const htmlDir = `${this.options.outputFolder}/${parsedPath.dir}`;
    fs.mkdirSync(htmlDir, { recursive: true });
    fs.writeFileSync(`${htmlDir}/${parsedPath.name}.html`, html);
  }

  /**
   * First iterates the contents folder in order to retrieve SectionMeta for every section.
   * Sections are dependant on each other so this first parse is necessary.
   */
  private getSections(): Record<string, SectionMeta> {
    const contentFolders = glob.sync(`${Util.CONTENT_FOLDER}/**/**`);
    const sections: Record<string, SectionMeta> = {};
    for (const contentFolder of contentFolders) {
      if (contentFolder ==  Util.CONTENT_FOLDER) {
        // ignore root content folder
        continue;
      }
      const contentFolderName = contentFolder.substring(Util.CONTENT_FOLDER.length + Util.BAR_LENGTH, contentFolder.length);
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

  bake(): void {
    const sections = this.getSections();
    const contentPaths = glob.sync(`${Util.CONTENT_FOLDER}/**/*.*`);
    for (const contentPath of contentPaths) {
      const parsedPath = Util.getContentParsedPath(contentPath);
      const content = this.contentHandler.getContent(contentPath);
      const templatepath = this.getTemplatePath(this.templateBuilder, parsedPath);

      let html: string;
      if (parsedPath.name === Util.INDEX) {
        html = this.templateBuilder.render(templatepath, Util.buildSection(sections[parsedPath.dir], content));
      } else {
        html = this.templateBuilder.render(templatepath, Util.buildPage(parsedPath, content));
      }

      this.writeHtml(html, parsedPath);
    }
  }
}
