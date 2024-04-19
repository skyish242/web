import { Options, PagesJson } from '../interfaces/global.interface';
export declare const removeHtml: (fileName: string) => string;
export declare function prepareData(domain: string, options?: Options): Promise<PagesJson[]>;
export declare const detectErrors: ({ folder, htmlFiles }: {
    folder: boolean;
    htmlFiles: boolean;
}) => void;
export declare const writeSitemap: (items: PagesJson[], options: Options, domain: string) => void;
