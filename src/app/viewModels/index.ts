export class Ribbon {
    colNo: number = 0;
    end: number = 0;
    content?: string;
    author?: string;
}

export class HeaderColumn {
    key?: string;
}

export class Column {
    uid: number = 0;
    key?: string;
    value?: any;
}

export class Row {
    uid: number = 0;
    columns?: Array<Column>;
    ribbons?: Array<Ribbon>;
  
}
