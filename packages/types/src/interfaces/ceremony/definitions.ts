export default {
  rpc: {
      ceremonies: {
          getReputations: {
              description: 'Get all reputations of an account in any community',
              params: [
                  {
                      name: 'account',
                      type: 'AccountId',
                      isOptional: false
                  },
                  {
                      name: 'at',
                      type: 'Hash',
                      isOptional: true
                  }
              ],
              type: 'Vec<(CommunityIdentifier, Reputation)>'
          },
      },
  },
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
      claimantPublic: 'AccountId',
      ceremonyIndex: 'CeremonyIndexType',
      communityIdentifier: 'CommunityIdentifier',
      meetupIndex: 'MeetupIndexType',
      location: 'Location',
      timestamp: 'Moment',
      numberOfParticipantsConfirmed: 'u32',
      claimantSignature: 'Option<MultiSignature>'
    },
    ClaimOfAttendanceSigningPayload: {
      claimantPublic: 'AccountId',
      ceremonyIndex: 'CeremonyIndexType',
      communityIdentifier: 'CommunityIdentifier',
      meetupIndex: 'MeetupIndexType',
      location: 'Location',
      timestamp: 'Moment',
      numberOfParticipantsConfirmed: 'u32',
    },
    AssignmentCount: {
      bootstrappers: 'ParticipantIndexType',
      reputables: 'ParticipantIndexType',
      endorsees: 'ParticipantIndexType',
      newbies: 'ParticipantIndexType',
    },
    Assignment: {
      bootstrappersReputables: 'AssignmentParams',
      endorsees: 'AssignmentParams',
      newbies: 'AssignmentParams',
      locations: 'AssignmentParams',
    },
    AssignmentParams: {
      m: 'u64',
      s1: 'u64',
      s2: 'u64',
    },
    CommunityCeremonyStats: {
      communityCeremony: '(Text, CeremonyIndexType)',
      assignment: 'Assignment',
      assignmentCount: 'AssignmentCount',
      meetupCount: 'MeetupIndexType',
      meetups: 'Vec<Meetup>',
    },
    Meetup: {
      index: 'MeetupIndexType',
      location: 'LocationRpc',
      time: 'Moment',
      registrations: 'Vec<(AccountId, ParticipantRegistration)>',
    },
    ParticipantRegistration: {
      index: 'ParticipantIndexType',
      registrationType: 'RegistrationType',
    },
    RegistrationType: {
      _enum: [
        'Bootstrapper',
        'Reputable',
        'Endorsee',
        'Newbie',
      ]
    },
    // Todo: remove this type does no longer exist in ceremonies, but it still exists in the trusted stuff.
    Attestation: {
      claim: 'ClaimOfAttendance',
      signature: 'MultiSignature',
      public: 'AccountId'
    },
    ProofOfAttendance: {
      proverPublic: 'AccountId',
      ceremonyIndex: 'CeremonyIndexType',
      communityIdentifier: 'CommunityIdentifier',
      attendeePublic: 'AccountId',
      attendeeSignature: 'MultiSignature'
    }
  }
};
