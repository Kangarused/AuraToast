import { autoinject, bindable, containerless, customElement } from "aurelia-framework";
import { AuraToastService } from "./aura-toast-service";
import { AuraToastSubscription } from "./classes/aura-toast-subscription";
import { AuraToastTypes } from "./enums/aura-toast-types";
import { AuraToastRequest } from "./classes/aura-toast-request";
import { AuraToastMessage } from "./classes/aura-toast-message";
import { computedFrom } from "../../../../node_modules/aurelia-binding";
import { AuraToastPositions } from "./enums/aura-toast-positions";

@autoinject()
@containerless()
@customElement("auratoast")
export class AuraToastCustomElement {
    @bindable() key: string | null = null;

    public toasts: AuraToastMessage[] = [];
    private visible: boolean = true;
    private id: number = 0;
    private messageIdTracker: number = 1;

    constructor(
        private readonly toastService: AuraToastService
    ) {

    }

    bind() {
        this.id = this.toastService.subscribe(new AuraToastSubscription(this.addMessage, this.key))
    }

    detached() {
        this.toastService.unsubscribe(this.id);
    }

    addMessage = (type: AuraToastTypes, request: AuraToastRequest): void => {
        let message = new AuraToastMessage(type, request.content, request.title);
        message.id = this.generateId();
        
        message.timeoutId = setTimeout(() => {
            this.removeMessage(message.id);
        }, this.toastService.settings.duration);
        
        this.toasts.push(message);
        this.show();
    }

    removeMessage(id: number) {
        let toastIds = this.toasts.map(m => m.id);
        let index = toastIds.indexOf(id);
        if (index > -1) {
            this.toasts.splice(index, 1);
        }

        if (this.toasts.length <= 0) {
            this.hide();
        }
    }

    mouseOverMessage(toast: AuraToastMessage) {
        clearTimeout(toast.timeoutId);
    }

    mouseOutMessage(toast: AuraToastMessage) {
        toast.timeoutId = setTimeout(() => {
            this.removeMessage(toast.id);
        }, this.toastService.settings.duration);
    }

    private show(): void {
        this.visible = true;
    }

    private hide(): void {
        this.visible = false;
    }

    private generateId(): number {
        this.messageIdTracker++;
        return this.messageIdTracker;
    }

    private getToastClasses(toast: AuraToastMessage): string {
        let classes = 'auratoast-body auratoast-' + AuraToastTypes[toast.type];
        return classes;
    }

    @computedFrom("toastService.settings")
    get containerClass(): string {
        let classes = this.key != null ? 'auratoast-container-block' : 'auratoast-container-fixed';
        switch(this.toastService.settings.position) {
            case AuraToastPositions.top:
                classes += ' auratoast-top';
                break;
            case AuraToastPositions.topleft:
                classes += ' auratoast-topleft';
                break;
            case AuraToastPositions.topright:
                classes += ' auratoast-topright';
                break;
            case AuraToastPositions.bottom:
                classes += ' auratoast-bottom';
                break;
            case AuraToastPositions.bottomleft:
                classes += ' auratoast-bottomleft';
                break;
            case AuraToastPositions.bottomright:
                classes += ' auratoast-bottomright';
                break;
        }
        return classes;
    }

    @computedFrom("toastService.settings.maxWidth")
    get containerWidthStyle() {
        let position = this.toastService.settings.position;
        if (position == AuraToastPositions.top || position == AuraToastPositions.bottom || this.key != null) {
            return 'max-width: 100%';
        }
        return 'max-width: ' + this.toastService.settings.maxWidth;
    }
}