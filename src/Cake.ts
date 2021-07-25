import * as path from 'path';
import * as fs from "fs";
import { CakeOptions }  from './CakeOptions';
import { HandlebarsTemplateBuilder } from './HandlebarsTemplateBuilder';
import { glob } from "glob";

export class Cake {

  private options: CakeOptions;
  private readonly BAR = '/';
  private readonly PAGE = 'page'

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
      // add other types as necessary
      switch (ext)
      {
        case '.json': 
          return (JSON.parse(fs.readFileSync(filename, { encoding: 'utf-8' })));
      } 
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      console.log('file ' + filename + ' not found');
      return {};
    }
    
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
        console.log('The file has been saved!');
      }));
    }
  }

  private renderPages(builder: HandlebarsTemplateBuilder) {
    const contentFiles = glob.sync(`${this.options.contentFolder}/**/*.*`);
    for (const contentFile of contentFiles) { 
      const contentFileName = contentFile.substring(this.options.contentFolder.length + this.BAR.length, contentFile.length);
      const parsedPath = path.parse(contentFileName);

      const fileContents = this.getFileContent(contentFile, parsedPath.ext);      
      const templatepath = this.getPageTemplatePath(builder, parsedPath);

      const html = builder.render(templatepath, fileContents);
      this.writeHtml(html, parsedPath.dir, parsedPath.name);
    }
  }

  // render index without content, it will be overwritten if content exists
  private renderIndex(builder: HandlebarsTemplateBuilder) {
    const templatepath = 'index';
    if(!builder.exists(templatepath)) {
      console.log('Error: index template not found');
      return;
    }

    const html = builder.render(templatepath, {});
    this.writeHtml(html, '', 'index');
  }

  bake(): void {
    const builder = new HandlebarsTemplateBuilder(this.options);
    this.renderIndex(builder);
    this.renderPages(builder);
  }
}
