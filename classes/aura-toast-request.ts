export class AuraToastRequest {
    constructor(content: string, title: string | null = null, key: string | null = null) {
        this.content = content;
        this.title = title;
        this.key = key;
    }

    content!: string;
    title!: string | null;
    key!: string | null;
}