import { AuraToastTypes } from "../enums/aura-toast-types";
import { AuraToastRequest } from "./aura-toast-request";

export class AuraToastSubscription {
    constructor(callback: (type: AuraToastTypes, request: AuraToastRequest) => void, key: string | null = null) {
        this.callback = callback;
        this.key = key;
    }

    id!: number;
    key!: string | null;
    callback!: (type: AuraToastTypes, request: AuraToastRequest) => void;
}