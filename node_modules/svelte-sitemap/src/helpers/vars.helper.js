"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMsgHtmlFiles = exports.errorMsgFolder = exports.errorMsgWrite = exports.successMsg = exports.cliColors = void 0;
exports.cliColors = {
    cyanAndBold: '\x1b[36m\x1b[1m%s\x1b[22m\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    red: '\x1b[31m%s\x1b[0m'
};
const successMsg = (outDir, filename) => `  ✔ done. Check your new sitemap here: ./${outDir}/${filename}`;
exports.successMsg = successMsg;
const errorMsgWrite = (outDir, filename) => `  × File '${outDir}/${filename}' could not be created.`;
exports.errorMsgWrite = errorMsgWrite;
const errorMsgFolder = (outDir) => `  × Folder '${outDir}/' doesn't exist.\n    Make sure you are using this library as 'postbuild' so '${outDir}/' folder was successfully created before running this script. Or are you using Vercel? See https://github.com/bartholomej/svelte-sitemap#error-missing-folder`;
exports.errorMsgFolder = errorMsgFolder;
const errorMsgHtmlFiles = (outDir) => `  × There is no static html file in your '${outDir}/' folder. Are you sure you are using Svelte adapter-static with prerender option? See https://github.com/bartholomej/svelte-sitemap#error-missing-html-files`;
exports.errorMsgHtmlFiles = errorMsgHtmlFiles;
