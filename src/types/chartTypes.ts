export interface IMargin {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export interface ITSVImported {
	day: number;
	hour: number;
	value: number;
}

export interface IDSVRowAny {
    [key: string]: any;
}

export interface IDSVParsedArray<T> extends Array<T> {
    columns: string[];
}