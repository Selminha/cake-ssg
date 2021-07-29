import * as fs from 'fs';

export class ContentHandler {

  /** Reads the file from given path and returns a JSON with its contents */
  getContent(filePath: string): unknown {
    //  TODO por hora não testa tipo de arquivo, só lê e tenta parsear
    try {
      const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
      if (content.length === 0)
        return {};

      return (JSON.parse(content));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      console.log('file ' + filePath + ' not found');
      return {};
    }
  }
}
