import assert from "node:assert";

import fs from "node:fs";
import path from "node:path";
import vscode from "vscode";

// !Why before is undefined...

suite("Extension Test Suite", () => {
	vscode.window.showInformationMessage("Start all tests.");

	// before(async () => {
	// 	const projectPath = path.join(process.cwd(), "project");
	// 	console.log(projectPath);
	// 	fs.mkdirSync(projectPath);
	// 	fs.writeFileSync(
	// 		path.join(projectPath, "package.json"),
	// 		JSON.stringify({
	// 			name: "test-package",
	// 		}),
	// 	);

	// 	const workspace = vscode.workspace.getWorkspaceFolder(
	// 		vscode.Uri.file(projectPath),
	// 	);

	// 	await activate();
	// });

	test("Get diagnostic errors for package.json", async () => {
		// TODO: fix undefined before in mocha ??? and erase it
		const projectPath = path.join(process.cwd(), "test-project");
		console.log(projectPath);
		if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath);
		fs.writeFileSync(
			path.join(projectPath, "package.json"),
			JSON.stringify({
				name: "test-package",
			}),
		);

		vscode.workspace.getWorkspaceFolder(vscode.Uri.file(projectPath));
		//	end-before-script

		const file = await vscode.workspace.openTextDocument(
			vscode.Uri.file(path.resolve(projectPath, "package.json")),
		);

		// TODO: find a better way
		setTimeout(() => {
			const diagnostic = vscode.languages.getDiagnostics(file.uri);

			console.log("result", file, diagnostic);

			assert.notStrictEqual(0, diagnostic.length);
		}, 1000);
	});
});
