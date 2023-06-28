"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modInv = exports.assignmentFnInverse = exports.computeStartOfAttestingPhase = exports.meetupTime = exports.meetupLocation = exports.meetupIndex = exports.computeMeetupIndex = exports.getRegistration = exports.assignmentFn = void 0;
const tslib_1 = require("tslib");
const index_js_1 = require("@encointer/types/index.js");
const assert_1 = tslib_1.__importDefault(require("assert"));
/**
 * Performs the same meetup assignment as the encointer-ceremonies pallet.
 *
 * @param participantIndex
 * @param assignmentParams
 * @param assignmentCount
 */
function assignmentFn(participantIndex, assignmentParams, assignmentCount) {
    if (assignmentParams.m.eq(0) || assignmentCount.eq(0)) {
        console.log(`[assignmentFn] invalid params or assignmentCount. Returning 0`);
        return participantIndex.registry.createTypeUnsafe('MeetupIndexType', [0]);
    }
    return participantIndex
        .mul(assignmentParams.s1)
        .add(assignmentParams.s2)
        .mod(assignmentParams.m)
        .mod(assignmentCount);
}
exports.assignmentFn = assignmentFn;
function getRegistration(pIndexes) {
    const registry = pIndexes[0].registry;
    console.log(`[getRegistration] pIndexes: ${JSON.stringify(pIndexes)}`);
    if (!pIndexes[0].eq(0)) {
        return registry.createTypeUnsafe('Option<ParticipantRegistration>', [[pIndexes[0], 'Bootstrapper']]);
    }
    else if (!pIndexes[1].eq(0)) {
        return registry.createTypeUnsafe('Option<ParticipantRegistration>', [[pIndexes[1], 'Reputable']]);
    }
    else if (!pIndexes[2].eq(0)) {
        return registry.createTypeUnsafe('Option<ParticipantRegistration>', [[pIndexes[2], 'Endorsee']]);
    }
    else if (!pIndexes[3].eq(0)) {
        return registry.createTypeUnsafe('Option<ParticipantRegistration>', [[pIndexes[3], 'Newbie']]);
    }
    return registry.createTypeUnsafe('Option<ParticipantRegistration>', []);
}
exports.getRegistration = getRegistration;
/**
 * Computes the meetup index given the all the meetup params.
 *
 * Returns 0 if the participant has not been assigned.
 */
function computeMeetupIndex(registration, assignments, assignmentCount, meetupCount) {
    const registry = assignmentCount.registry;
    let pIndex;
    if (meetupCount.eq(0)) {
        // 0 index means not registered
        return meetupCount;
    }
    if (registration.index.eq(0)) {
        console.log("[computeMeetupIndex] supplied registration with participantIndex = 0. returning...");
        return registration.index;
    }
    else {
        pIndex = registration.index.subn(1);
    }
    const meetupIndexFn = (pIndex, params) => meetupIndex(pIndex, params, meetupCount);
    if (registration.registrationType.isBootstrapper) {
        console.log("[computeMeetupIndex] is bootstrapper.");
        if (pIndex.lt(assignmentCount.bootstrappers)) {
            return meetupIndexFn(pIndex, assignments.bootstrappersReputables);
        }
    }
    else if (registration.registrationType.isReputable) {
        console.log("[computeMeetupIndex] is reputable");
        if (pIndex.lt(assignmentCount.reputables)) {
            return meetupIndexFn(pIndex.add(assignmentCount.bootstrappers), assignments.bootstrappersReputables);
        }
    }
    else if (registration.registrationType.isEndorsee) {
        console.log("[computeMeetupIndex] is endorsee.");
        if (pIndex.lt(assignmentCount.endorsees)) {
            return meetupIndexFn(pIndex, assignments.endorsees);
        }
    }
    else if (registration.registrationType.isNewbie) {
        console.log("[computeMeetupIndex] is endorsee.");
        if (pIndex.lt(assignmentCount.newbies)) {
            return meetupIndexFn(pIndex, assignments.newbies);
        }
    }
    return registry.createTypeUnsafe('MeetupIndexType', [0]);
}
exports.computeMeetupIndex = computeMeetupIndex;
/**
 * Get the meetup index for a participant with given assigment params.
 *
 * @param participantIndex
 * @param assignmentParams
 * @param meetupCount
 */
function meetupIndex(participantIndex, assignmentParams, meetupCount) {
    console.log(`[meetupIndex] executing assignmentFn`);
    const result = assignmentFn(participantIndex, assignmentParams, meetupCount);
    const mIndex = result.addn(1);
    console.log(`[meetupIndex] mIndex (=assignmentFn result + 1): ${JSON.stringify(mIndex)}`);
    return mIndex;
}
exports.meetupIndex = meetupIndex;
/**
 * Get the location for a given meetup.
 *
 * @param meetupIndex
 * @param locations
 * @param locationAssignmentParams
 */
function meetupLocation(meetupIndex, locations, locationAssignmentParams) {
    const registry = meetupIndex.registry;
    // not sure why we need to specify the type here explicitly.
    const len = registry.createTypeUnsafe('u64', [locations.length]);
    if (len.eq(0)) {
        console.log(`[meetup_location]: Locations empty: ${len}`);
        return registry.createTypeUnsafe('Option<Location>', []);
    }
    const location_index = assignmentFn(meetupIndex, locationAssignmentParams, len);
    if (location_index < len) {
        return registry.createTypeUnsafe('Option<Location>', [locations[location_index.toNumber()]]);
    }
    else {
        console.log(`[meetup_location]: Location index is out of bounds ${location_index}. Locations length: ${len}`);
        return registry.createTypeUnsafe('Option<Location>', []);
    }
}
exports.meetupLocation = meetupLocation;
/**
 * Get the meetup time for a given location.
 */
function meetupTime(location, attesting_start, one_day, offset) {
    const registry = location.registry;
    const per_degree = one_day.toNumber() / 360;
    // The meetups start at high sun at 180 degrees and during one day the meetup locations travel
    // along the globe until the very last meetup happens at high sun at -180 degrees.
    // So we scale the range 180...-180 to 0...360
    const lon = Math.abs((0, index_js_1.parseDegree)(location.lon) - 180);
    const lon_time = lon * per_degree;
    let result = Math.round(attesting_start.toNumber() + lon_time + offset.toNumber());
    return registry.createTypeUnsafe('Moment', [result]);
}
exports.meetupTime = meetupTime;
function computeStartOfAttestingPhase(currentPhase, nextPhaseStart, assigningDuration, attestingDuration) {
    if (currentPhase.isRegistering) {
        return nextPhaseStart.add(assigningDuration);
    }
    else if (currentPhase.isAssigning) {
        return nextPhaseStart;
    }
    else if (currentPhase.isAttesting) {
        return nextPhaseStart.sub(attestingDuration);
    }
    else {
        throw `[computeStartOfAttestingPhase] Unknown phase supplied: ${currentPhase}`;
    }
}
exports.computeStartOfAttestingPhase = computeStartOfAttestingPhase;
/**
 * Returns the participants for a given assignment configuration.
 *
 * @param meetupIndex
 * @param assignmentParams
 * @param assignmentCount
 * @param participantCount
 */
function assignmentFnInverse(meetupIndex, assignmentParams, assignmentCount, participantCount) {
    const registry = meetupIndex.registry;
    // safe; the numbers will not exceed 2^53
    const mIndex = meetupIndex.toNumber();
    const m = assignmentParams.m.toNumber();
    const aCount = assignmentCount.toNumber();
    const pCount = participantCount.toNumber();
    const maxIndex = Math.ceil(Math.max(m - mIndex, 0) / aCount);
    let participants = [];
    for (let i = 0; i < maxIndex; i++) {
        const t2 = modInv(assignmentParams.s1.toNumber(), m);
        const t3 = t3Fn(aCount, i, mIndex, assignmentParams, t2);
        if (t3 >= pCount) {
            continue;
        }
        // never observed in practice
        (0, assert_1.default)(t3 >= 0, `[assignment_fn_inverse]: t3 smaller 0: ${t3}`);
        participants.push(t3);
        if (t3 < pCount - m) {
            participants.push(t3 + m);
        }
    }
    return registry.createTypeUnsafe('Vec<ParticipantIndexType>', [participants]);
}
exports.assignmentFnInverse = assignmentFnInverse;
function modInv(a, module) {
    let mn = [module, a];
    let xy = [0, 1];
    while (mn[1] != 0) {
        xy = [xy[1], xy[0] - Math.floor((mn[0] / mn[1])) * xy[1]];
        mn = [mn[1], mn[0] % mn[1]];
    }
    while (xy[0] < 0) {
        xy[0] += module;
    }
    return xy[0];
}
exports.modInv = modInv;
function t3Fn(n, currentIndex, meetupIndex, params, t2) {
    const x = (n * currentIndex) + meetupIndex - params.s2.toNumber();
    const y = remainder(x, params.m.toNumber()) * t2;
    return remainder(y, params.m.toNumber());
}
/**
 * Returns the integer division remainder.
 * @param n
 * @param m
 */
function remainder(n, m) {
    return ((n % m) + m) % m;
}
