import * as encoding from './encoding'
import { enforce } from './enforce'
import { EncodingError } from './error'

/*
 * Constants
 */
const EMPTY = Buffer.alloc(0)
const POOL_SIZE = 100 << 10

let POOL: Buffer | null = null

/**
 * Statically Allocated Writer
 */
export class StaticWriter {
    /**
     * Buffer writer data.
     */
    public data: Buffer = EMPTY

    /**
     * Buffer writer cursor.
     */
    public offset = 0

    /**
     * Statically allocated buffer writer.
     * @constructor
     * @param options
     */
    constructor(options?: Buffer | number) {
        if (options) {
            this.init(options)
        }
    }

    /**
     * Assertion.
     * @param size
     */
    public check(size: number): void {
        if (this.offset + size > this.data.length) {
            throw new EncodingError(this.offset, 'Out of bounds write', this.check)
        }
    }

    /**
     * Initialize options.
     * @param options
     */
    public init(options: Buffer | number): StaticWriter {
        if (Buffer.isBuffer(options)) {
            this.data = options
            this.offset = 0
            return this
        }

        enforce(options >>> 0 === options, 'size', 'integer')

        this.data = Buffer.allocUnsafe(options)
        this.offset = 0

        return this
    }

    /**
     * Allocate writer from preallocated 100kb pool.
     * @param size
     */
    public static pool(size: number): StaticWriter {
        enforce(size >>> 0 === size, 'size', 'integer')

        if (size <= POOL_SIZE) {
            if (!POOL) {
                POOL = Buffer.allocUnsafe(POOL_SIZE)
            }

            const bw = new StaticWriter()
            bw.data = POOL.slice(0, size)
            return bw
        }

        return new StaticWriter(size)
    }

    /**
     * Allocate and render the final buffer.
     * @returns Rendered buffer.
     */
    public render(): Buffer {
        const { data, offset } = this

        if (offset !== data.length) {
            throw new EncodingError(offset, 'Out of bounds write')
        }

        this.destroy()

        return data
    }

    /**
     * Slice the final buffer at written offset.
     * @returns Rendered buffer.
     */
    public slice(): Buffer {
        const { data, offset } = this

        if (offset > data.length) {
            throw new EncodingError(offset, 'Out of bounds write')
        }

        this.destroy()

        return data.slice(0, offset)
    }

    /**
     * Get size of data written so far.
     */
    public getSize(): number {
        return this.offset
    }

    /**
     * Seek to relative offset.
     * @param off
     */
    public seek(off: number): StaticWriter {
        enforce(Number.isSafeInteger(off), 'off', 'integer')

        if (this.offset + off < 0) {
            throw new EncodingError(this.offset, 'Out of bounds write')
        }

        this.check(off)
        this.offset += off

        return this
    }

    /**
     * Destroy the buffer writer.
     */
    public destroy(): StaticWriter {
        this.data = EMPTY
        this.offset = 0
        return this
    }

    /**
     * Write uint8.
     * @param value
     */
    public writeU8(value: number): StaticWriter {
        this.check(1)
        this.offset = encoding.writeU8(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint16le.
     * @param value
     */
    public writeU16(value: number): StaticWriter {
        this.check(2)
        this.offset = encoding.writeU16(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint16be.
     * @param value
     */
    public writeU16BE(value: number): StaticWriter {
        this.check(2)
        this.offset = encoding.writeU16BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint24le.
     * @param value
     */
    public writeU24(value: number): StaticWriter {
        this.check(3)
        this.offset = encoding.writeU24(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint24be.
     * @param value
     */
    public writeU24BE(value: number): StaticWriter {
        this.check(3)
        this.offset = encoding.writeU24BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint32le.
     * @param value
     */

    public writeU32(value: number): StaticWriter {
        this.check(4)
        this.offset = encoding.writeU32(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint32be.
     * @param value
     */

    public writeU32BE(value: number): StaticWriter {
        this.check(4)
        this.offset = encoding.writeU32BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint40le.
     * @param value
     */

    public writeU40(value: number): StaticWriter {
        this.check(5)
        this.offset = encoding.writeU40(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint40be.
     * @param value
     */
    public writeU40BE(value: number): StaticWriter {
        this.check(5)
        this.offset = encoding.writeU40BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint48le.
     * @param value
     */
    public writeU48(value: number): StaticWriter {
        this.check(6)
        this.offset = encoding.writeU48(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint48be.
     * @param value
     */
    public writeU48BE(value: number): StaticWriter {
        this.check(6)
        this.offset = encoding.writeU48BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint56le.
     * @param value
     */
    public writeU56(value: number): StaticWriter {
        this.check(7)
        this.offset = encoding.writeU56(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint56be.
     * @param value
     */
    public writeU56BE(value: number): StaticWriter {
        this.check(7)
        this.offset = encoding.writeU56BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint64le.
     * @param value
     */
    public writeU64(value: number): StaticWriter {
        this.check(8)
        this.offset = encoding.writeU64(this.data, value, this.offset)
        return this
    }

    /**
     * Write uint64be.
     * @param value
     */
    public writeU64BE(value: number): StaticWriter {
        this.check(8)
        this.offset = encoding.writeU64BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write int8.
     * @param value
     */
    public writeI8(value: number): StaticWriter {
        this.check(1)
        this.offset = encoding.writeI8(this.data, value, this.offset)
        return this
    }

    /**
     * Write int16le.
     * @param value
     */
    public writeI16(value: number): StaticWriter {
        this.check(2)
        this.offset = encoding.writeI16(this.data, value, this.offset)
        return this
    }

    /**
     * Write int16be.
     * @param value
     */
    public writeI16BE(value: number): StaticWriter {
        this.check(2)
        this.offset = encoding.writeI16BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write int24le.
     * @param value
     */
    public writeI24(value: number): StaticWriter {
        this.check(3)
        this.offset = encoding.writeI24(this.data, value, this.offset)
        return this
    }

    /**
     * Write int24be.
     * @param value
     */
    public writeI24BE(value: number): StaticWriter {
        this.check(3)
        this.offset = encoding.writeI24BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write int32le.
     * @param value
     */
    public writeI32(value: number): StaticWriter {
        this.check(4)
        this.offset = encoding.writeI32(this.data, value, this.offset)
        return this
    }

    /**
     * Write int32be.
     * @param value
     */
    public writeI32BE(value: number): StaticWriter {
        this.check(4)
        this.offset = encoding.writeI32BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write int40le.
     * @param value
     */
    public writeI40(value: number): StaticWriter {
        this.check(5)
        this.offset = encoding.writeI40(this.data, value, this.offset)
        return this
    }

    /**
     * Write int40be.
     * @param value
     */
    public writeI40BE(value: number): StaticWriter {
        this.check(5)
        this.offset = encoding.writeI40BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write int48le.
     * @param value
     */
    public writeI48(value: number): StaticWriter {
        this.check(6)
        this.offset = encoding.writeI48(this.data, value, this.offset)
        return this
    }

    /**
     * Write int48be.
     * @param value
     */
    public writeI48BE(value: number): StaticWriter {
        this.check(6)
        this.offset = encoding.writeI48BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write int56le.
     * @param value
     */
    public writeI56(value: number): StaticWriter {
        this.check(7)
        this.offset = encoding.writeI56(this.data, value, this.offset)
        return this
    }

    /**
     * Write int56be.
     * @param value
     */
    public writeI56BE(value: number): StaticWriter {
        this.check(7)
        this.offset = encoding.writeI56BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write int64le.
     * @param value
     */
    public writeI64(value: number): StaticWriter {
        this.check(8)
        this.offset = encoding.writeI64(this.data, value, this.offset)
        return this
    }

    /**
     * Write int64be.
     * @param value
     */
    public writeI64BE(value: number): StaticWriter {
        this.check(8)
        this.offset = encoding.writeI64BE(this.data, value, this.offset)
        return this
    }

    /**
     * Write float le.
     * @param value
     */
    public writeFloat(value: number): StaticWriter {
        this.check(4)
        this.offset = encoding.writeFloat(this.data, value, this.offset)
        return this
    }

    /**
     * Write float be.
     * @param value
     */
    public writeFloatBE(value: number): StaticWriter {
        this.check(4)
        this.offset = encoding.writeFloatBE(this.data, value, this.offset)
        return this
    }

    /**
     * Write double le.
     * @param value
     */
    public writeDouble(value: number): StaticWriter {
        this.check(8)
        this.offset = encoding.writeDouble(this.data, value, this.offset)
        return this
    }

    /**
     * Write double be.
     * @param value
     */
    public writeDoubleBE(value: number): StaticWriter {
        this.check(8)
        this.offset = encoding.writeDoubleBE(this.data, value, this.offset)
        return this
    }

    /**
     * Write a varint.
     * @param value
     */
    public writeVarint(value: number): StaticWriter {
        this.offset = encoding.writeVarint(this.data, value, this.offset)
        return this
    }

    /**
     * Write a varint (type 2).
     * @param value
     */
    public writeVarint2(value: number): StaticWriter {
        this.offset = encoding.writeVarint2(this.data, value, this.offset)
        return this
    }

    /**
     * Write bytes.
     * @param value
     */
    public writeBytes(value: Buffer): StaticWriter {
        enforce(Buffer.isBuffer(value), 'value', 'buffer')
        this.check(value.length)
        this.offset += value.copy(this.data, this.offset)
        return this
    }

    /**
     * Write bytes with a varint length before them.
     * @param value
     */

    public writeVarBytes(value: Buffer): StaticWriter {
        enforce(Buffer.isBuffer(value), 'value', 'buffer')
        this.writeVarint(value.length)
        this.writeBytes(value)
        return this
    }

    /**
     * Copy bytes.
     * @param value
     * @param start
     * @param end
     */
    public copy(value: Buffer, start: number, end: number): StaticWriter {
        enforce(Buffer.isBuffer(value), 'value', 'buffer')
        enforce(start >>> 0 === start, 'start', 'integer')
        enforce(end >>> 0 === end, 'end', 'integer')
        enforce(end >= start, 'start', 'integer')

        this.check(end - start)
        this.offset += value.copy(this.data, this.offset, start, end)

        return this
    }

    /**
     * Write string to buffer.
     * @param value
     * @param enc - Any buffer-supported encoding.
     */
    public writeString(value: string, enc: BufferEncoding = 'binary'): StaticWriter {
        enforce(typeof value === 'string', 'value', 'string')
        enforce(typeof enc === 'string', 'enc', 'string')

        if (value.length === 0) {
            return this
        }

        const size = Buffer.byteLength(value, enc)
        this.check(size)

        this.offset += this.data.write(value, this.offset, enc)

        return this
    }

    /**
     * Write a 32 byte hash.
     * @param value
     */
    public writeHash(value: Buffer | string): StaticWriter {
        if (typeof value !== 'string') {
            enforce(Buffer.isBuffer(value), 'value', 'buffer')
            enforce(value.length === 32, 'value', '32-byte hash')
            this.writeBytes(value)
            return this
        }
        enforce(value.length === 64, 'value', '32-byte hash')
        this.check(32)
        this.offset += this.data.write(value, this.offset, 'hex')
        return this
    }

    /**
     * Write a string with a varint length before it.
     * @param value
     * @param enc - Any buffer-supported encoding.
     */
    public writeVarString(value: string, enc: BufferEncoding = 'binary'): StaticWriter {
        enforce(typeof value === 'string', 'value', 'string')
        enforce(typeof enc === 'string', 'enc', 'string')

        if (value.length === 0) {
            this.writeVarint(0)
            return this
        }

        const size = Buffer.byteLength(value, enc)

        this.writeVarint(size)
        this.check(size)
        this.offset += this.data.write(value, this.offset, enc)

        return this
    }

    /**
     * Write a null-terminated string.
     * @param value
     * @param enc - Any buffer-supported encoding.
     */
    public writeNullString(value: string, enc: BufferEncoding = 'binary'): StaticWriter {
        this.writeString(value, enc)
        this.writeU8(0)
        return this
    }

    /**
     * Calculate and write a checksum for the data written so far.
     * @param {Function} hash
     */
    // tslint:disable-next-line: ban-types
    public writeChecksum(hash: Function): StaticWriter {
        enforce(typeof hash === 'function', 'hash', 'function')

        this.check(4)

        const data = this.data.slice(0, this.offset)

        hash(data).copy(this.data, this.offset, 0, 4)

        this.offset += 4

        return this
    }

    /**
     * Fill N bytes with value.
     * @param value
     * @param size
     */
    public fill(value: number, size: number): StaticWriter {
        enforce((value & 0xff) === value, 'value', 'byte')
        enforce(size >>> 0 === size, 'size', 'integer')

        this.check(size)

        this.data.fill(value, this.offset, this.offset + size)
        this.offset += size

        return this
    }
}
