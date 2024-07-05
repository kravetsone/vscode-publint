import esbuild, { type Plugin } from "esbuild";
import { purgePolyfills } from "unplugin-purge-polyfills";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

const esbuildProblemMatcherPlugin: Plugin = {
	name: "esbuild-problem-matcher",

	setup(build) {
		build.onStart(() => {
			console.log("[watch] build started");
		});
		build.onEnd((result) => {
			for (const { text, location } of result.errors) {
				console.error(`✘ [ERROR] ${text}`);
				if (location)
					console.error(
						`    ${location.file}:${location.line}:${location.column}:`,
					);
			}
			console.log("[watch] build finished");
		});
	},
};

const ctx = await esbuild.context({
	entryPoints: ["src/extension.ts"],
	bundle: true,
	format: "cjs",
	minify: production,
	sourcemap: !production,
	sourcesContent: false,
	platform: "node",
	target: "node18",
	outfile: "dist/extension.js",
	external: ["vscode"],
	logLevel: "silent",
	plugins: [
		/* add to the end of plugins array */
		esbuildProblemMatcherPlugin,
		purgePolyfills.esbuild({}),
	],
});
if (watch) {
	await ctx.watch();
} else {
	await ctx.rebuild();
	await ctx.dispose();
}
