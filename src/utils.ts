// inspired by https://github.com/chalk/ansi-regex/blob/main/index.js#L1
export const ANSI_COLORS_REGEXP =
	// biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
	/[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g;
