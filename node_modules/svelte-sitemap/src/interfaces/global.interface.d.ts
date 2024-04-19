export interface Arguments {
    domain: string;
    options?: Options;
}
export interface Options {
    debug?: boolean;
    changeFreq?: ChangeFreq;
    resetTime?: boolean;
    outDir?: string;
    attribution?: boolean;
    ignore?: string | string[];
    trailingSlashes?: boolean;
}
export interface PagesJson {
    page: string;
    changeFreq?: ChangeFreq;
    lastMod?: string;
}
export declare const changeFreq: readonly ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
/**
 * Specs: https://www.sitemaps.org/protocol.html
 */
export type ChangeFreq = typeof changeFreq[number];
