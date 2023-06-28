// Copyright 2017-2022 @polkadot/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const denoIntPrefix = 'https://deno.land/x';
export const denoExtPrefix = 'https://esm.sh';
export const denoLndPrefix = 'https://deno.land';

/**
 * @param {string} name
 */
export function denoCreateName (name) {
  return `${name.replace('@encointer/', 'encointer/')}`;
}

/**
 * @param {string} name
 */
export function denoCreateDir (name) {
  // aligns with name above - since we have sub-paths, we only return
  // the actual path inside packages/* (i.e. the last part of the name)
  return name.replace('@encointer/', '');
}
