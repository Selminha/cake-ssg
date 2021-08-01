# **cake-ssg (Cake Static Site Generator)**

## Content file structure
----

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
    "url":"content",
    "contentPath":"content",
    "sections":[
      {
        "name":"armas",
        "url":"content/armas",
        "contentPath":"content/armas",
        "sections":[
          {
            "name":"ingredientes",
            "url":"content/armas/ingredientes",
            "contentPath":"content/armas/ingredientes"
          }
        ]
      },
      {
        "name":"materiais",
        "url":"content/materiais",
        "contentPath":"content/materiais",
        "pages":[
          {
            "name":"index",
            "url":"/content/materiais/index.html",
            "contentPath":"content/materiais/index.json"
          }
        ],
        "sections":[
          {
            "name":"ingredientes",
            "url":"content/materiais/ingredientes",
            "contentPath":"content/materiais/ingredientes",
            "pages":[
              {
                "name":"açúcar",
                "url":"/content/materiais/ingredientes/açúcar.html",
                "contentPath":"content/materiais/ingredientes/açúcar.json"
              },
              {
                "name":"flor-doce",
                "url":"/content/materiais/ingredientes/flor-doce.html",
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
          "url":"/content/index.html",
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


 