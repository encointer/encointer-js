'use strict';

import {TypeRegistry, u64} from "@polkadot/types";
import {RegistryTypes} from "@polkadot/types/types";
import {options as encointerOptions} from "@encointer/node-api";
import {assignment_fn} from "@encointer/util/assignment";
import {AssignmentParams, ParticipantIndexType} from "@encointer/types";

describe('assigmnet', () => {
    const registry = new TypeRegistry()

    beforeAll(() => {
        registry.register(encointerOptions().types as RegistryTypes)
    });

    it('assignment_fn works', () => {

        const pIndex: ParticipantIndexType = registry.createType('ParticipantIndexType',6);
        const params: AssignmentParams = registry.createType('AssignmentParams',[4, 5, 3]);
        const assignmentCount: u64 = registry.createType('u64',5);

        expect(assignment_fn(pIndex, params, assignmentCount).toNumber()).toEqual(1)

    });
});
