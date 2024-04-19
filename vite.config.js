import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	base: "skyish242.github.io/_app/immutable/",
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$routes: path.resolve('./src/routes')
		}
	}
};

export default config;
