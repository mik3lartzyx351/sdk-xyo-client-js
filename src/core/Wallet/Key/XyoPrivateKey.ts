import EC from 'elliptic'

import { toUint8Array, XyoDataLike } from './Data'
import { XyoEllipticKey } from './XyoEllipticKey'
import { XyoPublicKey } from './XyoPublicKey'

export class XyoPrivateKey extends XyoEllipticKey {
  private _isXyoPrivateKey = true
  private _keyPair: EC.ec.KeyPair
  private _public?: XyoPublicKey

  constructor(value?: XyoDataLike) {
    super(32)
    if (value) {
      this._keyPair = XyoPrivateKey.ecContext.keyFromPrivate(toUint8Array(value))
    } else {
      this._keyPair = XyoPrivateKey.ecContext.genKeyPair()
    }
  }

  public override get bytes() {
    return toUint8Array(this._keyPair?.getPrivate())
  }

  public get public() {
    this._public = this._public ?? new XyoPublicKey(this._keyPair.getPublic('hex').slice(2))
    return this._public
  }

  public sign(hash: XyoDataLike) {
    const arrayHash = toUint8Array(hash)
    const signature = this._keyPair.sign(arrayHash)
    return toUint8Array(signature.r.toString('hex', 64) + signature.s.toString('hex', 64))
  }

  public verify(msg: Uint8Array | string, signature: Uint8Array | string) {
    return this.public.address.verify(msg, signature)
  }

  /*
  public signKeccakMessage(message: string) {
    const prefixBuffer = Buffer.from(messagePrefix)
    const messageLengthBuffer = Buffer.from([0x20])
    const messageBuffer = Buffer.from(message)
    const signingBuffer = keccak256(
      Buffer.concat([
        prefixBuffer,
        messageLengthBuffer,
        keccak256(Buffer.concat([messageBuffer, Buffer.from(toUint8Array(this.address))])),
      ])
    )
    const signature = this._key.sign(signingBuffer)
    return signature.toDER('hex').substring(2)
  }
  */

  public static isXyoPrivateKey(value: unknown) {
    return (value as XyoPrivateKey)._isXyoPrivateKey
  }
}
