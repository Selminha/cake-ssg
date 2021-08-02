# **cake-ssg (Cake Static Site Generator)**

## Quick Start
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
  
## Getting Started
After install cake-ssg on your project you will need to create some folders to laydown your content files and templates files. Cake-ssg will search for files on this folders in order to merge them and create the correspondent html file.

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
  "rootSection":{
    "name":"content",
    "url":"",
    "contentPath":"content",
    "sections":[
      {
        "name":"armas",
        "url":"armas",
        "contentPath":"content/armas",
        "sections":[
          {
            "name":"ingredientes",
            "url":"armas/ingredientes",
            "contentPath":"content/armas/ingredientes"
          }
        ]
      },
      {
        "name":"materiais",
        "url":"materiais",
        "contentPath":"content/materiais",
        "pages":[
          {
            "name":"index",
            "url":"materiais/index.html",
            "contentPath":"content/materiais/index.json"
          }
        ],
        "sections":[
          {
            "name":"ingredientes",
            "url":"materiais/ingredientes",
            "contentPath":"content/materiais/ingredientes",
            "pages":[
              {
                "name":"açúcar",
                "url":"materiais/ingredientes/açúcar.html",
                "contentPath":"content/materiais/ingredientes/açúcar.json"
              },
              {
                "name":"flor-doce",
                "url":"materiais/ingredientes/flor-doce.html",
                "contentPath":"content/materiais/ingredientes/flor-doce.json"
              }
            ]
          }
        ]
      }
    ],
    "pages":[
        {
          "name":"index",
          "url":"index.html",
          "contentPath":"content/index.json"
        }
    ]
   }
}

folders default:
  CONTENT_FOLDER = 'content';
  TEMPLATE_FOLDER = 'templates';
  DEFAULT_FOLDER = 'default';
  partialsFolder: 'partials' <!-- específico do handlebars -->

Detalhar as opções que podem ser passadas para o cake no CakeOptions


 