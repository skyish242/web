"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSitemap = exports.detectErrors = exports.prepareData = exports.removeHtml = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_1 = __importDefault(require("fs"));
const xmlbuilder2_1 = require("xmlbuilder2");
const package_json_1 = require("../../package.json");
const global_interface_1 = require("../interfaces/global.interface");
const vars_1 = require("../vars");
const vars_helper_1 = require("./vars.helper");
const getUrl = (url, domain, options) => {
    var _a;
    let slash = getSlash(domain);
    let trimmed = url
        .split(((_a = options === null || options === void 0 ? void 0 : options.outDir) !== null && _a !== void 0 ? _a : vars_1.OUT_DIR) + '/')
        .pop()
        .replace('index.html', '');
    trimmed = (0, exports.removeHtml)(trimmed);
    // Add all traling slashes
    if (options === null || options === void 0 ? void 0 : options.trailingSlashes) {
        trimmed = trimmed.length && !trimmed.endsWith('/') ? trimmed + '/' : trimmed;
    }
    else {
        trimmed = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
        slash = trimmed ? slash : '';
    }
    return `${domain}${slash}${trimmed}`;
};
const removeHtml = (fileName) => {
    if (fileName === null || fileName === void 0 ? void 0 : fileName.endsWith('.html')) {
        return fileName.slice(0, -5);
    }
    return fileName;
};
exports.removeHtml = removeHtml;
async function prepareData(domain, options) {
    var _a;
    console.log(vars_helper_1.cliColors.cyanAndBold, `> Using ${vars_1.APP_NAME}`);
    const FOLDER = (_a = options === null || options === void 0 ? void 0 : options.outDir) !== null && _a !== void 0 ? _a : vars_1.OUT_DIR;
    const ignore = prepareIgnored(options === null || options === void 0 ? void 0 : options.ignore, options === null || options === void 0 ? void 0 : options.outDir);
    const changeFreq = prepareChangeFreq(options);
    const pages = await (0, fast_glob_1.default)(`${FOLDER}/**/*.html`, { ignore });
    const results = pages.map((page) => {
        return {
            page: getUrl(page, domain, options),
            changeFreq: changeFreq,
            lastMod: (options === null || options === void 0 ? void 0 : options.resetTime) ? new Date().toISOString().split('T')[0] : ''
        };
    });
    (0, exports.detectErrors)({
        folder: !fs_1.default.existsSync(FOLDER),
        htmlFiles: !pages.length
    });
    return results;
}
exports.prepareData = prepareData;
const detectErrors = ({ folder, htmlFiles }) => {
    if (folder && htmlFiles) {
        console.error(vars_helper_1.cliColors.red, (0, vars_helper_1.errorMsgFolder)(vars_1.OUT_DIR));
    }
    else if (htmlFiles) {
        // If no page exists, then the static adapter is probably not used
        console.error(vars_helper_1.cliColors.red, (0, vars_helper_1.errorMsgHtmlFiles)(vars_1.OUT_DIR));
    }
};
exports.detectErrors = detectErrors;
const writeSitemap = (items, options, domain) => {
    var _a;
    const outDir = (_a = options === null || options === void 0 ? void 0 : options.outDir) !== null && _a !== void 0 ? _a : vars_1.OUT_DIR;
    if ((items === null || items === void 0 ? void 0 : items.length) <= vars_1.CHUNK.maxSize) {
        createFile(items, options, outDir);
    }
    else {
        // If the number of pages is greater than the chunk size, then we split the sitemap into multiple files
        // and create an index file that links to all of them
        // https://support.google.com/webmasters/answer/183668?hl=en
        const numberOfChunks = Math.ceil(items.length / vars_1.CHUNK.maxSize);
        console.log(vars_helper_1.cliColors.cyanAndBold, `> Oh, your site is huge! Writing sitemap in chunks of ${numberOfChunks} pages and its index sitemap.xml`);
        for (let i = 0; i < items.length; i += vars_1.CHUNK.maxSize) {
            const chunk = items.slice(i, i + vars_1.CHUNK.maxSize);
            createFile(chunk, options, outDir, i / vars_1.CHUNK.maxSize + 1);
        }
        createIndexFile(numberOfChunks, outDir, options, domain);
    }
};
exports.writeSitemap = writeSitemap;
const createFile = (items, options, outDir, chunkId) => {
    const sitemap = createXml('urlset');
    addAttribution(sitemap, options);
    for (const item of items) {
        const page = sitemap.ele('url');
        page.ele('loc').txt(item.page);
        if (item.changeFreq) {
            page.ele('changefreq').txt(item.changeFreq);
        }
        if (item.lastMod) {
            page.ele('lastmod').txt(item.lastMod);
        }
    }
    const xml = finishXml(sitemap);
    const fileName = chunkId ? `sitemap-${chunkId}.xml` : 'sitemap.xml';
    try {
        fs_1.default.writeFileSync(`${outDir}/${fileName}`, xml);
        console.log(vars_helper_1.cliColors.green, (0, vars_helper_1.successMsg)(outDir, fileName));
    }
    catch (e) {
        console.error(vars_helper_1.cliColors.red, (0, vars_helper_1.errorMsgWrite)(outDir, fileName), e);
    }
};
const createIndexFile = (numberOfChunks, outDir, options, domain) => {
    const FILENAME = 'sitemap.xml';
    const slash = getSlash(domain);
    const sitemap = createXml('sitemapindex');
    addAttribution(sitemap, options);
    for (let i = 1; i <= numberOfChunks; i++) {
        sitemap.ele('sitemap').ele('loc').txt(`${domain}${slash}sitemap-${i}.xml`);
    }
    const xml = finishXml(sitemap);
    try {
        fs_1.default.writeFileSync(`${outDir}/${FILENAME}`, xml);
        console.log(vars_helper_1.cliColors.green, (0, vars_helper_1.successMsg)(outDir, FILENAME));
    }
    catch (e) {
        console.error(vars_helper_1.cliColors.red, (0, vars_helper_1.errorMsgWrite)(outDir, FILENAME), e);
    }
};
const prepareIgnored = (ignored, outDir = vars_1.OUT_DIR) => {
    let ignore;
    if (ignored) {
        ignore = Array.isArray(ignored) ? ignored : [ignored];
        ignore = ignore.map((ignoredPage) => `${outDir}/${ignoredPage}`);
    }
    return ignore;
};
const prepareChangeFreq = (options) => {
    let result = null;
    if (options === null || options === void 0 ? void 0 : options.changeFreq) {
        if (global_interface_1.changeFreq.includes(options.changeFreq)) {
            result = options.changeFreq;
        }
        else {
            console.log(vars_helper_1.cliColors.red, `  × Option \`--change-freq ${options.changeFreq}\` is not a valid value. See docs: https://github.com/bartholomej/svelte-sitemap#options`);
        }
    }
    return result;
};
const getSlash = (domain) => (domain.split('/').pop() ? '/' : '');
const createXml = (elementName) => {
    return (0, xmlbuilder2_1.create)({ version: '1.0', encoding: 'UTF-8' }).ele(elementName, {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
    });
};
const finishXml = (sitemap) => {
    return sitemap.end({ prettyPrint: true });
};
const addAttribution = (sitemap, options) => {
    if ((options === null || options === void 0 ? void 0 : options.attribution) !== false) {
        sitemap.com(` This file was automatically generated by https://github.com/bartholomej/svelte-sitemap v${package_json_1.version} `);
    }
};
