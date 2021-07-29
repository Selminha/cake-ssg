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

Conteúdo passado para uma section: 
{
  meta: {
    sections: [], <!-- lista de section filhas -->
    pages: [] <!-- lista de pages filhas --> 
  }, 
  content: {
    <!-- conteúdo do arquivo de index da section -->
  }
}

folders default:
  CONTENT_FOLDER = 'content';
  TEMPLATE_FOLDER = 'templates';
  DEFAULT_FOLDER = 'default';
  partialsFolder: 'partials' <!-- específico do handlebars -->

Detalhar as opções que podem ser passadas para o cake no CakeOptions


 