import { IEncointerWorker, PubKeyPinPair } from "./interface"
import {
  BalanceTransferArgs,
  GrantReputationArgs,
  RegisterAttestationsArgs,
  RegisterParticipantArgs,
  TrustedCallSigned
} from "@encointer/types";
import { KeyringPair } from "@polkadot/keyring/types";
import type { u32 } from "@polkadot/types";
import bs58 from "bs58";
import { Hash } from "@polkadot/types/interfaces";
import { toAccount } from "@encointer/util/common";

export type TrustedCallArgs = (BalanceTransferArgs | RegisterParticipantArgs | RegisterAttestationsArgs | GrantReputationArgs);

export type TrustedCallVariant = [string, string]

export const createTrustedCall = (
  self: IEncointerWorker,
  trustedCall: TrustedCallVariant,
  accountOrPubKey: (KeyringPair | PubKeyPinPair),
  cid: Hash, // this is currently plain hash to get around the problem of different encointer node versions having different names for the cid
  mrenclave: string,
  nonce: u32,
  params: TrustedCallArgs
): TrustedCallSigned => {

  const [variant, argType] = trustedCall;

  const cidBin = self.createType('CommunityIdentifier', cid);
  const hash = self.createType('Hash', bs58.decode(mrenclave));

  const call = self.createType('TrustedCall', {
    [variant]: self.createType(argType, params)
  });

  const payload = Uint8Array.from([...call.toU8a(), ...nonce.toU8a(), ...hash.toU8a(), ...cidBin.toU8a()]);

  return self.createType('TrustedCallSigned', {
    call: call,
    nonce: nonce,
    signature: toAccount(accountOrPubKey, self.keyring()).sign(payload)
  });
}