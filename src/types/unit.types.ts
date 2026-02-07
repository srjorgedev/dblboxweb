export type UnitsResponse = {
    readonly meta: Meta;
    readonly data: UnitData[];
}

export type UnitData = {
    readonly _id: string;
    readonly num: number;
    readonly transform: boolean;
    readonly lf: boolean;
    readonly zenkai: boolean;
    readonly tagswitch: boolean;
    readonly fusion: boolean;
    readonly states: number;
    readonly name: Name;
    readonly rarity: Chapter;
    readonly chapter: Chapter;
    readonly type: Chapter;
    readonly color: Color;
    readonly tags: Color;
}

export type Chapter = {
    readonly id: number;
    readonly name: string;
}

export type Color = {
    readonly count: number;
    readonly content: Chapter[];
}

export type Name = {
    readonly count: number;
    readonly content: string[];
}

export type Meta = {
    readonly total: number;
    readonly hasNextPage: boolean;
    readonly hasPrevPage: boolean;
}
