import * as fs from 'fs';

class Cake {
  templatePath: string;
  dataPath: string;

  constructor(templatePath: string, dataPath: string) {
    this.templatePath = templatePath;
    this.dataPath = dataPath;
  }
}

export = Cake;