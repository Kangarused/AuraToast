import { containerless, customElement, bindable } from "../../../../../node_modules/aurelia-framework";

@containerless()
@customElement('atoast-body')
export class AuraToastBody {

    @bindable() title!: string | null;
    @bindable() content: string = '';

    constructor() {

    }
}