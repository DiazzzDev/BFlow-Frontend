export interface DocsSectionContent {
    id: string;
    title: string;
    body: string[];
    items?: string[];
    note?: string;
}

export interface DocsTocItem {
    id: string;
    title: string;
}
