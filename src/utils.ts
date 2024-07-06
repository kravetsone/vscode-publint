// @ts-expect-error
import type { MessageType } from "publint";
import * as vscode from "vscode";

export function getRangeForKey(
	jsonTree: ReturnType<typeof import("jsonc-parser").parseTree>,
	jsonc: typeof import("jsonc-parser/lib/esm/main"),
	document: vscode.TextDocument,
	path: string[],
) {
	if (!jsonTree)
		return new vscode.Range(document.positionAt(1), document.positionAt(2));

	const keyNode = jsonc.findNodeAtLocation(jsonTree, path);

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

export function isJSONParsable(str: string) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}

	return true;
}
