import { containerless, customElement } from "aurelia-framework";
import { Disposable, BindingEngine } from "aurelia-binding";
import { AuraToastBody } from "./aura-toast-body";

@containerless()
@customElement("atoast-title")
export class AuraToastTitle {
    public title: string = '';
    private titleListener!: Disposable;
    constructor(
        private auraToastBody: AuraToastBody,
        private bindingEngine: BindingEngine
    ) {

    }

    attached() {
        this.setTitle(this.auraToastBody.title);
        this.titleListener = this.bindingEngine.propertyObserver(this.auraToastBody, 'title').subscribe((newValue, oldValue) => {
            this.setTitle(newValue);
        });
    }

    detached() {
        this.titleListener.dispose();
    }

    private setTitle(title: string | null) {
        if (title != null) {
            this.title = title;
        } else {
            this.title = '';
        }
    }
}