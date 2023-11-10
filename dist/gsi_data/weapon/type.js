"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gun = exports.BumpMineOf = exports.BreachChargeOf = exports.StackableItemOf = exports.TabletOf = exports.ZoneRepulsorOf = exports.C4Of = exports.KnifeOf = exports.GrenadeOf = exports.ShieldOf = exports.TaserOf = exports.PistolOf = exports.SniperRifleOf = exports.MachineGunOf = exports.ShotgunOf = exports.SubmachineGunOf = exports.RifleOf = void 0;
/**
 * 判断步枪
 */
const RifleOf = (object) => {
    return object && object.type === "Rifle";
};
exports.RifleOf = RifleOf;
/**
 * 判断冲锋枪
 */
const SubmachineGunOf = (object) => {
    return object && object.type === "Submachine Gun";
};
exports.SubmachineGunOf = SubmachineGunOf;
/**
 * 判断霰弹枪
 */
const ShotgunOf = (object) => {
    return object && object.type === "Shotgun";
};
exports.ShotgunOf = ShotgunOf;
/**
 * 判断机枪
 */
const MachineGunOf = (object) => {
    return object && object.type === "Machine Gun";
};
exports.MachineGunOf = MachineGunOf;
/**
 * 判断狙击枪
 */
const SniperRifleOf = (object) => {
    return object && object.type === "SniperRifle";
};
exports.SniperRifleOf = SniperRifleOf;
/**
 * 判断手枪
 */
const PistolOf = (object) => {
    return object && object.type === "Pistol";
};
exports.PistolOf = PistolOf;
/**
 * 判断电击枪
 */
const TaserOf = (object) => {
    return object && object.name === "weapon_taser";
};
exports.TaserOf = TaserOf;
/**
 * 判断盾牌
 */
const ShieldOf = (object) => {
    return object && object.name === "weapon_shield";
};
exports.ShieldOf = ShieldOf;
/**
 * 判断投掷物
 */
const GrenadeOf = (object) => {
    return object && object.type === "Grenade";
};
exports.GrenadeOf = GrenadeOf;
/**
 * 判断🔪️
 */
const KnifeOf = (object) => {
    return object && object.type === "Knife";
};
exports.KnifeOf = KnifeOf;
/**
 * 判断C4
 */
const C4Of = (object) => {
    return object && object.type === "C4";
};
exports.C4Of = C4Of;
/**
 * 判断排斥装置
 */
const ZoneRepulsorOf = (object) => {
    return object && object.name === "weapon_zone_repulsor";
};
exports.ZoneRepulsorOf = ZoneRepulsorOf;
/**
 * 判断特训助手
 */
const TabletOf = (object) => {
    return object && object.type === "Tablet";
};
exports.TabletOf = TabletOf;
/**
 * 判断医疗针
 */
const StackableItemOf = (object) => {
    return object && object.type === "StackableItem";
};
exports.StackableItemOf = StackableItemOf;
/**
 * 判断遥控炸弹
 */
const BreachChargeOf = (object) => {
    return object && object.type === "Breach Charge";
};
exports.BreachChargeOf = BreachChargeOf;
/**
 * 判断弹射地雷
 */
const BumpMineOf = (object) => {
    return object && object.type === "Bump Mine";
};
exports.BumpMineOf = BumpMineOf;
/**
 * 只判断是否主武器
 */
const Gun = (object) => {
    if (object)
        switch (true) {
            case (0, exports.RifleOf)(object):
            case (0, exports.SubmachineGunOf)(object):
            case (0, exports.ShotgunOf)(object):
            case (0, exports.MachineGunOf)(object):
            case (0, exports.SniperRifleOf)(object):
                return true;
        }
    return false;
};
exports.Gun = Gun;
