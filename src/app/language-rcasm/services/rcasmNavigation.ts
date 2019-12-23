'use strict';

import {
	Color, ColorInformation, ColorPresentation, Range, TextEdit, TextDocument
} from '../rcasmLanguageTypes';
import * as nodes from '../parser/rcasmNodes';
import { getColorValue, hslFromColor } from '../languageFacts/facts';

export class RcasmNavigation {

    public findDocumentColors(document: TextDocument, assembly: nodes.Assembly): ColorInformation[] {
		const result: ColorInformation[] = [];
		assembly.accept((node) => {
			const colorInfo = getColorInformation(node, document);
			if (colorInfo) {
				result.push(colorInfo);
			}
			return true;
		});
		return result;
	}

	public getColorPresentations(document: TextDocument, assembly: nodes.Assembly, color: Color, range: Range): ColorPresentation[] {
		const result: ColorPresentation[] = [];
		const red256 = Math.round(color.red * 255), green256 = Math.round(color.green * 255), blue256 = Math.round(color.blue * 255);

		let label;
		if (color.alpha === 1) {
			label = `rgb(${red256}, ${green256}, ${blue256})`;
		} else {
			label = `rgba(${red256}, ${green256}, ${blue256}, ${color.alpha})`;
		}
		result.push({ label: label, textEdit: TextEdit.replace(range, label) });

		if (color.alpha === 1) {
			label = `#${toTwoDigitHex(red256)}${toTwoDigitHex(green256)}${toTwoDigitHex(blue256)}`;
		} else {
			label = `#${toTwoDigitHex(red256)}${toTwoDigitHex(green256)}${toTwoDigitHex(blue256)}${toTwoDigitHex(Math.round(color.alpha * 255))}`;
		}
		result.push({ label: label, textEdit: TextEdit.replace(range, label) });

		const hsl = hslFromColor(color);
		if (hsl.a === 1) {
			label = `hsl(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
		} else {
			label = `hsla(${hsl.h}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%, ${hsl.a})`;
		}
		result.push({ label: label, textEdit: TextEdit.replace(range, label) });

		return result;
    }
    
}

function getColorInformation(node: nodes.Node, document: TextDocument): ColorInformation | null {
	const color = getColorValue(node);
	if (color) {
		const range = getRange(node, document);
		return { color, range };
	}
	return null;
}

function getRange(node: nodes.Node, document: TextDocument): Range {
	return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
}

function toTwoDigitHex(n: number): string {
	const r = n.toString(16);
	return r.length !== 2 ? '0' + r : r;
}