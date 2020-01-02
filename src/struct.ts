import { enforce } from './enforce'
import { BufferReader } from './reader'
import { StaticWriter } from './staticwriter'
import { BufferWriter } from './writer'

/**
 * Serializable struct
 */
export abstract class Struct {
    /**
     * Override to define the deserialization instructions.
     * @returns Plain object.
     */
    public static read(_br: BufferReader): object {
        return {}
    }

    /**
     * Instantiate struct from buffer.
     * @returns Instance.
     */
    public static fromBuffer<T extends Struct>(this: (new () => T) & typeof Struct, data: Buffer): T {
        enforce(Buffer.isBuffer(data), 'data', 'buffer')
        const br = new BufferReader(data)
        return this.read(br) as T
    }

    /**
     * Instantiate struct from hex.
     * @returns Instance.
     */
    public static fromHex<T extends Struct>(this: (new () => T) & typeof Struct, str: string): T {
        enforce(typeof str === 'string', 'str', 'string')
        const size = str.length >>> 1
        const data = Buffer.from(str, 'hex')

        if (data.length !== size) {
            throw new Error('Invalid hex string.')
        }

        return this.fromBuffer(data) as T
    }

    /**
     * Instantiate struct from base64.
     * @returns Instance.
     */
    public static fromBase64<T extends Struct>(this: (new () => T) & typeof Struct, str: string): T {
        enforce(typeof str === 'string', 'str', 'string')
        const data = Buffer.from(str, 'base64')

        if (str.length > size64(data.length)) {
            throw new Error('Invalid base64 string.')
        }

        return this.fromBuffer(data) as T
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

    /**
     * Convert to buffer.
     */
    public toBuffer(): Buffer {
        const size = this.getSize()
        const bw = size === -1 ? new BufferWriter() : new StaticWriter(size)
        this.write(bw)
        return bw.render()
    }

    /**
     * Convert to hex.
     */
    public toHex(): string {
        return this.toBuffer().toString('hex')
    }

    /**
     * Convert to base64.
     */
    public toBase64(): string {
        return this.toBuffer().toString('base64')
    }
}

/*
 * Helpers
 */

function size64(size: number): number {
    const expect = ((4 * size) / 3 + 3) & ~3
    return expect >>> 0
}
