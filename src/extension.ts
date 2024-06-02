// @ts-expect-error
import type { MessageType } from "publint";
import * as vscode from "vscode";
import { ANSI_COLORS_REGEXP } from "./utils";

export const publintToVSCodeMap: Record<
	MessageType,
	vscode.DiagnosticSeverity
> = {
	warning: vscode.DiagnosticSeverity.Warning,
	error: vscode.DiagnosticSeverity.Error,
	suggestion: vscode.DiagnosticSeverity.Hint,
};

export async function activate(context: vscode.ExtensionContext) {
	const { publint } = await import("publint");
	const { formatMessage } = await import("publint/utils");
	console.log("SOME");
	const diagnosticCollection =
		vscode.languages.createDiagnosticCollection("lints");

	async function updateDiagnostic(document: vscode.TextDocument) {
		try {
			if (!document.uri.fsPath.includes("package.json")) return;

			const diagnostics: vscode.Diagnostic[] = [];

			const { messages } = await publint({
				pkgDir: document.uri.fsPath.replace("package.json", ""),
			});
			const text = document.getText();
			const packageJSON = JSON.parse(text);
			console.log(messages);

			for (const message of messages) {
				const startPos = document.positionAt(1);
				const endPos = document.positionAt(2);
				const range = new vscode.Range(startPos, endPos);
				console.log(JSON.stringify(formatMessage(message, packageJSON)));
				const diagnostic = new vscode.Diagnostic(
					range,
					formatMessage(message, packageJSON)?.replaceAll(
						ANSI_COLORS_REGEXP,
						"",
					) || message.code,
					publintToVSCodeMap[message.type],
				);

				diagnostics.push(diagnostic);
			}

			// const text = document.getText();

			// const diagnostics: vscode.Diagnostic[] = [];

			// const regex = /console\.log/g;
			// let match;
			// while ((match = regex.exec(text))) {
			// 	const startPos = document.positionAt(match.index);
			// 	const endPos = document.positionAt(match.index + match[0].length);
			// 	const range = new vscode.Range(startPos, endPos);
			// 	const diagnostic = new vscode.Diagnostic(
			// 		range,
			// 		"АААА ПАСХАЛКО",
			// 		vscode.DiagnosticSeverity.Warning,
			// 	);
			// 	diagnostics.push(diagnostic);
			// }

			diagnosticCollection.set(document.uri, diagnostics);
		} catch (error) {
			console.error(error);
		}
	}

	vscode.workspace.onDidOpenTextDocument((document) => {
		updateDiagnostic(document);
	});
	vscode.workspace.onDidChangeTextDocument((event) => {
		updateDiagnostic(event.document);
	});
}

export function deactivate() {}
