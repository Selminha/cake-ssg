import * as path from 'path';
import * as fs from 'fs';
import { CakeOptions }  from './CakeOptions';
import { HandlebarsTemplateBuilder } from './HandlebarsTemplateBuilder';
import { glob } from 'glob';
import { Section } from './Section';
import { Page } from './Page';
import { JsonContentHandler } from './JsonContentHandler';

export class Cake {

  private options: CakeOptions;
  private readonly BAR = '/';
  private readonly PAGE = 'page';
  private readonly SECTION = 'index';

  constructor(private userOptions?: CakeOptions) {
    const defaultOptions = {
      templateFolder: 'templates',
      contentFolder: 'content',
      outputFolder: 'dist',
      contentFileType: 'json',
    };
    this.options = { ...defaultOptions, ...userOptions};
  }

  private getPageTemplatePath(builder: HandlebarsTemplateBuilder, parsedPath: path.ParsedPath):string {
    let templatepath: string = parsedPath.dir + this.BAR + parsedPath.name;
    if (builder.exists(templatepath)) {
      return templatepath;
    }
    templatepath = parsedPath.dir + this.BAR + this.PAGE;
    if (builder.exists(templatepath)) {
      return templatepath;
    }
    return this.PAGE;
  }

  private writeHtml(html: string, outDir: string, filename: string) {
    const htmlDir = this.options.outputFolder + this.BAR + outDir;
    if (html.length) {
      fs.promises.mkdir(htmlDir, { recursive: true })
      .then(x => fs.writeFile(htmlDir + this.BAR + filename + '.html',html, (err) => {
        if (err) throw err;
      }));
    }
  }

  private getSections(): Record<string, Section> {
    const contentFolders = glob.sync(`${this.options.contentFolder}/**/**`);
    const sections: Record<string, Section> = {};
    for (const contentFolder of contentFolders) {
      if (contentFolder ==  this.options.contentFolder) {
        // ignore root content folder
        continue;
      }
      const contentFolderName = contentFolder.substring(this.options.contentFolder.length + this.BAR.length, contentFolder.length);
      const parsedPath = path.parse(contentFolderName);
      if (!sections[parsedPath.dir]) {

        sections[parsedPath.dir] = { meta: { sections: [], pages: [] } };
      }
      if (fs.lstatSync(contentFolder).isDirectory()) {
        sections[parsedPath.dir].meta.sections.push(parsedPath.name);
      } else {
        sections[parsedPath.dir].meta.pages.push(parsedPath.name);
      }
    }

    return sections;
  }

  private renderHtml(builder: HandlebarsTemplateBuilder) {
    const contentHandler = new JsonContentHandler();
    const sections = this.getSections();
    const contentFiles = glob.sync(`${this.options.contentFolder}/**/*.*`);
    for (const contentFile of contentFiles) {
      const contentFileName = contentFile.substring(this.options.contentFolder.length + this.BAR.length, contentFile.length);
      const parsedPath = path.parse(contentFileName);

      const fileContents = contentHandler.getFileContent(contentFile);
      const templatepath = this.getPageTemplatePath(builder, parsedPath);

      let html: string;

      if (parsedPath.name === this.SECTION) {
        sections[parsedPath.dir].content = fileContents;
        html = builder.render(templatepath, sections[parsedPath.dir]);
      } else {
        // Precisa colocar o meta
        const page: Page = { content: fileContents };
        html = builder.render(templatepath, page);
      }

      this.writeHtml(html, parsedPath.dir, parsedPath.name);
    }
  }

  bake(): void {
    const builder = new HandlebarsTemplateBuilder(this.options);
    this.renderHtml(builder);
  }
}
