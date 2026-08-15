import JSON5 from "json5";
export function json2string<T = any>(obj: T, minify = false): string {
	try {
		return minify ? JSON.stringify(obj) : JSON.stringify(obj, null, "\t");
	} catch (e) {
		return "";
	}
}

export function string2Json(str?: null | ""): object;
export function string2Json<T = unknown>(str: string): T;
export function string2Json<T = unknown>(str?: string | null): T | object;
export function string2Json<T = unknown>(str?: string | null): T | object {
	try {
		if (typeof str === "undefined" || !str) {
			return {};
		}
		return JSON5.parse<T>(str);
	} catch (e) {
		return {};
	}
}
