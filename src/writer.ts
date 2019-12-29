import * as encoding from './encoding'
import { enforce } from './enforce'
import { EncodingError } from './error'

/*
 * Constants
 */
enum Type {
    SEEK,
    U8,
    U16,
    U16BE,
    U24,
    U24BE,
    U32,
    U32BE,
    U40,
    U40BE,
    U48,
    U48BE,
    U56,
    U56BE,
    U64,
    U64BE,
    I8,
    I16,
    I16BE,
    I24,
    I24BE,
    I32,
    I32BE,
    I40,
    I40BE,
    I48,
    I48BE,
    I56,
    I56BE,
    I64,
    I64BE,
    FL,
    FLBE,
    DBL,
    DBLBE,
    VARINT,
    VARINT2,
    BYTES,
    STR,
    CHECKSUM,
    FILL,
}

/**
 * Buffer Writer
 */

export class BufferWriter {
    /**
     * Buffer writer cursor.
     */
    public offset = 0

    /**
     * Buffer writer cursor.
     */
    public ops: WriteOp[] = []

    /**
     * Create a buffer writer.
     * @constructor
     */

    constructor() {
        // ..
    }

    /**
     * Allocate and render the final buffer.
     * @returns Rendered buffer.
     */

    public render(): Buffer {
        const data = Buffer.allocUnsafe(this.offset)

        let off = 0

        for (const op of this.ops) {
            switch (op.type) {
                case Type.SEEK:
                    off += (op as NumberOp).value
                    break
                case Type.U8:
                    off = encoding.writeU8(data, (op as NumberOp).value, off)
                    break
                case Type.U16:
                    off = encoding.writeU16(data, (op as NumberOp).value, off)
                    break
                case Type.U16BE:
                    off = encoding.writeU16BE(data, (op as NumberOp).value, off)
                    break
                case Type.U24:
                    off = encoding.writeU24(data, (op as NumberOp).value, off)
                    break
                case Type.U24BE:
                    off = encoding.writeU24BE(data, (op as NumberOp).value, off)
                    break
                case Type.U32:
                    off = encoding.writeU32(data, (op as NumberOp).value, off)
                    break
                case Type.U32BE:
                    off = encoding.writeU32BE(data, (op as NumberOp).value, off)
                    break
                case Type.U40:
                    off = encoding.writeU40(data, (op as NumberOp).value, off)
                    break
                case Type.U40BE:
                    off = encoding.writeU40BE(data, (op as NumberOp).value, off)
                    break
                case Type.U48:
                    off = encoding.writeU48(data, (op as NumberOp).value, off)
                    break
                case Type.U48BE:
                    off = encoding.writeU48BE(data, (op as NumberOp).value, off)
                    break
                case Type.U56:
                    off = encoding.writeU56(data, (op as NumberOp).value, off)
                    break
                case Type.U56BE:
                    off = encoding.writeU56BE(data, (op as NumberOp).value, off)
                    break
                case Type.U64:
                    off = encoding.writeU64(data, (op as NumberOp).value, off)
                    break
                case Type.U64BE:
                    off = encoding.writeU64BE(data, (op as NumberOp).value, off)
                    break
                case Type.I8:
                    off = encoding.writeI8(data, (op as NumberOp).value, off)
                    break
                case Type.I16:
                    off = encoding.writeI16(data, (op as NumberOp).value, off)
                    break
                case Type.I16BE:
                    off = encoding.writeI16BE(data, (op as NumberOp).value, off)
                    break
                case Type.I24:
                    off = encoding.writeI24(data, (op as NumberOp).value, off)
                    break
                case Type.I24BE:
                    off = encoding.writeI24BE(data, (op as NumberOp).value, off)
                    break
                case Type.I32:
                    off = encoding.writeI32(data, (op as NumberOp).value, off)
                    break
                case Type.I32BE:
                    off = encoding.writeI32BE(data, (op as NumberOp).value, off)
                    break
                case Type.I40:
                    off = encoding.writeI40(data, (op as NumberOp).value, off)
                    break
                case Type.I40BE:
                    off = encoding.writeI40BE(data, (op as NumberOp).value, off)
                    break
                case Type.I48:
                    off = encoding.writeI48(data, (op as NumberOp).value, off)
                    break
                case Type.I48BE:
                    off = encoding.writeI48BE(data, (op as NumberOp).value, off)
                    break
                case Type.I56:
                    off = encoding.writeI56(data, (op as NumberOp).value, off)
                    break
                case Type.I56BE:
                    off = encoding.writeI56BE(data, (op as NumberOp).value, off)
                    break
                case Type.I64:
                    off = encoding.writeI64(data, (op as NumberOp).value, off)
                    break
                case Type.I64BE:
                    off = encoding.writeI64BE(data, (op as NumberOp).value, off)
                    break
                case Type.FL:
                    off = encoding.writeFloat(data, (op as NumberOp).value, off)
                    break
                case Type.FLBE:
                    off = encoding.writeFloatBE(data, (op as NumberOp).value, off)
                    break
                case Type.DBL:
                    off = encoding.writeDouble(data, (op as NumberOp).value, off)
                    break
                case Type.DBLBE:
                    off = encoding.writeDoubleBE(data, (op as NumberOp).value, off)
                    break
                case Type.VARINT:
                    off = encoding.writeVarint(data, (op as NumberOp).value, off)
                    break
                case Type.VARINT2:
                    off = encoding.writeVarint2(data, (op as NumberOp).value, off)
                    break
                case Type.BYTES:
                    off += (op as BufferOp).data.copy(data, off)
                    break
                case Type.STR:
                    off += data.write((op as StringOp).value, off, (op as StringOp).enc)
                    break
                case Type.CHECKSUM:
                    off += (op as FunctionOp).func(data.slice(0, off)).copy(data, off, 0, 4)
                    break
                case Type.FILL:
                    data.fill((op as FillOp).value, off, off + (op as FillOp).size)
                    off += (op as FillOp).size
                    break
                default:
                    throw new Error('Invalid type.')
            }
        }

        if (off !== data.length) {
            throw new EncodingError(off, 'Out of bounds write')
        }

        this.destroy()

        return data
    }

    /**
     * Get size of data written so far.
     */
    public getSize(): number {
        return this.offset
    }

    /**
     * Seek to relative offset.
     * @param offset
     */
    public seek(off: number): BufferWriter {
        enforce(Number.isSafeInteger(off), 'off', 'integer')

        if (this.offset + off < 0) {
            throw new EncodingError(this.offset, 'Out of bounds write')
        }

        this.offset += off
        this.ops.push(new NumberOp(Type.SEEK, off))

        return this
    }

    /**
     * Destroy the buffer writer. Remove references to `ops`.
     */
    public destroy(): BufferWriter {
        this.ops.length = 0
        this.offset = 0
        return this
    }

    /**
     * Write uint8.
     * @param value
     */
    public writeU8(value: number): BufferWriter {
        this.offset += 1
        this.ops.push(new NumberOp(Type.U8, value))
        return this
    }

    /**
     * Write uint16le.
     * @param value
     */
    public writeU16(value: number): BufferWriter {
        this.offset += 2
        this.ops.push(new NumberOp(Type.U16, value))
        return this
    }

    /**
     * Write uint16be.
     * @param value
     */
    public writeU16BE(value: number): BufferWriter {
        this.offset += 2
        this.ops.push(new NumberOp(Type.U16BE, value))
        return this
    }

    /**
     * Write uint24le.
     * @param value
     */
    public writeU24(value: number): BufferWriter {
        this.offset += 3
        this.ops.push(new NumberOp(Type.U24, value))
        return this
    }

    /**
     * Write uint24be.
     * @param value
     */
    public writeU24BE(value: number): BufferWriter {
        this.offset += 3
        this.ops.push(new NumberOp(Type.U24BE, value))
        return this
    }

    /**
     * Write uint32le.
     * @param value
     */
    public writeU32(value: number): BufferWriter {
        this.offset += 4
        this.ops.push(new NumberOp(Type.U32, value))
        return this
    }

    /**
     * Write uint32be.
     * @param value
     */
    public writeU32BE(value: number): BufferWriter {
        this.offset += 4
        this.ops.push(new NumberOp(Type.U32BE, value))
        return this
    }

    /**
     * Write uint40le.
     * @param value
     */
    public writeU40(value: number): BufferWriter {
        this.offset += 5
        this.ops.push(new NumberOp(Type.U40, value))
        return this
    }

    /**
     * Write uint40be.
     * @param value
     */
    public writeU40BE(value: number): BufferWriter {
        this.offset += 5
        this.ops.push(new NumberOp(Type.U40BE, value))
        return this
    }

    /**
     * Write uint48le.
     * @param value
     */
    public writeU48(value: number): BufferWriter {
        this.offset += 6
        this.ops.push(new NumberOp(Type.U48, value))
        return this
    }

    /**
     * Write uint48be.
     * @param value
     */
    public writeU48BE(value: number): BufferWriter {
        this.offset += 6
        this.ops.push(new NumberOp(Type.U48BE, value))
        return this
    }

    /**
     * Write uint56le.
     * @param value
     */
    public writeU56(value: number): BufferWriter {
        this.offset += 7
        this.ops.push(new NumberOp(Type.U56, value))
        return this
    }

    /**
     * Write uint56be.
     * @param value
     */
    public writeU56BE(value: number): BufferWriter {
        this.offset += 7
        this.ops.push(new NumberOp(Type.U56BE, value))
        return this
    }

    /**
     * Write uint64le.
     * @param value
     */
    public writeU64(value: number): BufferWriter {
        this.offset += 8
        this.ops.push(new NumberOp(Type.U64, value))
        return this
    }

    /**
     * Write uint64be.
     * @param value
     */
    public writeU64BE(value: number): BufferWriter {
        this.offset += 8
        this.ops.push(new NumberOp(Type.U64BE, value))
        return this
    }

    /**
     * Write int8.
     * @param value
     */
    public writeI8(value: number): BufferWriter {
        this.offset += 1
        this.ops.push(new NumberOp(Type.I8, value))
        return this
    }

    /**
     * Write int16le.
     * @param value
     */
    public writeI16(value: number): BufferWriter {
        this.offset += 2
        this.ops.push(new NumberOp(Type.I16, value))
        return this
    }

    /**
     * Write int16be.
     * @param value
     */
    public writeI16BE(value: number): BufferWriter {
        this.offset += 2
        this.ops.push(new NumberOp(Type.I16BE, value))
        return this
    }

    /**
     * Write int24le.
     * @param value
     */
    public writeI24(value: number): BufferWriter {
        this.offset += 3
        this.ops.push(new NumberOp(Type.I24, value))
        return this
    }

    /**
     * Write int24be.
     * @param value
     */
    public writeI24BE(value: number): BufferWriter {
        this.offset += 3
        this.ops.push(new NumberOp(Type.I24BE, value))
        return this
    }

    /**
     * Write int32le.
     * @param value
     */
    public writeI32(value: number): BufferWriter {
        this.offset += 4
        this.ops.push(new NumberOp(Type.I32, value))
        return this
    }

    /**
     * Write int32be.
     * @param value
     */
    public writeI32BE(value: number): BufferWriter {
        this.offset += 4
        this.ops.push(new NumberOp(Type.I32BE, value))
        return this
    }

    /**
     * Write int40le.
     * @param value
     */
    public writeI40(value: number): BufferWriter {
        this.offset += 5
        this.ops.push(new NumberOp(Type.I40, value))
        return this
    }

    /**
     * Write int40be.
     * @param value
     */
    public writeI40BE(value: number): BufferWriter {
        this.offset += 5
        this.ops.push(new NumberOp(Type.I40BE, value))
        return this
    }

    /**
     * Write int48le.
     * @param value
     */
    public writeI48(value: number): BufferWriter {
        this.offset += 6
        this.ops.push(new NumberOp(Type.I48, value))
        return this
    }

    /**
     * Write int48be.
     * @param value
     */
    public writeI48BE(value: number): BufferWriter {
        this.offset += 6
        this.ops.push(new NumberOp(Type.I48BE, value))
        return this
    }

    /**
     * Write int56le.
     * @param value
     */
    public writeI56(value: number): BufferWriter {
        this.offset += 7
        this.ops.push(new NumberOp(Type.I56, value))
        return this
    }

    /**
     * Write int56be.
     * @param value
     */
    public writeI56BE(value: number): BufferWriter {
        this.offset += 7
        this.ops.push(new NumberOp(Type.I56BE, value))
        return this
    }

    /**
     * Write int64le.
     * @param value
     */
    public writeI64(value: number): BufferWriter {
        this.offset += 8
        this.ops.push(new NumberOp(Type.I64, value))
        return this
    }

    /**
     * Write int64be.
     * @param value
     */
    public writeI64BE(value: number): BufferWriter {
        this.offset += 8
        this.ops.push(new NumberOp(Type.I64BE, value))
        return this
    }

    /**
     * Write float le.
     * @param value
     */
    public writeFloat(value: number): BufferWriter {
        this.offset += 4
        this.ops.push(new NumberOp(Type.FL, value))
        return this
    }

    /**
     * Write float be.
     * @param value
     */
    public writeFloatBE(value: number): BufferWriter {
        this.offset += 4
        this.ops.push(new NumberOp(Type.FLBE, value))
        return this
    }

    /**
     * Write double le.
     * @param value
     */
    public writeDouble(value: number): BufferWriter {
        this.offset += 8
        this.ops.push(new NumberOp(Type.DBL, value))
        return this
    }

    /**
     * Write double be.
     * @param value
     */
    public writeDoubleBE(value: number): BufferWriter {
        this.offset += 8
        this.ops.push(new NumberOp(Type.DBLBE, value))
        return this
    }

    /**
     * Write a varint.
     * @param value
     */
    public writeVarint(value: number): BufferWriter {
        this.offset += encoding.sizeVarint(value)
        this.ops.push(new NumberOp(Type.VARINT, value))
        return this
    }

    /**
     * Write a varint (type 2).
     * @param value
     */
    public writeVarint2(value: number): BufferWriter {
        this.offset += encoding.sizeVarint2(value)
        this.ops.push(new NumberOp(Type.VARINT2, value))
        return this
    }

    /**
     * Write bytes.
     * @param value
     */
    public writeBytes(value: Buffer): BufferWriter {
        enforce(Buffer.isBuffer(value), 'value', 'buffer')

        if (value.length === 0) {
            return this
        }

        this.offset += value.length
        this.ops.push(new BufferOp(Type.BYTES, value))

        return this
    }

    /**
     * Write bytes with a varint length before them.
     * @param value
     */
    public writeVarBytes(value: Buffer): BufferWriter {
        enforce(Buffer.isBuffer(value), 'value', 'buffer')

        this.offset += encoding.sizeVarint(value.length)
        this.ops.push(new NumberOp(Type.VARINT, value.length))

        if (value.length === 0) {
            return this
        }

        this.offset += value.length
        this.ops.push(new BufferOp(Type.BYTES, value))

        return this
    }

    /**
     * Copy bytes.
     * @param value
     * @param start
     * @param end
     */
    public copy(value: Buffer, start: number, end: number): BufferWriter {
        enforce(Buffer.isBuffer(value), 'value', 'buffer')
        enforce(start >>> 0 === start, 'start', 'integer')
        enforce(end >>> 0 === end, 'end', 'integer')
        enforce(end >= start, 'start', 'integer')

        const buf = value.slice(start, end)

        this.writeBytes(buf)

        return this
    }

    /**
     * Write string to buffer.
     * @param value
     * @param enc - Any buffer-supported encoding.
     */
    public writeString(value: string, enc: BufferEncoding = 'binary'): BufferWriter {
        enforce(typeof value === 'string', 'value', 'string')
        enforce(typeof enc === 'string', 'enc', 'string')

        if (value.length === 0) {
            return this
        }

        this.offset += Buffer.byteLength(value, enc)
        this.ops.push(new StringOp(Type.STR, value, enc))

        return this
    }

    /**
     * Write a 32 byte hash.
     * @param value
     */
    public writeHash(value: Buffer | string): BufferWriter {
        if (typeof value !== 'string') {
            enforce(Buffer.isBuffer(value), 'value', 'buffer')
            enforce(value.length === 32, 'value', '32-byte hash')
            this.writeBytes(value)
            return this
        }
        enforce(value.length === 64, 'value', '32-byte hash')
        this.writeString(value, 'hex')
        return this
    }

    /**
     * Write a string with a varint length before it.
     * @param value
     * @param enc - Any buffer-supported encoding.
     */
    public writeVarString(value: string, enc: BufferEncoding = 'binary'): BufferWriter {
        enforce(typeof value === 'string', 'value', 'string')
        enforce(typeof enc === 'string', 'enc', 'string')

        if (value.length === 0) {
            this.ops.push(new NumberOp(Type.VARINT, 0))
            return this
        }

        const size = Buffer.byteLength(value, enc)

        this.offset += encoding.sizeVarint(size)
        this.offset += size

        this.ops.push(new NumberOp(Type.VARINT, size))
        this.ops.push(new StringOp(Type.STR, value, enc))

        return this
    }

    /**
     * Write a null-terminated string.
     * @param value
     * @param enc - Any buffer-supported encoding.
     */
    public writeNullString(value: string, enc: BufferEncoding = 'binary'): BufferWriter {
        this.writeString(value, enc)
        this.writeU8(0)
        return this
    }

    /**
     * Calculate and write a checksum for the data written so far.
     * @param hash
     */
    // tslint:disable-next-line: ban-types
    public writeChecksum(hash: Function): BufferWriter {
        enforce(typeof hash === 'function', 'hash', 'function')
        this.offset += 4
        this.ops.push(new FunctionOp(Type.CHECKSUM, hash))
        return this
    }

    /**
     * Fill N bytes with value.
     * @param value
     * @param size
     */

    public fill(value: number, size: number): BufferWriter {
        enforce((value & 0xff) === value, 'value', 'byte')
        enforce(size >>> 0 === size, 'size', 'integer')

        if (size === 0) {
            return this
        }

        this.offset += size
        this.ops.push(new FillOp(Type.FILL, value, size))

        return this
    }
}

/*
 * Helpers
 */

class WriteOp {
    constructor(public type: Type) {}
}

class NumberOp extends WriteOp {
    constructor(type: Type, public value: number) {
        super(type)
    }
}

class BufferOp extends WriteOp {
    constructor(type: Type, public data: Buffer) {
        super(type)
    }
}

class StringOp extends WriteOp {
    constructor(type: Type, public value: string, public enc: BufferEncoding) {
        super(type)
    }
}

class FunctionOp extends WriteOp {
    // tslint:disable-next-line: ban-types
    constructor(type: Type, public func: Function) {
        super(type)
    }
}

class FillOp extends WriteOp {
    constructor(type: Type, public value: number, public size: number) {
        super(type)
    }
}
