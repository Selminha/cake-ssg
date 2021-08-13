# **cake-ssg (Cake Static Site Generator)**

Cake-ssg is a node static site generator. It merges your content files with your templates to generate the html of your site.

**Note:** Today cake-ssg only supports handlebars template engine, is our intention to give support to other templates engines in the future.

## Prerequisites
* latest version of node.js, you can download it from [official page](https://nodejs.org/en/).

## Installation instructions
* Install the prerequisites (see above)
* Install cake-ssg:
  * To install the latest version on npm globally, run:
    ```
    npm install -g cake-ssg
    ```
  * To install the latest version on npm locally and save it in your package's package.json file, run:
    ```
    npm install cake-ssg
    ```
  
## Usage
After install cake-ssg on your project, create a  *content* folder, to your content files, and a *templates* folder, to your templates.

Now you can require or import cake-ssg and use in your project:

    const { Cake } = require('cake-ssg');
    new Cake().bake();

By default cake-ssg will output processed html files to *dist* folder.

## Site Structure
The final structure of your site will be based on the structure defined in the content folder, for example, if you have the next structure on your content folder:

    content
      |--docs
        |--posts
        2021-08-10.json
      |--help
      index.json

Will result on:

      dist
      |--docs
        |--posts
        2021-08-10.html
      |--help
      index.html

## HTML Generation process
During the generation process cake-ssg will look  for content files on the *content* folder and search for the correspondent template on the *templates* folder, following the next rules:

1. First of all, cake-ssg will search for templates on the same folder structure and with the same filename of the content file, for example, to the content file  `content/docs/posts/2021-08-10.json`, cake will search for a template the `templates/docs/posts/2021-08-10.hbs`
 2. If there isn't a template that fullfill the rule above, cake-ssg will search for a template at the same folder structure but with the filename equal to `page`, for example, to the content file `content/docs/posts/2021-08-10.json`, cake will search for the template `templates/docs/posts/page.hbs`
 3. If there isn't a template that fullfill both of the rules above, cake-ssg will search for a template with filename `page` on the `default` folder inside the `templates` folder, for example, to the content file `content/docs/posts/2021-08-10.json`, cake will search for the template `templates/default/page.hbs`


Para não esquecer:
Ordem para buscar templates de page:
  1 - mesmo caminho que arquivo de conteúdo, mesmo nome do arquivo de conteúdo
  2 - mesmo caminho que arquivo de conteúdo, nome do template = "page"
  3 - diretório raiz dos templates, nome do template = "page"

Mesma ordem para buscar index (section), só que nome do template default é "index".

Regra para geração de index.html para section:
  Só irá gerar se o arquivo index existir na section(diretório) nas pastas de conteúdo

Conteúdo passado para uma page: 
{
  rootSection: árvore de dados globais
  meta: {
    name, 
    url,
    contentPath
  }, 
  content: {
    <!-- conteúdo do arquivo de index da section -->
  }
}

Conteúdo passado para uma section: 
{
  rootSection: árvore de dados globais
  meta: {
    name, 
    url,
    sectionPath,
    contentPath,
    sections: [], <!-- lista de meta section filhas -->
    pages: [] <!-- lista de meta pages filhas --> 
  }, 
  content: {
    <!-- conteúdo do arquivo de index da section -->
  }
}

exemplo de globaldata:
{
  "name": "content",
  "url": "",
  "sectionPath": "content",
  "contentPath": "content/index.json",
  "sections": [
    {
      "name": "materiais",
      "url": "materiais",
      "sectionPath": "content/materiais",
      "pages": [
        {
          "name": "açúcar",
          "url": "materiais/açúcar.html",
          "contentPath": "content/materiais/açúcar.json"
        },
        {
          "name": "flor-doce",
          "url": "materiais/flor-doce.html",
          "contentPath": "content/materiais/flor-doce.json"
        }
      ],
      "contentPath": "content/materiais/index.json"
    }
  ]
}

folders default:
  CONTENT_FOLDER = 'content';
  TEMPLATE_FOLDER = 'templates';
  DEFAULT_FOLDER = 'default';
  partialsFolder: 'partials' <!-- específico do handlebars -->

Detalhar as opções que podem ser passadas para o cake no CakeOptions


 