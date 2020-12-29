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
    Location: {
      lat: 'i64',
      lon: 'i64'
    },
    MeetupAssignment: '(MeetupIndexType, Option<Location>)',
    ClaimOfAttendance: {
      claimant_public: 'AccountId',
      ceremony_index: 'CeremonyIndexType',
      currency_identifier: 'CurrencyIdentifier',
      meetup_index: 'MeetupIndexType',
      location: 'Location',
      timestamp: 'Moment',
      number_of_participants_confirmed: 'u32'
    },
    Attestation: {
      claim: 'ClaimOfAttendance',
      signature: 'MultiSignature',
      public: 'AccountId'
    },
    ProofOfAttendance: {
      prover_public: 'AccountId',
      ceremony_index: 'CeremonyIndexType',
      currency_identifier: 'CurrencyIdentifier',
      attendee_public: 'AccountId',
      attendee_signature: 'Signature'
    }
  }
};
