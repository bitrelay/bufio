import * as encoding from './encoding'
import { enforce } from './enforce'
import { EncodingError } from './error'

/*
 * Constants
 */
const EMPTY = Buffer.alloc(0)

/**
 * Buffer Reader
 */
export class BufferReader {
    /**
     * Buffer reader data.
     */
    public data: Buffer

    /**
     * Buffer reader cursor.
     */
    public offset = 0

    /**
     * Do not reallocate buffers when slicing.
     */
    public zeroCopy: boolean

    /**
     * Buffer reader stack.
     */
    public stack: number[] = []

    /**
     * Create a buffer reader.
     * @param data
     * @param zeroCopy - Do not reallocate buffers when
     * slicing. Note that this can lead to memory leaks if not used
     * carefully.
     */
    constructor(data: Buffer, zeroCopy = false) {
        enforce(Buffer.isBuffer(data), 'data', 'buffer')
        enforce(typeof zeroCopy === 'boolean', 'zeroCopy', 'boolean')
        this.data = data
        this.zeroCopy = zeroCopy
    }

    /**
     * Assertion.
     * @param size
     */
    public check(size: number): void {
        if (this.offset + size > this.data.length) {
            throw new EncodingError(this.offset, 'Out of bounds read', this.check)
        }
    }

    /**
     * Get total size of passed-in Buffer.
     */
    public getSize(): number {
        return this.data.length
    }

    /**
     * Calculate number of bytes left to read.
     */

    public left(): number {
        this.check(0)
        return this.data.length - this.offset
    }

    /**
     * Seek to a position to read from by offset.
     * @param {Number} off - Offset (positive or negative).
     */
    public seek(off: number): BufferReader {
        enforce(Number.isSafeInteger(off), 'off', 'integer')

        if (this.offset + off < 0) {
            throw new EncodingError(this.offset, 'Out of bounds read')
        }

        this.check(off)
        this.offset += off

        return this
    }

    /**
     * Mark the current starting position.
     */
    public start(): number {
        this.stack.push(this.offset)
        return this.offset
    }

    /**
     * Stop reading. Pop the start position off the stack
     * and calculate the size of the data read.
     * @returns Size.
     * @throws on empty stack.
     */
    public end(): number {
        if (this.stack.length === 0) {
            throw new Error('Cannot end without a stack item.')
        }

        const start = this.stack.pop()!

        return this.offset - start
    }

    /**
     * Stop reading. Pop the start position off the stack
     * and return the data read.
     * @param zeroCopy - Do a fast buffer
     * slice instead of allocating a new buffer (warning:
     * may cause memory leaks if not used with care).
     * @returns Data read.
     * @throws on empty stack.
     */
    public endData(zeroCopy = false): Buffer {
        enforce(typeof zeroCopy === 'boolean', 'zeroCopy', 'boolean')

        if (this.stack.length === 0) {
            throw new Error('Cannot end without a stack item.')
        }

        const start = this.stack.pop()!
        const end = this.offset
        const size = end - start
        const data = this.data

        if (size === data.length) {
            return data
        }

        if (this.zeroCopy || zeroCopy) {
            return data.slice(start, end)
        }

        const ret = Buffer.allocUnsafe(size)
        data.copy(ret, 0, start, end)

        return ret
    }

    /**
     * Destroy the reader. Remove references to the data.
     */
    public destroy(): BufferReader {
        this.data = EMPTY
        this.offset = 0
        this.stack.length = 0
        return this
    }

    /**
     * Read uint8.
     */
    public readU8(): number {
        this.check(1)
        const ret = this.data[this.offset]
        this.offset += 1
        return ret
    }

    /**
     * Read uint16le.
     */
    public readU16(): number {
        this.check(2)
        const ret = encoding.readU16(this.data, this.offset)
        this.offset += 2
        return ret
    }

    /**
     * Read uint16be.
     */
    public readU16BE(): number {
        this.check(2)
        const ret = encoding.readU16BE(this.data, this.offset)
        this.offset += 2
        return ret
    }

    /**
     * Read uint24le.
     */
    public readU24(): number {
        this.check(3)
        const ret = encoding.readU24(this.data, this.offset)
        this.offset += 3
        return ret
    }

    /**
     * Read uint24be.
     */
    public readU24BE(): number {
        this.check(3)
        const ret = encoding.readU24BE(this.data, this.offset)
        this.offset += 3
        return ret
    }

    /**
     * Read uint32le.
     */
    public readU32(): number {
        this.check(4)
        const ret = encoding.readU32(this.data, this.offset)
        this.offset += 4
        return ret
    }

    /**
     * Read uint32be.
     */
    public readU32BE(): number {
        this.check(4)
        const ret = encoding.readU32BE(this.data, this.offset)
        this.offset += 4
        return ret
    }

    /**
     * Read uint40le.
     */
    public readU40(): number {
        this.check(5)
        const ret = encoding.readU40(this.data, this.offset)
        this.offset += 5
        return ret
    }

    /**
     * Read uint40be.
     */
    public readU40BE(): number {
        this.check(5)
        const ret = encoding.readU40BE(this.data, this.offset)
        this.offset += 5
        return ret
    }

    /**
     * Read uint48le.
     */
    public readU48(): number {
        this.check(6)
        const ret = encoding.readU48(this.data, this.offset)
        this.offset += 6
        return ret
    }

    /**
     * Read uint48be.
     */
    public readU48BE(): number {
        this.check(6)
        const ret = encoding.readU48BE(this.data, this.offset)
        this.offset += 6
        return ret
    }

    /**
     * Read uint56le.
     */
    public readU56(): number {
        this.check(7)
        const ret = encoding.readU56(this.data, this.offset)
        this.offset += 7
        return ret
    }

    /**
     * Read uint56be.
     */
    public readU56BE(): number {
        this.check(7)
        const ret = encoding.readU56BE(this.data, this.offset)
        this.offset += 7
        return ret
    }

    /**
     * Read uint64le as a js number.
     * @throws on num > MAX_SAFE_INTEGER
     */
    public readU64(): number {
        this.check(8)
        const ret = encoding.readU64(this.data, this.offset)
        this.offset += 8
        return ret
    }

    /**
     * Read uint64be as a js number.
     * @throws on num > MAX_SAFE_INTEGER
     */
    public readU64BE(): number {
        this.check(8)
        const ret = encoding.readU64BE(this.data, this.offset)
        this.offset += 8
        return ret
    }

    /**
     * Read int8.
     */
    public readI8(): number {
        this.check(1)
        const ret = encoding.readI8(this.data, this.offset)
        this.offset += 1
        return ret
    }

    /**
     * Read int16le.
     */
    public readI16(): number {
        this.check(2)
        const ret = encoding.readI16(this.data, this.offset)
        this.offset += 2
        return ret
    }

    /**
     * Read int16be.
     */
    public readI16BE(): number {
        this.check(2)
        const ret = encoding.readI16BE(this.data, this.offset)
        this.offset += 2
        return ret
    }

    /**
     * Read int24le.
     */
    public readI24(): number {
        this.check(3)
        const ret = encoding.readI24(this.data, this.offset)
        this.offset += 3
        return ret
    }

    /**
     * Read int24be.
     */
    public readI24BE(): number {
        this.check(3)
        const ret = encoding.readI24BE(this.data, this.offset)
        this.offset += 3
        return ret
    }

    /**
     * Read int32le.
     */
    public readI32(): number {
        this.check(4)
        const ret = encoding.readI32(this.data, this.offset)
        this.offset += 4
        return ret
    }

    /**
     * Read int32be.
     */
    public readI32BE(): number {
        this.check(4)
        const ret = encoding.readI32BE(this.data, this.offset)
        this.offset += 4
        return ret
    }

    /**
     * Read int40le.
     */
    public readI40(): number {
        this.check(5)
        const ret = encoding.readI40(this.data, this.offset)
        this.offset += 5
        return ret
    }

    /**
     * Read int40be.
     */
    public readI40BE(): number {
        this.check(5)
        const ret = encoding.readI40BE(this.data, this.offset)
        this.offset += 5
        return ret
    }

    /**
     * Read int48le.
     */
    public readI48(): number {
        this.check(6)
        const ret = encoding.readI48(this.data, this.offset)
        this.offset += 6
        return ret
    }

    /**
     * Read int48be.
     */
    public readI48BE(): number {
        this.check(6)
        const ret = encoding.readI48BE(this.data, this.offset)
        this.offset += 6
        return ret
    }

    /**
     * Read int56le.
     */
    public readI56(): number {
        this.check(7)
        const ret = encoding.readI56(this.data, this.offset)
        this.offset += 7
        return ret
    }

    /**
     * Read int56be.
     */
    public readI56BE(): number {
        this.check(7)
        const ret = encoding.readI56BE(this.data, this.offset)
        this.offset += 7
        return ret
    }

    /**
     * Read int64le as a js number.
     * @throws on num > MAX_SAFE_INTEGER
     */

    public readI64(): number {
        this.check(8)
        const ret = encoding.readI64(this.data, this.offset)
        this.offset += 8
        return ret
    }

    /**
     * Read int64be as a js number.
     * @throws on num > MAX_SAFE_INTEGER
     */
    public readI64BE(): number {
        this.check(8)
        const ret = encoding.readI64BE(this.data, this.offset)
        this.offset += 8
        return ret
    }

    /**
     * Read float le.
     */
    public readFloat(): number {
        this.check(4)
        const ret = encoding.readFloat(this.data, this.offset)
        this.offset += 4
        return ret
    }

    /**
     * Read float be.
     */
    public readFloatBE(): number {
        this.check(4)
        const ret = encoding.readFloatBE(this.data, this.offset)
        this.offset += 4
        return ret
    }

    /**
     * Read double float le.
     */
    public readDouble(): number {
        this.check(8)
        const ret = encoding.readDouble(this.data, this.offset)
        this.offset += 8
        return ret
    }

    /**
     * Read double float be.
     */
    public readDoubleBE(): number {
        this.check(8)
        const ret = encoding.readDoubleBE(this.data, this.offset)
        this.offset += 8
        return ret
    }

    /**
     * Read a varint.
     */
    public readVarint(): number {
        const { size, value } = encoding.readVarint(this.data, this.offset)
        this.offset += size
        return value
    }

    /**
     * Read a varint (type 2).
     */
    public readVarint2(): number {
        const { size, value } = encoding.readVarint2(this.data, this.offset)
        this.offset += size
        return value
    }

    /**
     * Read N bytes (will do a fast slice if zero copy).
     * @param size
     * @param zeroCopy - Do a fast buffer
     * slice instead of allocating a new buffer (warning:
     * may cause memory leaks if not used with care).
     */
    public readBytes(size: number, zeroCopy = false): Buffer {
        enforce(size >>> 0 === size, 'size', 'integer')
        enforce(typeof zeroCopy === 'boolean', 'zeroCopy', 'boolean')

        this.check(size)

        let ret
        if (this.zeroCopy || zeroCopy) {
            ret = this.data.slice(this.offset, this.offset + size)
        } else {
            ret = Buffer.allocUnsafe(size)
            this.data.copy(ret, 0, this.offset, this.offset + size)
        }

        this.offset += size

        return ret
    }

    /**
     * Read a varint number of bytes (will do a fast slice if zero copy).
     * @param zeroCopy - Do a fast buffer
     * slice instead of allocating a new buffer (warning:
     * may cause memory leaks if not used with care).
     */
    public readVarBytes(zeroCopy = false): Buffer {
        return this.readBytes(this.readVarint(), zeroCopy)
    }

    /**
     * Slice N bytes and create a child reader.
     * @param size
     */

    public readChild(size: number): BufferReader {
        enforce(size >>> 0 === size, 'size', 'integer')

        this.check(size)

        const data = this.data.slice(0, this.offset + size)

        const br = new BufferReader(data)
        br.offset = this.offset

        this.offset += size

        return br
    }

    /**
     * Read a string.
     * @param size
     * @param enc - Any buffer-supported encoding.
     */

    public readString(size: number, enc: BufferEncoding = 'binary'): string {
        enforce(size >>> 0 === size, 'size', 'integer')
        enforce(typeof enc === 'string', 'enc', 'string')

        this.check(size)

        const ret = this.data.toString(enc, this.offset, this.offset + size)

        this.offset += size

        return ret
    }

    /**
     * Read a 32-byte hash.
     * @param enc - Any buffer-supported encoding.
     */
    public readHash(enc?: BufferEncoding): Buffer | string {
        if (enc) {
            return this.readString(32, enc)
        }
        return this.readBytes(32)
    }

    /**
     * Read string of a varint length.
     * @param enc - Any buffer-supported encoding.
     * @param limit - Size limit.
     */
    public readVarString(enc: BufferEncoding = 'binary', limit = 0): string {
        enforce(typeof enc === 'string', 'enc', 'string')
        enforce(limit >>> 0 === limit, 'limit', 'integer')

        const size = this.readVarint()

        if (limit !== 0 && size > limit) {
            throw new EncodingError(this.offset, 'String exceeds limit')
        }

        return this.readString(size, enc)
    }

    /**
     * Read a null-terminated string.
     * @param enc - Any buffer-supported encoding.
     */
    public readNullString(enc: BufferEncoding = 'binary'): string {
        enforce(typeof enc === 'string', 'enc', 'string')

        let i = this.offset

        for (; i < this.data.length; i++) {
            if (this.data[i] === 0) {
                break
            }
        }

        if (i === this.data.length) {
            throw new EncodingError(this.offset, 'No NUL terminator')
        }

        const ret = this.readString(i - this.offset, enc)

        this.offset = i + 1

        return ret
    }

    /**
     * Create a checksum from the last start position.
     * @param hash
     * @returns Checksum.
     */
    // tslint:disable-next-line: ban-types
    public createChecksum(hash: Function): number {
        enforce(typeof hash === 'function', 'hash', 'function')

        let start = 0

        if (this.stack.length > 0) {
            start = this.stack[this.stack.length - 1]
        }

        const data = this.data.slice(start, this.offset)

        return encoding.readU32(hash(data), 0)
    }

    /**
     * Verify a 4-byte checksum against a calculated checksum.
     * @param hash
     * @returns checksum
     * @throws on bad checksum
     */
    // tslint:disable-next-line: ban-types
    public verifyChecksum(hash: Function): number {
        const checksum = this.createChecksum(hash)
        const expect = this.readU32()

        if (checksum !== expect) {
            throw new EncodingError(this.offset, 'Checksum mismatch')
        }

        return checksum
    }
}
