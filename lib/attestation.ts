import { createPrivateKey, createPublicKey, generateKeyPairSync, KeyObject, sign } from 'crypto';

/**
 * Shared Ed25519 attestation signer.
 *
 * If ATTESTATION_ED25519_PRIVATE_KEY_PEM is set (Vercel env), every receipt is signed
 * with that pinned key, whose public half is published at
 * /.well-known/skillproof-pubkey.json — so third parties can verify the issuer.
 *
 * If it is NOT set, we fall back to an ephemeral per-request key and label the
 * receipt `key_binding: "ephemeral_unanchored"`. An ephemeral signature proves the
 * payload was not altered after issue, but it does NOT prove who issued it, and we
 * must not claim otherwise.
 */
export type AttestationKeyBinding = 'pinned_published' | 'ephemeral_unanchored';

let cached: { priv: KeyObject; pubHex: string; binding: AttestationKeyBinding } | null = null;

function loadKey() {
  if (cached) return cached;
  const pem = process.env.ATTESTATION_ED25519_PRIVATE_KEY_PEM?.replace(/\\n/g, '\n');
  if (pem && pem.includes('PRIVATE KEY')) {
    const priv = createPrivateKey(pem);
    const pubHex = createPublicKey(priv).export({ type: 'spki', format: 'der' }).subarray(-32).toString('hex');
    cached = { priv, pubHex, binding: 'pinned_published' };
    return cached;
  }
  return null;
}

export function signAttestation(payload: Buffer): {
  algorithm: 'Ed25519';
  public_key_hex: string;
  signature_hex: string;
  key_binding: AttestationKeyBinding;
  verification_key_url: string | null;
} {
  const pinned = loadKey();
  if (pinned) {
    return {
      algorithm: 'Ed25519',
      public_key_hex: pinned.pubHex,
      signature_hex: sign(null, payload, pinned.priv).toString('hex'),
      key_binding: pinned.binding,
      verification_key_url: 'https://www.nanoempireai.com/.well-known/skillproof-pubkey.json',
    };
  }
  const { publicKey, privateKey } = generateKeyPairSync('ed25519');
  return {
    algorithm: 'Ed25519',
    public_key_hex: publicKey.export({ type: 'spki', format: 'der' }).subarray(-32).toString('hex'),
    signature_hex: sign(null, payload, privateKey).toString('hex'),
    key_binding: 'ephemeral_unanchored',
    verification_key_url: null,
  };
}
