import { cep_node, cep, __adobe_cep__ } from "./cep/lib/cep-types";

declare global {
	interface Window {
		cep_node: cep_node;
		cep: cep;
		__adobe_cep__: __adobe_cep__;
	}
}
