export class Ribbon {
    colStart?: Column;
    colEnd?: Column;
    content?: string;
    author?: string;
}

export class Column {
    uid?: number = 0;
    key?: string;
    value?: any;
    width?: number;
    start?: Date;
    stop?: Date;
}

export class HeaderColumn extends Column{
}

export class Row {
    uid: number = 0;
    columns?: Array<Column>;
    ribbons?: Array<Ribbon>;
    start?: Date;
    stop?: Date;
    content?: string;
    author?: string;
}
