import { meetupLocation, assignmentFnInverse, meetupTime, computeMeetupIndex, getRegistration, computeStartOfAttestingPhase } from "@encointer/util/assignment.js";
import { IndexRegistry } from "@encointer/node-api/interface.js";
export async function getAssignment(api, cid, cIndex) {
    return api.query["encointerCeremonies"]["assignments"]([cid, cIndex]);
}
export async function getAssignmentCount(api, cid, cIndex) {
    return api.query["encointerCeremonies"]["assignmentCounts"]([cid, cIndex]);
}
export async function getMeetupCount(api, cid, cIndex) {
    return api.query["encointerCeremonies"]["meetupCount"]([cid, cIndex]);
}
export async function getMeetupTimeOffset(api) {
    return api.query["encointerCeremonies"]["meetupTimeOffset"]();
}
export async function getParticipantRegistration(api, cid, cIndex, address) {
    // helper query to make below code more readable
    const indexQuery = participantIndexQuery(api, cid, cIndex, address);
    const pIndexes = await Promise.all([
        indexQuery(IndexRegistry.Bootstrapper),
        indexQuery(IndexRegistry.Reputable),
        indexQuery(IndexRegistry.Endorsee),
        indexQuery(IndexRegistry.Newbie),
    ]);
    return getRegistration(pIndexes);
}
export async function getMeetupIndex(api, cid, cIndex, address) {
    // query everything in parallel to speed up process.
    const [mCount, assignments, assignmentCount, registration] = await Promise.all([
        getMeetupCount(api, cid, cIndex),
        getAssignment(api, cid, cIndex),
        getAssignmentCount(api, cid, cIndex),
        getParticipantRegistration(api, cid, cIndex, address),
    ]);
    console.log(`[getMeetupIndex] mCount: ${mCount}`);
    console.log(`[getMeetupIndex] assignment: ${JSON.stringify(assignments)}`);
    console.log(`[getMeetupIndex] assignmentCount: ${JSON.stringify(assignmentCount)}`);
    console.log(`[getMeetupIndex] registration: ${JSON.stringify(registration)}`);
    if (mCount.eq(0)) {
        // 0 index means not registered
        return mCount;
    }
    if (registration.isNone) {
        console.log("[getMeetupIndex] participantIndex was 0");
        return mCount.registry.createTypeUnsafe("MeetupIndexType", [0]); // don't know why the cast is necessary
    }
    return computeMeetupIndex(registration.unwrap(), assignments, assignmentCount, mCount);
}
export async function getMeetupLocation(api, cid, cIndex, meetupIndex) {
    // ts-ignore can be removed once we autogenerate types and interfaces.
    // The problem is that the rpc methods don't contain a `communities` section by default.
    const [locations, assignmentParams] = await Promise.all([
        // @ts-ignore
        api.rpc.encointer.getLocations(cid),
        getAssignment(api, cid, cIndex)
    ]);
    return meetupLocation(meetupIndex, locations, assignmentParams.locations).unwrap();
}
export async function getMeetupParticipants(api, cid, cIndex, meetupIndex) {
    let registry = api.registry;
    const mIndexZeroBased = registry.createType('MeetupIndexType', meetupIndex.toNumber() - 1);
    const [meetupCount, assignmentParams, assignedCount] = await Promise.all([
        getMeetupCount(api, cid, cIndex),
        getAssignment(api, cid, cIndex),
        getAssignmentCount(api, cid, cIndex)
    ]);
    const bootstrappers_reputables_promises = assignmentFnInverse(mIndexZeroBased, assignmentParams.bootstrappersReputables, meetupCount, participantIndex(api.registry, assignedCount.bootstrappers.add(assignedCount.reputables)))
        .filter((pIndex) => isBootstrapperOrReputable(pIndex, assignedCount))
        .map((pIndex) => bootstrapperOrReputableQuery(api, cid, cIndex, pIndex, assignedCount));
    const endorsees_promises = assignmentFnInverse(mIndexZeroBased, assignmentParams.endorsees, meetupCount, assignedCount.endorsees)
        .filter((pIndex) => pIndex.toNumber() < assignedCount.endorsees.toNumber())
        .map((pIndex) => api.query["encointerCeremonies"]["endorseeRegistry"]([cid, cIndex], participantIndex(api.registry, pIndex.toNumber() + 1)));
    const newbie_promises = assignmentFnInverse(mIndexZeroBased, assignmentParams.newbies, meetupCount, assignedCount.newbies)
        .filter((pIndex) => pIndex.toNumber() < assignedCount.newbies.toNumber())
        .map((pIndex) => api.query["encointerCeremonies"]["newbieRegistry"]([cid, cIndex], participantIndex(api.registry, pIndex.toNumber() + 1)));
    const participants = await Promise.all([
        ...bootstrappers_reputables_promises,
        ...endorsees_promises,
        ...newbie_promises
    ]);
    return api.createType('Vec<AccountId>', participants.map((a) => a.toHex()));
}
export async function getParticipantIndex(api, cid, cIndex, address) {
    const indexQuery = participantIndexQuery(api, cid, cIndex, address);
    // query everything in parallel to speed up process.
    const pIndexes = await Promise.all([
        indexQuery(IndexRegistry.Bootstrapper),
        indexQuery(IndexRegistry.Reputable),
        indexQuery(IndexRegistry.Endorsee),
        indexQuery(IndexRegistry.Newbie),
    ]);
    const index = pIndexes.find(i => i.toNumber() > 0);
    if (index !== undefined) {
        return index;
    }
    else {
        return participantIndex(api.registry, 0);
    }
}
export async function getNextMeetupTime(api, location) {
    const [attestingStart, offset] = await Promise.all([
        getStartOfAttestingPhase(api),
        getMeetupTimeOffset(api),
    ]);
    const oneDayT = api.createType('Moment', api.consts["encointerScheduler"]["momentsPerDay"]);
    _log(`getNextMeetupTime: attestingStart: ${attestingStart}`);
    _log(`getNextMeetupTime: meetupTimeOffset: ${offset}`);
    _log(`getNextMeetupTime: momentPerDay: ${oneDayT}`);
    return meetupTime(location, attestingStart, oneDayT, offset);
}
export async function getStartOfAttestingPhase(api) {
    const [currentPhase, nextPhaseStart, assigningDuration, attestingDuration] = await Promise.all([
        api.query["encointerScheduler"]["currentPhase"](),
        api.query["encointerScheduler"]["nextPhaseTimestamp"](),
        api.query["encointerScheduler"]["phaseDurations"]('Assigning'),
        api.query["encointerScheduler"]["phaseDurations"]('Attesting'),
    ]);
    return computeStartOfAttestingPhase(currentPhase, nextPhaseStart, assigningDuration, attestingDuration);
}
/**
 * Returns either the community-specific demurrage or the default demurrage.
 */
export async function getDemurrage(api, cid) {
    // See reasoning for `FixedI64F64` generic param: https://github.com/encointer/encointer-js/issues/47
    const demurrageCommunity = await api.query["encointerBalances"]["demurragePerBlock"](cid)
        .then((dc) => api.createType('Demurrage', dc.bits));
    if (demurrageCommunity.eq(0)) {
        const demurrageDefault = api.consts["encointerBalances"]["defaultDemurrage"].bits;
        return api.createType('Demurrage', demurrageDefault);
    }
    else {
        return demurrageCommunity;
    }
}
/**
 * Returns either the community-specific ceremony income or the default ceremony income.
 */
export async function getCeremonyIncome(api, cid) {
    // See reasoning for `FixedI64F64` generic param: https://github.com/encointer/encointer-js/issues/47
    const [incomeCommunity, incomeDefault] = await Promise.all([
        api.query["encointerCommunities"]["nominalIncome"](cid).then((cr) => api.createType('NominalIncomeType', cr.bits)),
        api.query["encointerCeremonies"]["ceremonyReward"]().then((cr) => api.createType('NominalIncomeType', cr.bits))
    ]);
    if (incomeCommunity.eq(0)) {
        return incomeDefault;
    }
    else {
        return incomeCommunity;
    }
}
function participantIndexQuery(api, cid, cIndex, address) {
    return (storage_key) => api.query["encointerCeremonies"][storage_key]([cid, cIndex], address);
}
function participantIndex(registry, ...params) {
    return registry.createType('ParticipantIndexType', params);
}
function isBootstrapperOrReputable(pIndex, assigned) {
    return pIndex.toNumber() < assigned.bootstrappers.toNumber() + assigned.reputables.toNumber();
}
function bootstrapperOrReputableQuery(api, cid, cIndex, pIndex, assigned) {
    if (pIndex < assigned.bootstrappers) {
        const i = participantIndex(api.registry, pIndex.toNumber() + 1);
        return api.query["encointerCeremonies"]["bootstrapperRegistry"]([cid, cIndex], i);
    }
    else {
        const i = participantIndex(api.registry, pIndex.toNumber() - assigned.bootstrappers.toNumber() + 1);
        return api.query["encointerCeremonies"]["reputableRegistry"]([cid, cIndex], i);
    }
}
function _log(msg) {
    console.log(`[encointer-js:api] ${msg}`);
}