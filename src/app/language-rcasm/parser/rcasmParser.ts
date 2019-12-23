'use strict';

import * as nodes from './rcasmNodes';
import { TextDocument } from '../rcasmLanguageTypes';

export class RcasmParser {

    public parseAssembly(textDocument: TextDocument): nodes.Assembly {
		return new nodes.Assembly(0,0);
	}        

}