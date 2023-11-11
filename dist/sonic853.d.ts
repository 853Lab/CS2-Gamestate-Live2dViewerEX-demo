import { LVEX } from "./lvex";
/** 自己的class */
export declare class Sonic853 {
    #private;
    lvex: LVEX;
    get Boobs(): boolean;
    set Boobs(val: boolean);
    get Glasses(): boolean;
    set Glasses(val: boolean);
    get Exp(): Sonic853Exp;
    set Exp(val: Sonic853Exp);
    get RedFace(): boolean;
    set RedFace(val: boolean);
    get Sweats(): boolean;
    set Sweats(val: boolean);
    get Lines(): boolean;
    set Lines(val: boolean);
    get Drop(): boolean;
    set Drop(val: boolean);
    get DarkEye(): boolean;
    set DarkEye(val: boolean);
    constructor(id?: number, lvex?: LVEX);
}
export type Sonic853Exp = "idle" | "eyes1" | "eyes2" | "eyes3" | "eyes4" | "eyes5" | "eyesX" | "eyesBaka" | "mouth1" | "mouth2" | "mouth3" | "mouth4" | "Baka" | "Scary" | "XXX" | "Ehehe";
