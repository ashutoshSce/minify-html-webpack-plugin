## Webpack plugin: minify-html-webpack-plugin

This is a [webpack](http://webpack.github.io/) plugin that can minimize the HTML with [HTMLMinifier](https://www.npmjs.com/package/html-minifier) for all source directory files and copy into destinations directory during the Webpack build.

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
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    minifyJS: true,
                }
            });
        ]
    };
```

Laravel Mix Users
=================
Paste below snippets into mix.js file.

```javascript
    const MinifyHtmlWebpackPlugin = require('minify-html-webpack-plugin');
    const mix = require('laravel-mix');

    mix.webpackConfig({
        plugins: [
            new MinifyHtmlWebpackPlugin({
                src: './storage/framework/views',
                dest: './storage/framework/views',
                rules: {
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

- `dir`: Optional. Base dir to find the files, if not provided, use the root of webpack context.
- `src`: Required. Files in `src` to minify.
- `dest`: Optional. Copy minified HTML contents Files in `dest`, if not provided, paste into src directory.
- `rules`: Required. See the [html-minifer docs](https://github.com/kangax/html-minifier) for all available options.

# License

This project is licensed under [MIT](https://github.com/ashutoshSce/minify-html-webpack-plugin/blob/master/LICENSE).