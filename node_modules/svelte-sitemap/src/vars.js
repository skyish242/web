"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHUNK = exports.OUT_DIR = exports.OPTIONS = exports.DOMAIN = exports.APP_NAME = void 0;
exports.APP_NAME = 'svelte-sitemap';
exports.DOMAIN = 'https://example.com';
exports.OPTIONS = { resetTime: false, debug: false, changeFreq: 'weekly' };
exports.OUT_DIR = 'build';
// Google recommends to split sitemap into multiple files if there are more than 50k pages
// https://support.google.com/webmasters/answer/183668?hl=en
exports.CHUNK = {
    maxSize: 50000
};
