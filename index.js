'use strict'

const fs = require('fs');
const minifier = require('html-minifier').minify;

class MinifyHtmlWebpackPlugin {
  constructor(options = {}) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.emit.tap('MinifyHtmlWebpackPlugin', compilation => {
      if (this.options.verbose) {
        console.log('Starting to optimize HTML...')
      }

      const root = compilation.options.context;
      const dir = this.options.dir || root;
      const dest = this.options.dest || this.options.src;

      const srcDir = path.resolve(dir, this.options.src);
      const destDir = path.resolve(dir, dest);

      fs.readdir(srcDir, (err, files) => {
        files.forEach(file => {
          let inputFile = path.resolve(srcDir, file);
          let source = fs.readFileSync(inputFile, 'utf8');
          let result = minifier(source, this.options.rules);
          let outputFile = path.resolve(destDir, file);
          fs.writeFileSync(outputFile, result);
        });
      });
    })
  }
}

module.exports = MinifyHtmlWebpackPlugin;