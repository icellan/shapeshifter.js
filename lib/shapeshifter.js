import { Buffer } from 'buffer'
import { Transaction } from 'bsv'
import 'core-js/features/array/flat-map'
import TXO from './txo'
import BOB from './bob'

const Tx = Transaction;

/**
 * Shapeshifter lets you quickly and simply switch between Bitcoin transaction
 * formats.
 */
class Shapeshifter {
  /**
   * Creates a new Shapeshifter instance from the given transaction.
   *
   * Accepts either a raw hex string, raw Buffer, BSV Tx object, or TXO or BOB
   * serialization formats.
   *
   * @param {String | Buffer | Tx | Object} src Source tx
   * @constructor
   */
  constructor(src) {
    try {
      // If hex string or buffer, parse as tx object
      // If hex string or buffer, parse as tx object
      if ((typeof src === 'string' && src.match(/^[a-f0-9]+$/)) || Buffer.isBuffer(src)) {
        src = Tx(src)
      } else if (src instanceof Tx) {
        src = Tx(src)
      }
    } catch(e) {
      throw 'The source tx is not a valid Bitcoin transaction.'
    }

    // Determine format
    if (Array.isArray(src.inputs) && Array.isArray(src.outputs)) {
      this.src = Tx.shallowCopy(src)
      this.src = Tx.shallowCopy(src)
      this.format = 'tx'
    } else if (Array.isArray(src.in) && Array.isArray(src.out)) {
      this.src = JSON.parse(JSON.stringify(src))
      this.format = src.out.some(o => Array.isArray(o.tape)) ?
        'bob' :
        'txo'
    } else {
      throw 'The source tx is not a valid Bitcoin transaction.'
    }
  }

  /**
   * Converts the given transaction to a raw tx Buffer.
   *
   * @param {String | Buffer | Tx | Object} src Source tx
   * @returns {Buffer}
   */
  static toBuffer(src) {
    throw new Error('toBuffer does not work in this version')
    return new this(src).toBuffer()
  }

  /**
   * Converts the given transaction to a raw hex String.
   *
   * @param {String | Buffer | Tx | Object} src Source tx
   * @returns {String}
   */
  static toHex(src) {
    throw new Error('toHex does not work in this version')
    return new this(src).toString('hex')
  }

  /**
   * Converts the given transaction to a structured BSV Tx object.
   *
   * @param {String | Buffer | Tx | Object} src Source tx
   * @returns {Tx}
   */
  static toTx(src) {
    throw new Error('toTx does not work in this version')
    return new this(src).toTx()
  }

  /**
   * Converts the given transaction to a TXO formatted object.
   *
   * @param {String | Buffer | Tx | Object} src Source tx
   * @returns {Object}
   */
  static toTxo(src) {
    return new this(src).toTxo()
  }

  /**
   * Converts the given transaction to a BOB formatted object.
   *
   * @param {String | Buffer | Tx | Object} src Source tx
   * @returns {Object}
   */
  static toBob(src) {
    return new this(src).toBob()
  }

  /**
   * Converts the Shapeshifter to a raw tx Buffer.
   *
   * @returns {Buffer}
   */
  toBuffer() {
    throw new Error('toBuffer does not work in this version')
    return this.toTx().toBuffer()
  }

  /**
   * Converts the Shapeshifter to a raw hex String.
   *
   * @returns {String}
   */
  toHex() {
    throw new Error('toHex does not work in this version')
    return this.toTx().toString('hex')
  }

  /**
   * Converts the Shapeshifter to a structured BSV Tx object.
   *
   * @returns {Tx}
   */
  toTx() {
    switch(this.format) {
      case 'tx':
        return this.src
      case 'txo':
        return TXO.toTx(this)
      case 'bob':
        return BOB.toTx(this)
    }
  }

  /**
   * Converts the Shapeshifter to a TXO formatted object.
   *
   * @returns {Object}
   */
  toTxo() {
    switch(this.format) {
      case 'tx':
        return TXO.fromTx(this)
      case 'txo':
        return this.src
      case 'bob':
        return TXO.fromBob(this)
    }
  }

  /**
   * Converts the Shapeshifter to a BOB formatted object.
   *
   * @returns {Object}
   */
  toBob() {
    switch(this.format) {
      case 'tx':
        return BOB.fromTx(this)
      case 'txo':
        return BOB.fromTxo(this)
      case 'bob':
        return this.src
    }
  }
}

export default Shapeshifter
