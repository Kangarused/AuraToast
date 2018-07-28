import { AuraToastSettings } from "./classes/aura-toast-settings";
import { AuraToastPositions } from "./enums/aura-toast-positions";
import { AuraToastSubscription } from "./classes/aura-toast-subscription";
import { AuraToastRequest } from "./classes/aura-toast-request";
import { AuraToastTypes } from "./enums/aura-toast-types";

export class AuraToastService {
    
    public settings = <AuraToastSettings>{
        duration: 3000,
        extendedDuration: 1000,
        position: AuraToastPositions.topright,
        maxWidth: '400px'
    };
    private subscriptions: AuraToastSubscription[]; 
    
    constructor() {
        this.subscriptions = [];
    }

    public success(request: AuraToastRequest): void {
        this.postMessage(AuraToastTypes.success, request);
    }

    public info(request: AuraToastRequest): void {
        this.postMessage(AuraToastTypes.info, request);
    }

    public warning(request: AuraToastRequest): void {
        this.postMessage(AuraToastTypes.warning, request);
    }

    public error(request: AuraToastRequest): void {
        this.postMessage(AuraToastTypes.error, request);
    }

    private postMessage(type: AuraToastTypes, request: AuraToastRequest): void {
        if (request.key != null) {
            let sub = this.findByKey(request.key);
            if (sub != null) {
                sub.callback(type, request);
            }
        } else {
            this.subscriptions.forEach((sub) => {
                sub.callback(type, request);
            });
        }
    }
    
    private findByKey(key: string): AuraToastSubscription | null {
        let subKeys = this.subscriptions.map(m => m.key);
        let index = subKeys.indexOf(key);
        if (index > -1) {
            return this.subscriptions[index];
        }
        return null;
    }

    // Configuration Methods
    public configure(settings: AuraToastSettings) {
        this.settings = settings;
    }

    // Subscriptions Methods
    public subscribe(sub: AuraToastSubscription): number {
        let nextId = this.subscriptions.length + 1;
        sub.id = nextId;
        this.subscriptions.push(sub);
        return nextId;
    }

    public unsubscribe(id: number): void {
        let subIds = this.subscriptions.map(m => m.id);
        let index = subIds.indexOf(id);
        if (index > -1) {
            this.subscriptions.splice(index, 1);
        }
    }
}