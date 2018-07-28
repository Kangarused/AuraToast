import { containerless, customElement } from "aurelia-framework";
import { Disposable, BindingEngine } from "aurelia-binding";
import { AuraToastBody } from "./aura-toast-body";

@containerless()
@customElement("atoast-content")
export class AuraToastContent {
    public content: string = '';
    private contentListener!: Disposable;
    constructor(
        private auraToastBody: AuraToastBody,
        private bindingEngine: BindingEngine
    ) {

    }

    attached() {
        this.content = this.auraToastBody.content;
        this.contentListener = this.bindingEngine.propertyObserver(this.auraToastBody, 'content').subscribe((newValue, oldValue) => {
            this.content = newValue;
        });
    }

    detached() {
        this.contentListener.dispose();
    }
}