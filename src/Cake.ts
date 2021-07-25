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

  private getFileContent(filename: string, ext: string): any{
    // add other types as necessary
    switch (ext)
    {
      case '.json': 
        return (JSON.parse(fs.readFileSync(filename, { encoding: 'utf-8' })));
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

  private renderPages(builder: HandlebarsTemplateBuilder) {
    const contentFiles = glob.sync(`${this.options.contentFolder}/**/*.*`);
    for (const contentFile of contentFiles) { 
      const contentFileName = contentFile.substring(this.options.contentFolder.length + this.BAR.length, contentFile.length);
      const parsedPath = path.parse(contentFileName);

      const fileContents = this.getFileContent(contentFile, parsedPath.ext);      
      const templatepath = this.getPageTemplatePath(builder, parsedPath);
      
      const html = builder.render(templatepath, fileContents);
      const htmlDir = this.options.outputFolder + this.BAR + parsedPath.dir;
      if(html.length) {
        fs.promises.mkdir(htmlDir, { recursive: true })
        .then(x => fs.writeFile(htmlDir + this.BAR + parsedPath.name + '.html',html, (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        }));
      }
    }
  }

  bake(): void {
    this.renderPages(new HandlebarsTemplateBuilder(this.options));
  }
}
