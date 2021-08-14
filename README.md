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

## Rendering HTML Process
To start the rendering html process call function `bake` of cake object.

During the rendering process cake-ssg will look  for content files on the *content* folder and search for the correspondent template on the *templates* folder, following the next rules:

1. First of all, cake-ssg will search for templates on the same folder structure and with the same filename of the content file, for example, to the content file  `content/docs/posts/2021-08-10.json`, cake will search for a template the `templates/docs/posts/2021-08-10.hbs`
 2. If there isn't a template that fullfill the rule above, cake-ssg will search for a template at the same folder structure but with the filename equal to `page`, for example, to the content file `content/docs/posts/2021-08-10.json`, cake will search for the template `templates/docs/posts/page.hbs`
 3. If there isn't a template that fullfill both of the rules above, cake-ssg will search for a template with filename `page` on the `default` folder inside the `templates` folder, for example, to the content file `content/docs/posts/2021-08-10.json`, cake will search for the template `templates/default/page.hbs`

## Template Input Object
Cake-ssg works with two types of template input objects, Page Input Object and Section Input Object.

Page Input Object will be passed to the template to render regular pages. Section Input Object will be passed to index pages. Below are the structure of these Input Objects:

* Page Input Object

      {
        rootSection: globalData <!--see definition on section GlobalData -->
        meta: {
          name, <!-- page name, content filename without extension -->
          url,
          contentPath <!-- path of the content file -->
        }, 
        content: {
          <!-- data from the content file -->
        }
      } 

* Section Input Object

      {
        rootSection: globalData <!--see definition on section GlobalData -->
        meta: {
          name, <!-- page name, content filename without extension --> 
          url,
          sectionPath,
          contentPath, <!-- path of the content file, in this case will always be the index.json file -->
          sections: [], <!-- list with the meta data of the children sections -->
          pages: [] <!-- list with the meta data of the children pages --> 
        }, 
        content: {
          <!-- data from the index.json content file -->
        }
      }

### GlobalData
Global data have meta data of all pages and sections of the *content* folder, below an example of globaldata.


    {
      "name": "content",
      "url": "",
      "sectionPath": "content",
      "contentPath": "content/index.json",
      "sections": [
        {
          "name": "ingredients",
          "url": "ingredients",
          "sectionPath": "content/ingredients",
          "pages": [
            {
              "name": "sugar",
              "url": "ingredients/sugar.html",
              "contentPath": "content/ingredients/sugar.json"
            },
            {
              "name": "flour",
              "url": "ingredients/flour.html",
              "contentPath": "content/ingredients/flour.json"
            }
          ],
          "contentPath": "content/ingredients/index.json"
        }
      ]
    }

## Configuration
It's possible to change some cake-ssg configurations by passing a CakeOptions object to the Cake constructor.

* outputfolder (string): change the output folder of rendered html, default value is `dist`. Example:

      const cakeOptions = {
        output: "out"
      }
      const cake = new Cake(cakeOptions);

## Handlebars
Cake-ssg render pages based on handlebars templates, as handlebars can work with partials it's possible to put your templates partials in a partials folder called `partials`.

To make the templates more flexible, cake-ssg uses [wax-on](https://www.npmjs.com/package/wax-on), a node module that allows template inheritance with the `block` and `extends`, on the rendering processing.

### Handlebars Built In Helpers
Cake-ssg define some Built In Helpers to make easy to write the templates:

* useContent: Get the data from another page based on the content path and use it to render html according to the template passed to the helper. Example:

      {{#useContent 'content/ingredients/sugar.json' }}
        <div>
          <a href="{{ meta.url }}">
            <img src="{{ content.imagem }}" alt="{{ content.nome }}"/>
            <div class="qtd">{{ ../quantidade }}</div>
          </a>
        </div>  
      {{/useContent}}

### Handlebars Configuration
It's possible to change some cake-ssg configurations related to handlebars by configuring it at CakeOptions object and passing to the Cake constructor. 

* partialsFolder (string): change the partials folder, default value is `partials`. Example:

      const cakeOptions = {
        handlebars: {
          partialsFolder: "handlebarsPartials"
        }        
      }
      const cake = new Cake(cakeOptions);

* helpers: (Record<string, Handlebars.HelperDelegate>). Example:

      const cakeOptions = {
        handlebars: {
          helpers: {
            'repeat': (n, block) => {
              /* helper code */
            },
          }
        }
      }

      const cake = new Cake(cakeOptions);

 