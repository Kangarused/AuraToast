import { AuraToastTypes } from "../enums/aura-toast-types";

export class AuraToastMessage {
    constructor(type: AuraToastTypes, content: string, title: string | null = null) {
        this.type = type;
        this.content = content;
        this.title = title;
    }

    id!: number;
    timeoutId!: number;
    type!: AuraToastTypes;
    title!: string | null;
    content!: string;
}