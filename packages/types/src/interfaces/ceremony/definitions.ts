export default {
  rpc: {},
  types: {
    CeremonyIndexType: 'u32',
    CeremonyPhaseType: {
      _enum: [
        'Registering',
        'Assigning',
        'Attesting'
      ]
    },
    ParticipantIndexType: 'u64',
    MeetupIndexType: 'u64',
    AttestationIndexType: 'u64',
    MeetupAssignment: '(MeetupIndexType, Option<Location>)',
    ClaimOfAttendance: {
      claimant_public: 'AccountId',
      ceremony_index: 'CeremonyIndexType',
      community_identifier: 'CommunityIdentifier',
      meetup_index: 'MeetupIndexType',
      location: 'Location',
      timestamp: 'Moment',
      number_of_participants_confirmed: 'u32',
      claimant_signature: 'Option<MultiSignature>'
    },
    // Todo: remove this type does no longer exist in ceremonies, but it still exists in the trusted stuff.
    Attestation: {
      claim: 'ClaimOfAttendance',
      signature: 'MultiSignature',
      public: 'AccountId'
    },
    ProofOfAttendance: {
      prover_public: 'AccountId',
      ceremony_index: 'CeremonyIndexType',
      community_identifier: 'CommunityIdentifier',
      attendee_public: 'AccountId',
      attendee_signature: 'Signature'
    }
  }
};
