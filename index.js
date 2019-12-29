'use strict';

const fs = require('fs');
const minifier = require('html-minifier').minify;
const path = require('path');

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
            const pattern = this.options.ignoreFileNameRegex || /''/;
            const contentPattern = this.options.ignoreFileContentsRegex || /''/;

            const srcDir = path.resolve(dir, this.options.src);
            const destDir = path.resolve(dir, dest);

            fs.readdir(srcDir, (err, files) => {
                files.forEach(file => {
                    if (!pattern.test(file)) {
                        let inputFile = path.resolve(srcDir, file);

                        const isFile = fs.statSync(inputFile).isFile();
                        if (!isFile) {
                            return;
                        }

                        let source = fs.readFileSync(inputFile, 'utf8');
                        if (!contentPattern.test(source)) {
                            let result = minifier(source, this.options.rules);
                            let outputFile = path.resolve(destDir, file);
                            fs.writeFileSync(outputFile, result);
                        }
                    }
                });
            });
        })
    }
}

module.exports = MinifyHtmlWebpackPlugin;
