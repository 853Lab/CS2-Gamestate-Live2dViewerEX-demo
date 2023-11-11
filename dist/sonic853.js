"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sonic853 = void 0;
const lvex_1 = require("./lvex");
const method_1 = require("./method");
/** 自己的class */
class Sonic853 {
    lvex;
    #boobs = false;
    #boobs_list = new method_1.RList();
    get Boobs() {
        return this.#boobs;
    }
    set Boobs(val) {
        if (this.#boobs !== val) {
            this.#boobs = val;
            this.#boobs_list.Push().then(e => {
                this.lvex.SetMotion(this.#boobs ? "motions/ShowBoobs1.motion3.json" : "motions/ShowBoobs0.motion3.json");
            });
        }
    }
    #glasses = true;
    #glasses_list = new method_1.RList();
    get Glasses() {
        return this.#glasses;
    }
    set Glasses(val) {
        if (this.#glasses !== val) {
            this.#glasses = val;
            this.#glasses_list.Push().then(e => {
                this.lvex.SetMotion(this.#glasses ? "motions/ShowGlasses1.motion3.json" : "motions/ShowGlasses0.motion3.json");
            });
        }
    }
    #expressions = "idle";
    get Exp() {
        return this.#expressions;
    }
    set Exp(val) {
        if (this.#expressions !== val) {
            this.#expressions = val;
            let exp = 0;
            switch (this.#expressions) {
                case "idle":
                    exp = 0;
                    break;
                case "eyes1":
                    exp = 1;
                    break;
                case "eyes2":
                    exp = 2;
                    break;
                case "eyes3":
                    exp = 3;
                    break;
                case "eyes4":
                    exp = 4;
                    break;
                case "eyes5":
                    exp = 5;
                    break;
                case "eyesX":
                    exp = 6;
                    break;
                case "eyesBaka":
                    exp = 7;
                    break;
                case "mouth1":
                    exp = 8;
                    break;
                case "mouth2":
                    exp = 9;
                    break;
                case "mouth3":
                    exp = 10;
                    break;
                case "mouth4":
                    exp = 11;
                    break;
                case "Baka":
                    exp = 12;
                    break;
                case "Scary":
                    exp = 13;
                    break;
                case "XXX":
                    exp = 14;
                    break;
                case "Ehehe":
                    exp = 15;
                    break;
                default:
                    break;
            }
            this.lvex.SetExpId(exp);
        }
    }
    #red_face = false;
    #red_face_list = new method_1.RList();
    get RedFace() {
        return this.#red_face;
    }
    set RedFace(val) {
        if (this.#red_face !== val) {
            this.#red_face = val;
            this.#red_face_list.Push().then(e => {
                this.lvex.SetMotion(this.#red_face ? "motions/ShowRedFace1.motion3.json" : "motions/ShowRedFace0.motion3.json");
            });
        }
    }
    #sweats = false;
    #sweats_list = new method_1.RList();
    get Sweats() {
        return this.#sweats;
    }
    set Sweats(val) {
        if (this.#sweats !== val) {
            this.#sweats = val;
            this.#sweats_list.Push().then(e => {
                this.lvex.SetMotion(this.#sweats ? "motions/ShowSweats1.motion3.json" : "motions/ShowSweats0.motion3.json");
            });
        }
    }
    #lines = false;
    #lines_list = new method_1.RList();
    get Lines() {
        return this.#lines;
    }
    set Lines(val) {
        if (this.#lines !== val) {
            this.#lines = val;
            this.#lines_list.Push().then(e => {
                this.lvex.SetMotion(this.#lines ? "motions/ShowLines1.motion3.json" : "motions/ShowLines0.motion3.json");
            });
        }
    }
    #drop = false;
    #drop_list = new method_1.RList();
    get Drop() {
        return this.#drop;
    }
    set Drop(val) {
        if (this.#drop !== val) {
            this.#drop = val;
            this.#drop_list.Push().then(e => {
                this.lvex.SetMotion(this.#drop ? "motions/ShowDrop1.motion3.json" : "motions/ShowDrop0.motion3.json");
            });
        }
    }
    #dark_eye = false;
    #dark_eye_list = new method_1.RList();
    get DarkEye() {
        return this.#dark_eye;
    }
    set DarkEye(val) {
        if (this.#dark_eye !== val) {
            this.#dark_eye = val;
            this.#dark_eye_list.Push().then(e => {
                this.lvex.SetMotion(this.#dark_eye ? "motions/ShowDarkEye1.motion3.json" : "motions/ShowDarkEye0.motion3.json");
            });
        }
    }
    constructor(id, lvex) {
        this.lvex = lvex ?? new lvex_1.LVEX();
        if (typeof id === "number")
            this.lvex.modelId = id;
        this.lvex.Start();
        this.#boobs_list.time = this.#dark_eye_list.time = this.#drop_list.time = this.#glasses_list.time = this.#lines_list.time = this.#red_face_list.time = this.#sweats_list.time = 330;
    }
}
exports.Sonic853 = Sonic853;
// nomal: idle
// 优先级：1
// 被烧、混烟、被闪
// 优先级：2
// death: eyes1
// hp20: eyes3
// hp50: eyes2
// 优先级：3 (做不了)
// 1 v 1-0: Scary
// 5 v 1-0: eyesBaka
// 5 v 3-2 : eyes5
// 2 v 5: normal
// 1 v >5: eyes3 + ShowRedFace1 + Sweats
// 1 v 4-2: idle + Sweats
// 优先级：4
// 0 - 10 : Lines + Sweats
// 10 - 0 : Baka
