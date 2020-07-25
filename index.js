'use strict';

const fs = require('fs');
const path = require('path')
const minifier = require('html-minifier').minify;

class MinifyHtmlWebpackPlugin {
    constructor(options = {}) {
        this.options = options
    }

    prepareRules(replaceRules) {
        let rules = [];
        replaceRules.forEach((rule) => {
            if (Array.isArray(rule.search)) {
                rules = rules.concat(rule.search.map((item, index) => ({
                    search: item,
                    replace: rule.replace,
                    index
                })));
            } else {
                rules.push({
                    search: rule.search,
                    replace: rule.replace,
                    index: null
                });
            }
        });

        return rules;
    }

    searchAndReplace(source) {
        return this.searchAndReplaceRules.reduce((source, rule) =>
                source.replace(
                    rule.search,
                    typeof rule.replace === 'string' ? rule.replace : rule.replace(rule.search, rule.index)
                ),
            source
        )
    }

    minifyFiles(srcDir, destDir) {
        fs.readdir(srcDir, (err, files) => {
            if (err) throw err;
            files.forEach(file => {
                if (!this.pattern || !this.pattern.test(file)) {
                    let inputFile = path.resolve(srcDir, file);
                    if (fs.statSync(inputFile).isDirectory()) {
                        const directory = path.resolve(destDir, file);
                        if(!fs.existsSync(directory)) {
                            fs.mkdirSync(directory);
                        }
                        this.minifyFiles(inputFile, directory);
                    } else {
                        let source = fs.readFileSync(inputFile, 'utf8');
                        if (!this.contentPattern || !this.contentPattern.test(source)) {
                            if (this.searchAndReplaceRules.length > 0) {
                                source = this.searchAndReplace(source);
                            }
                            let result = minifier(source, this.options.rules);
                            let outputFile = path.resolve(destDir, file);
                            fs.writeFileSync(outputFile, result);
                        }
                    }
                }
            });
        });
    }

    process() {
        if (this.options.verbose) {
            console.log('Starting to minimize HTML...')
        }

        const dir = this.options.dir || this.root;

        if (!this.options.src) {
            throw new Error('`src` is missing from the options.')
        }

        if (!this.options.dest) {
            console.warn('Warning... Original source code will be minified and overwritten, because `dest` is missing from the options.');
        }

        const dest = this.options.dest || this.options.src;
        this.pattern = this.options.ignoreFileNameRegex;
        this.contentPattern = this.options.ignoreFileContentsRegex;

        this.searchAndReplaceRules = [];
        if (this.options.searchAndReplace && Array.isArray(this.options.searchAndReplace) && this.options.searchAndReplace.length > 0) {
            this.searchAndReplaceRules = this.prepareRules(this.options.searchAndReplace);
        }

        const srcDir = path.resolve(dir, this.options.src);
        const destDir = path.resolve(dir, dest);

        this.minifyFiles(srcDir, destDir);
    }

    apply(compiler) {
        compiler.hooks.emit.tap('MinifyHtmlWebpackPlugin', compilation => {
            const afterBuild = this.options.afterBuild || false;
            this.root = compilation.options.context;
            if (!afterBuild) {
                this.process();
            }
        });

        compiler.hooks.done.tap('MinifyHtmlWebpackPluginAfterBuild', compilation => {
            const afterBuild = this.options.afterBuild || false;
            if (afterBuild) {
                this.process();
            }
        })
    }
}

module.exports = MinifyHtmlWebpackPlugin;
