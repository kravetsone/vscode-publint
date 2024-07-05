// @ts-expect-error
import type { MessageType } from "publint";
import * as vscode from "vscode";

export function getRangeForKey(
	jsonc: typeof import("jsonc-parser/lib/esm/main"),
	document: vscode.TextDocument,
	path: string[],
) {
	const text = document.getText();
	const node = jsonc.parseTree(text);

	if (!node)
		return new vscode.Range(document.positionAt(1), document.positionAt(2));

	const keyNode = jsonc.findNodeAtLocation(node, path);

	if (!keyNode)
		return new vscode.Range(document.positionAt(1), document.positionAt(2));

	const startPos = document.positionAt(keyNode.offset);
	const endPos = document.positionAt(keyNode.offset + keyNode.length);
	return new vscode.Range(startPos, endPos);
}

export const publintToVSCodeMap: Record<
	MessageType,
	vscode.DiagnosticSeverity
> = {
	warning: vscode.DiagnosticSeverity.Warning,
	error: vscode.DiagnosticSeverity.Error,
	suggestion: vscode.DiagnosticSeverity.Information,
};
