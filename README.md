## Webpack plugin: minify-html-webpack-plugin

[![npm](https://img.shields.io/npm/v/minify-html-webpack-plugin)](https://www.npmjs.com/package/minify-html-webpack-plugin)
[![node-current](https://img.shields.io/node/v/minify-html-webpack-plugin)](https://nodejs.org)
[![npm](https://img.shields.io/npm/dm/minify-html-webpack-plugin)](https://npmcharts.com/compare/minify-html-webpack-plugin?minimal=true)
[![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/ashutoshSce/minify-html-webpack-plugin)](https://github.com/kangax/html-minifier)
[![NPM](https://img.shields.io/npm/l/minify-html-webpack-plugin)](https://www.npmjs.com/package/minify-html-webpack-plugin)

This is a [webpack](http://webpack.github.io/) plugin that can minimize the HTML with [HTMLMinifier](https://www.npmjs.com/package/html-minifier) for all source directory files and copy into destinations directory recursively iterating through all subfolders and files during the Webpack build.

Installation
============
Install the plugin with npm:
```shell
$ npm install minify-html-webpack-plugin --save-dev
```

Heads up!
===========
_**Please do not report issues related to HTML parsing and output on this repository. Report those issues to the [html-minifier](https://github.com/kangax/html-minifier/issues) issue tracker.**_

Basic Usage
===========
Add the plugin to your webpack and config as follows:

```javascript
    const MinifyHtmlWebpackPlugin = require('minify-html-webpack-plugin');
    const webpackConfig = {
        plugins: [
            new MinifyHtmlWebpackPlugin({
                src: './storage/framework/views',
                dest: './storage/framework/views',
                rules: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    minifyJS: true,
                }
            });
        ]
    };
```

Optional Add Search And Replace Rules
=================
If need to replace strings and then do minification across all source files in directoris and sub-directories.

```javascript
    const MinifyHtmlWebpackPlugin = require('minify-html-webpack-plugin');
    const webpackConfig = {
        plugins: [
            new MinifyHtmlWebpackPlugin({
                src: './storage/framework/views',
                dest: './storage/framework/views',
                rules: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    minifyJS: true,
                },
                searchAndReplace: [
                    {
                        /* The string, or regular expression, that will be replaced by the new value */
                        search: 'search_string',
                        /* The string to replace the search value with */
                        replace: 'replace_string' 
                    }
                ]
            });
        ]
    };
```

If need to replace array of string with common replace funtions and then minify it across source files and sub-directories.

```javascript
    const MinifyHtmlWebpackPlugin = require('minify-html-webpack-plugin');
    const webpackConfig = {
        plugins: [
            new MinifyHtmlWebpackPlugin({
                afterBuild: true,
                src: './storage/framework/views',
                dest: './storage/framework/views',
                rules: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    minifyJS: true,
                },
                searchAndReplace: [
                   {
                        search: './domain',
                        replace: 'https://original.domain.com'
                    },
                    {
                        /* The array of string value, or regular expression, that will be replaced by the new value returened from replace function */
                        search: ['./css/app.css', './js/app.js'],
                        replace: (searchString, index) => {
                            /* The custom replace logic to replace the search value with */

                            /* Example: Logic to to replace css, js file names with full domain name as prefix and version as suffix to it.

                                    './css/app.css' => 'https://original.domain.com/css/app.css?id=91352d1f26a97b89f271'
                                    './js/app.js' => 'https://original.domain.com/js/app.js?id=a1f1ae0cfce9bc2d3ce6'

                            */
                            const content = fs.readFileSync(path.resolve('/real/path/of/file', searchString), 'utf8');
                            return 'https://original.domain.com' + searchString.substring(1) + '?id=' + md5(content).substr(0, 20);
                        }
                    },
                ]
            });
        ]
    };
```


Laravel Mix Users
=================
Paste below snippets into webpack.mix.js file.

```javascript
    const MinifyHtmlWebpackPlugin = require('minify-html-webpack-plugin');
    const mix = require('laravel-mix');

    mix.webpackConfig({
        plugins: [
            new MinifyHtmlWebpackPlugin({
                afterBuild: true,
                src: './storage/framework/views',
                dest: './storage/framework/views',
                ignoreFileNameRegex: /\.(gitignore|php)$/,
                ignoreFileContentsRegex: /(<\?xml version)|(mail::message)/,
                rules: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    minifyJS: true,
                }
            })
        ]
    });
```

Configuration
=============

You can pass configuration options to `MinifyHtmlWebpackPlugin`. Each configuration has following items:

- `afterBuild`: Optional. Add `afterBuild:true`, if you want to run complete minification process after webpack build, at the end.
- `dir`: Optional. Base dir to find the files, if not provided, use the root of webpack context.
- `src`: Required. source directory path.
- `dest`: Required. destination directory path. Paste minified HTML contents from `src` directory files into `dest` directory.
- `ignoreFileNameRegex`: Optional. Regex Expression to ingnore files in the src directory if it matches with the file name, if not provided, will minimize all files in src directory.`
- `ignoreFileContentsRegex`: Optional. Regex Expression to ingnore files in the src directory if it matches with the file contents, if not provided, will minimize all files in src directory.`
- `rules`: Required. See the [html-minifer docs](https://github.com/kangax/html-minifier) for all available options.
- `searchAndReplace`: Optional. Array of all search and replace rules. check above examples.

# License

This project is licensed under [MIT](https://github.com/ashutoshSce/minify-html-webpack-plugin/blob/master/LICENSE).