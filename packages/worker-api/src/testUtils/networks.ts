// Some network configs to run tests agains

// Todo: move this to separate package `dev`
export const gesellNetwork = () => {
  return {
    chain: 'wss://gesell.encointer.org',
    genesisHash: '0xbe9b25f50cd46745d0b6a78d7a0c67bfee10a0597b1fe607483dc819f2c3a0d2',
    chosenCid: '4oyxCDvpG6oZ93VmB73rE6P6enfdDZ9PvEvw9eRoqdeM',
    customTypes: TypeOverrides_V3_8,
    palletOverrides: PalletOverrides_V3_8
  };
};

export const cantillonNetwork = () => {
  return {
    chain: 'wss://cantillon.encointer.org',
    worker: 'wss://substratee03.scs.ch',
    genesisHash: '0x2b673afeff4a17e65fb3248fe9ac2a74998508a5c434f79a722af4fa8ab7470f',
    chosenCid: '3rk5pLBVZsWesSD4buAkZ4meguYKTpK8bKAA9MjtxPDe',
    customTypes: TypeOverrides_V3_8,
    palletOverrides: PalletOverrides_V3_8
  };
};

export const chainbrickNetwork = () => {
  return {
    chain: 'ws://chainbrick.encointer.org:9944',
    worker: 'ws://chainbrick.encointer.org:2000',
    genesisHash: '0x2b673afeff4a17e65fb3248fe9ac2a74998508a5c434f79a722af4fa8ab7470f',
    chosenCid: '3rk5pLBVZsWesSD4buAkZ4meguYKTpK8bKAA9MjtxPDe',
    customTypes: TypeOverrides_V3_8,
    palletOverrides: PalletOverrides_V3_8
  };
};

// Note: `mrenclave` is not deterministic, this needs to be edited for every worker build.
export const localDockerNetwork = () => {
  return {
    chain: 'ws://127.0.0.1:9944',
    worker: 'wss://127.0.0.1:2000',
    genesisHash: '0x388c446a804e24e77ae89f5bb099edb60cacc2ac7c898ce175bdaa08629c1439',
    mrenclave: '9jm9Wm4DwGxsUUPA1cvcWWxyTuynpJ2YeEcNGnm8nztk',
    chosenCid: '9jm9Wm4DwGxsUUPA1cvcWWxyTuynpJ2YeEcNGnm8nztk',
    customTypes: {},
    palletOverrides: {}
  };
};

export const paseoNetwork = () => {
  return {
    chain: 'wss://rpc.ibp.network/paseo:443',
    // reverse proxy to the worker
    worker: 'wss://scv1.paseo.api.incognitee.io:443',
    genesisHash: '',
    mrenclave: '5wePd1LYa5M49ghwgZXs55cepKbJKhj5xfzQGfPeMS7c',
    // abused as shard vault
    chosenCid: '5wePd1LYa5M49ghwgZXs55cepKbJKhj5xfzQGfPeMS7c',
    customTypes: {},
    palletOverrides: {}
  };
};

// Type overrides needed for the v3.8 tag of the encointer-node repo.
const TypeOverrides_V3_8 = {
  CurrencyIdentifier: 'Hash',
  BalanceType: 'i128',
  BalanceEntry: {
    principal: 'i128',
    last_update: 'BlockNumber'
  },
  CurrencyCeremony: '(CurrencyIdentifier,CeremonyIndexType)',
  CurrencyPropertiesType: {
    name_utf8: 'Vec<u8>',
    demurrage_per_block: 'Demurrage'
  },
  GetterArgs: '(AccountId, CurrencyIdentifier)',
  PublicGetter: {
    _enum: {
      total_issuance: 'CurrencyIdentifier',
      participant_count: 'CurrencyIdentifier',
      meetup_count: 'CurrencyIdentifier',
      ceremony_reward: 'CurrencyIdentifier',
      location_tolerance: 'CurrencyIdentifier',
      time_tolerance: 'CurrencyIdentifier',
      scheduler_state: 'CurrencyIdentifier'
    }
  },
  TrustedGetter: {
    _enum: {
      balance: '(AccountId, CurrencyIdentifier)',
      participant_index: '(AccountId, CurrencyIdentifier)',
      meetup_index: '(AccountId, CurrencyIdentifier)',
      attestations: '(AccountId, CurrencyIdentifier)',
      meetup_registry: '(AccountId, CurrencyIdentifier)'
    }
  }
};

// Pallet overrides for the v3.8 tag of the encointer-node repo
const PalletOverrides_V3_8 = {
  encointerCommunities: {
    name: 'encointerCurrencies',
    calls: {
      communityIdentifiers: 'currencyIdentifiers'
    }
  }
};
