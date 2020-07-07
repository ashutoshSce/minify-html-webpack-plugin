'use strict';

const fs = require('fs');
const path = require('path')
const minifier = require('html-minifier').minify;

class MinifyHtmlWebpackPlugin {
    constructor(options = {}) {
        this.options = options
    }

    minfifyFiles(srcDir, destDir) {
        fs.readdir(srcDir, (err, files) => {
            if (err) throw err;
            files.forEach(file => {
                if (!this.pattern || !this.pattern.test(file)) {
                    let inputFile = path.resolve(srcDir, file);
                    if (fs.statSync(inputFile).isDirectory()) {
                        this.minfifyFiles(inputFile, path.resolve(destDir, file));
                    } else {
                        let source = fs.readFileSync(inputFile, 'utf8');
                        if (!this.contentPattern || !this.contentPattern.test(source)) {
                            let result = minifier(source, this.options.rules);
                            let outputFile = path.resolve(destDir, file);
                            fs.writeFileSync(outputFile, result);
                        }
                    }
                }
            });
        });
    }

    apply(compiler) {
        compiler.hooks.emit.tap('MinifyHtmlWebpackPlugin', compilation => {
            if (this.options.verbose) {
                console.log('Starting to minimize HTML...')
            }

            const root = compilation.options.context;
            const dir = this.options.dir || root;

            if (!this.options.src) {
                throw new Error('`src` is missing from the options.')
            }

            if (!this.options.dest) {
                console.warn('Warning... Original source code will be minified and overwritten, because `dest` is missing from the options.');
            }
            
            const dest = this.options.dest || this.options.src;
            this.pattern = this.options.ignoreFileNameRegex;
            this.contentPattern = this.options.ignoreFileContentsRegex;

            const srcDir = path.resolve(dir, this.options.src);
            const destDir = path.resolve(dir, dest);

            this.minfifyFiles(srcDir, destDir);
        })
    }
}

module.exports = MinifyHtmlWebpackPlugin;
