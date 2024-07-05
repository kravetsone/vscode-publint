import path from "node:path";
import * as vscode from "vscode";
import {
	ANSI_COLORS_REGEXP,
	getRangeForKey,
	publintToVSCodeMap,
} from "./utils";

export async function activate() {
	const { publint } = await import("publint");
	const { formatMessage } = await import("publint/utils");
	const jsonc = await import("jsonc-parser/lib/esm/main.js");

	const diagnosticCollection =
		vscode.languages.createDiagnosticCollection("lints");

	async function updateDiagnostic(document: vscode.TextDocument) {
		try {
			if (
				!path.basename(document.uri.fsPath).includes("package.json") ||
				document.languageId !== "json"
			)
				return;

			const diagnostics: vscode.Diagnostic[] = [];

			const { messages } = await publint({
				pkgDir: path.dirname(document.uri.fsPath),
			});
			const text = document.getText();
			const packageJSON = JSON.parse(text);

			if (packageJSON.private) return;

			for (const message of messages) {
				const range = getRangeForKey(jsonc, document, message.path);
				const diagnostic = new vscode.Diagnostic(
					range,
					`${
						formatMessage(message, packageJSON)?.replaceAll(
							ANSI_COLORS_REGEXP,
							"",
						) || message.code
					}`,
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
