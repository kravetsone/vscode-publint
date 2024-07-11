// @ts-expect-error
import type { MessageType } from "publint";
import * as vscode from "vscode";

export function getRangeForKey(
	// @ts-expect-error
	jsonTree: ReturnType<typeof import("jsonpos").ParsedJson>,
	// @ts-expect-error
	jsonpos: typeof import("jsonpos"),
	document: vscode.TextDocument,
	path: string[],
) {
	if (!jsonTree)
		return new vscode.Range(document.positionAt(1), document.positionAt(2));

	const keyNode = jsonpos.getLocation(jsonTree, { path });

	if (!keyNode?.start || !keyNode?.start)
		return new vscode.Range(document.positionAt(1), document.positionAt(2));

	const startPos = document.positionAt(keyNode.start?.offset);
	const endPos = document.positionAt(keyNode.end?.offset || 0);

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
