export declare type PasswordGenerateType = {
    length: number;
    characters: Array<[]>;
};
export declare type PasswordManagerOptions = {
    password?: string;
    characters?: Array<[]>;
    maxTries: number;
    generate?: object;
};
export declare type PasswordManagerEvent = {
    code: number;
    reason: string;
    password: string;
};
