import { enforce } from './enforce'
import { BufferReader } from './reader'
import { StaticWriter } from './staticwriter'
import { BufferWriter } from './writer'

/**
 * Serializable struct
 */
export class Struct {
    /**
     * Create a struct.
     * @param data
     */
    constructor(_: Partial<object> = {}) {
        // ..
    }

    /**
     * Override to define the deserialization instructions.
     * @returns Plain object.
     */
    public static read(_: BufferReader): Partial<object> {
        return {}
    }

    /**
     * Instantiate struct from buffer.
     * @returns Instance.
     */
    public static fromBuffer(data: Buffer): Struct {
        enforce(Buffer.isBuffer(data), 'data', 'buffer')
        const br = new BufferReader(data)
        return new this(this.read(br))
    }

    /**
     * Instantiate struct from hex.
     * @returns Instance.
     */
    public static fromHex(str: string): Struct {
        enforce(typeof str === 'string', 'str', 'string')
        const size = str.length >>> 1
        const data = Buffer.from(str, 'hex')

        if (data.length !== size) {
            throw new Error('Invalid hex string.')
        }

        return this.fromBuffer(data)
    }

    /**
     * Instantiate struct from base64.
     * @returns Instance.
     */
    public static fromBase64(str: string): Struct {
        enforce(typeof str === 'string', 'str', 'string')
        const data = Buffer.from(str, 'base64')

        if (str.length > size64(data.length)) {
            throw new Error('Invalid base64 string.')
        }

        return this.fromBuffer(data)
    }

    /**
     * Calculate size of serialized struct.
     * Override for statically allocated writer.
     * @returns Size.
     */
    public getSize(): number {
        return -1
    }

    /**
     * Override to define serialization instructions.
     * @param bw Statically allocated writer if size calculation defined.
     */
    public write(bw: BufferWriter | StaticWriter): BufferWriter | StaticWriter {
        return bw
    }

    public toBuffer(): Buffer {
        const size = this.getSize()
        const bw = size === -1 ? new BufferWriter() : new StaticWriter(size)
        this.write(bw)
        return bw.render()
    }

    public toHex(): string {
        return this.toBuffer().toString('hex')
    }

    public toBase64(): string {
        return this.toBuffer().toString('base64')
    }

    public toObject(): object {
        return (this.constructor as any).read(new BufferReader(this.toBuffer()))
    }
}

/*
 * Helpers
 */

function size64(size: number): number {
    const expect = ((4 * size) / 3 + 3) & ~3
    return expect >>> 0
}
