import * as path from 'path';
import * as fs from 'fs';
import { CakeOptions }  from './CakeOptions';
import { HandlebarsTemplateBuilder } from './HandlebarsTemplateBuilder';
import { glob } from 'glob';
import { Section } from './Section';

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
    };
    this.options = { ...defaultOptions, ...userOptions};
  }

  private getFileContent(filename: string, ext: string): any {
    try {
      var content = fs.readFileSync(filename, { encoding: 'utf-8' });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      console.log('file ' + filename + ' not found');
      return {};
    }    
    // add other types as necessary
    switch (ext)
    {
      case '.json': 
        if(content.length === 0)
          return {};

        return (JSON.parse(content));
    } 
    return {};
  }

  private getPageTemplatePath(builder: HandlebarsTemplateBuilder, parsedPath: path.ParsedPath):string {
    let templatepath: string = parsedPath.dir + this.BAR + parsedPath.name;
    if(builder.exists(templatepath)) {
      return templatepath;
    }
    templatepath = parsedPath.dir + this.BAR + this.PAGE;
    if(builder.exists(templatepath)) {
      return templatepath;
    }
    return this.PAGE;
  }

  private writeHtml(html: string, outDir: string, filename: string) {
    const htmlDir = this.options.outputFolder + this.BAR + outDir;
    if(html.length) {
      fs.promises.mkdir(htmlDir, { recursive: true })
      .then(x => fs.writeFile(htmlDir + this.BAR + filename + '.html',html, (err) => {
        if (err) throw err;
      }));
    }
  }

  private getSections(): Record<string, Section> {
    const contentFolders = glob.sync(`${this.options.contentFolder}/**/**`);
    let sections: Record<string, Section> = {};
    for (const contentFolder of contentFolders) {
      if(contentFolder ==  this.options.contentFolder) {
        // ignore root content folder
        continue;
      }
      const contentFolderName = contentFolder.substring(this.options.contentFolder.length + this.BAR.length, contentFolder.length);
      const parsedPath = path.parse(contentFolderName);
      if(!sections[parsedPath.dir]) {
        sections[parsedPath.dir] = { sections: [], pages: [] };
      }
      if(fs.lstatSync(contentFolder).isDirectory()) {
        sections[parsedPath.dir].sections.push(parsedPath.name);
      }
      else {
        sections[parsedPath.dir].pages.push(parsedPath.name);
      }
    }

    return sections;
  }

  private renderHtml(builder: HandlebarsTemplateBuilder) {
    const sections = this.getSections();
    const contentFiles = glob.sync(`${this.options.contentFolder}/**/*.*`);
    for (const contentFile of contentFiles) { 
      const contentFileName = contentFile.substring(this.options.contentFolder.length + this.BAR.length, contentFile.length);
      const parsedPath = path.parse(contentFileName);

      const fileContents = this.getFileContent(contentFile, parsedPath.ext);    
      
      if(parsedPath.name === this.SECTION) {
        console.log(contentFile);
      }
      const templatepath = this.getPageTemplatePath(builder, parsedPath);

      const html = builder.render(templatepath, fileContents);
      this.writeHtml(html, parsedPath.dir, parsedPath.name);
    }
  }

  bake(): void {
    const builder = new HandlebarsTemplateBuilder(this.options);
    this.renderHtml(builder);
  }
}
