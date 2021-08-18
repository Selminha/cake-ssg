# Cake Static Site Generator

Cake-ssg is a Static Site Generator made from coders for coders. It is a node module instead of a CLI tool, so the idea here is that you create your own Nodejs project in order to build your site and use cake-ssg as part of the build process.  

As it is with every Static Site Generator, cake-ssg's work is done at build time. It will pick up data from your content folder, mix it with templates from your template folder and generate the static HTML files for your site that you can deploy to any HTTP server.  

Cake-ssg deals only with HTML, allowing you to produce your own CSS and JS anyway you want.  

**Note:** Currently cake-ssg only has support for [JSON](https://www.json.org) formatted input and the [Handlebars](https://handlebarsjs.com) template engine. Support for other input formats and template engines is to be included in the roadmap.

## Prerequisites
* Latest version of Nodejs. You can download it from its [official page](https://nodejs.org/en/).

## Installation instructions
Create a new node project:
```
  npm init
```
Install cake-ssg:
```
  npm install cake-ssg
```
Create a *content* folder to store your content files and a *templates* folder to store your template files. Create also a javascript source file. The structure of your project may look something like this:

    /content
    /node_modules
    /templates
    index.js
    package-lock.json
    package.json

Now in index.js you can require cake-ssg and use it:

    const { Cake } = require('cake-ssg');

    new Cake().bake();

By default cake-ssg will output processed html files to the *dist* folder. You can run your project by running **node index**. However, this simple setup will output nothing because you still have no content and no templates.  

## Content

Content files are your data. Cake-ssg will try to render an html file for each content file, provided you also have a correspondent template file. Currently cake-ssg only supports JSON formatted content files. This is an example of a valid content file:

```json
  {
    "title": "Traveling over Europe",
    "body": "Nice sunny weather in Santorini, a lot of snow in Amsterdam."
  }
```

## Templates

Template files are placeholders for your page structure, intended to be interpolated with different data. Cake-ssg will match a content file with a template file in order to create an html file. Currently cake-ssg only supports Handlebars template files. This is an example of a valid template file:

```html
  <h2>{{ content.title }}</h2>
  <p>{{ content.body }}</p>
```

## Understanding the Rendering Process

Consider the content file `content/docs/posts/traveling-europe.json`, where:
- **docs/posts/** is the path
- **traveling-europe** is the filename
- **.json** is the extension

Cake-ssg will try to render an html file for each content file in the *content* folder. In order to do that, it will search for the correspondent template file in the *templates* folder, according to the following rules:

1. Same path and filename of the content file;

2. Same path but with the filename equal to `page`;

3. Default path `templates/default` with the filename equal to `page`.  

For example, for the content file `content/docs/posts/traveling-europe.json`, cake-ssg will retrieve the first template on this list:
- `templates/docs/posts/traveling-europe.hbs`
- `templates/docs/posts/page.hbs`
- `templates/default/page.hbs`

This allows you to have one specific template for each content file, but also generic templates for all content files in a subfolder, and an even more generic template for anything else. The html file will always be written to the *output* folder with the same path of the content file, independent of which template file has ben used. In this case, the html will be outputted at `dist/docs/posts/traveling-europe.html`. If none of these template files exist, the html will not be rendered.


## Pages, Sections and Home

Every content file is treated as a **Page**, with a single exception: if a content file is named as `index`, then this is treated as a **Section**. You can see Sections as the pages for your folders. They will have different metadata available, such as references for all pages and subsections within the section. The template file for a section must be named `index.hbs`.

The Home page of your site is also treated as a Section, with the exception that it does not need a content file in order to be rendered; just having the template at `templates/index.hbs` is enough.


## Input Objects

When cake-ssg identifies a template to be used with the content, it will parse the template using a specific Input Object that represents that content. Depending on the type of the content - Page or Section - this object is as follows:

### Page Input Object

```json
    {
      rootSection: globalData, <!--see definition on section GlobalData -->
      meta: {
        name, <!-- page name, content filename without extension -->
        url,
        contentPath <!-- path of the content file -->
      },
      content: {
        <!-- data from the content file -->
      }
    }
```
### Section Input Object

```json
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
```

### GlobalData
Global data have meta data of all pages and sections of the *content* folder, below an example of globaldata.

```json
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
```

## Configuration

It is possible to change some cake-ssg configurations by passing a CakeOptions object to the Cake constructor.

* outputfolder (string): change the output folder of rendered html, default value is `dist`. Example:

```javascript
    const cakeOptions = {
      output: "out",
    };
    const cake = new Cake(cakeOptions);
```

## Handlebars

The default template engine of cake-ssg is [Handlebars](https://handlebarsjs.com). Please check out its documentation in order to understand how to build template files.  

Handlebars has the concept of "partials", so in order to treat templates as partials you should put them in a special folder. The default path is `/partials`, but this can be changed (see Handlebars Configuration below).  

Also, to make the templates more flexible, cake-ssg includes [wax-on](https://www.npmjs.com/package/wax-on), a node module that allows template inheritance with the `block` and `extends` Handlebars block helpers.  


### Handlebars Configuration

It's possible to change some cake-ssg configurations related to Handlebars by adding a HandlebarsOptions object to the CakeOptions object and passing it to the Cake constructor. 

* partialsFolder (string): change the partials folder, default value is `partials`. Example:

```javascript
    const cakeOptions = {
      handlebars: {
        partialsFolder: "handlebarsPartials"
      }        
    }
    const cake = new Cake(cakeOptions);
```

* helpers: (Record<string, Handlebars.HelperDelegate>). You can create your own set of helpers. Example:

```javascript
    const cakeOptions = {
      handlebars: {
        helpers: {
          'bold': (options) => {
            return new Handlebars.SafeString('<div class="mybold">' + options.fn(this) + "</div>");
          }
        }
      }
    }
    const cake = new Cake(cakeOptions);
```

### Handlebars Built In Helpers

Cake-ssg defines some Handlebars Helpers of its own:

* useContent: Get the data from another page based on the content path and use it to render html according to the template passed to the helper. Example:

```html
    {{#useContent 'content/ingredients/sugar.json' }}
      <div>
        <a href="{{ meta.url }}">
          <img src="{{ content.imagem }}" alt="{{ content.nome }}"/>
          <div class="qtd">{{ ../quantidade }}</div>
        </a>
      </div>  
    {{/useContent}}
```
