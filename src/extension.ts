import path from "node:path";
import * as vscode from "vscode";
import { getRangeForKey, isJSONParsable, publintToVSCodeMap } from "./utils";

export async function activate() {
	const { publint } = await import("publint");
	const { formatMessage } = await import("publint/utils");
	const jsonc = await import("jsonc-parser/lib/esm/main.js");

	const diagnosticCollection =
		vscode.languages.createDiagnosticCollection("lints");

	async function updateDiagnostic(document: vscode.TextDocument) {
		if (
			!path.basename(document.uri.fsPath).includes("package.json") ||
			document.languageId !== "json"
		)
			return;

		const text = document.getText();
		if (!isJSONParsable(text)) return;

		const config = vscode.workspace.getConfiguration("vscode-publint");
		const ignoredRules = config.get<string[]>("ignored-rules");

		const diagnostics: vscode.Diagnostic[] = [];

		const packageJSON = JSON.parse(text);

		// private property can be boolean or boolean-string https://json.schemastore.org/package.json
		if (
			(packageJSON.private === true || packageJSON.private === "true") &&
			config.get<boolean>("ignore-private-packages")
		)
			return diagnosticCollection.set(document.uri, []);

		try {
			const { messages } = await publint({
				pkgDir: path.dirname(document.uri.fsPath),
			});

			const jsonTree = jsonc.parseTree(text);

			for (const message of messages) {
				if (ignoredRules?.includes(message.code)) continue;

				const range = getRangeForKey(jsonTree, jsonc, document, message.path);
				const diagnostic = new vscode.Diagnostic(
					range,
					formatMessage(message, packageJSON) || message.code,
					publintToVSCodeMap[message.type],
				);

				diagnostic.code = {
					value: message.code,
					target: vscode.Uri.parse(
						`https://publint.dev/rules#${message.code.toLowerCase()}`,
					),
				};

				diagnostics.push(diagnostic);
			}

			diagnosticCollection.set(document.uri, diagnostics);
		} catch (error) {
			console.error(error);
		}
	}

	for (const editor of vscode.window.visibleTextEditors) {
		updateDiagnostic(editor.document);
	}

	vscode.workspace.onDidOpenTextDocument((document) => {
		updateDiagnostic(document);
	});
	vscode.workspace.onDidChangeTextDocument((event) => {
		updateDiagnostic(event.document);
	});
}

export function deactivate() {}
