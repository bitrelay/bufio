import { custom } from './custom'
import { enforce } from './enforce'
import { BufferReader } from './reader'
import { StaticWriter } from './staticwriter'
import { BufferWriter } from './writer'

/**
 * Struct
 */
export class Struct {
    constructor() {
        // ..
    }

    public inject(obj: Struct): Struct {
        enforce(obj instanceof this.constructor, 'obj', 'struct')
        return this.decode(obj.encode())
    }

    public clone(): Struct {
        const copy = new Struct()
        return copy.inject(this)
    }

    /*
     * Bindable
     */

    public getSize(): number {
        return -1
    }

    public write(bw: BufferWriter | StaticWriter): BufferWriter | StaticWriter {
        return bw
    }

    public read(_br: BufferReader): Struct {
        return this
    }

    public toString(): string {
        return Object.prototype.toString.call(this)
    }

    public fromString(_str: string): Struct {
        return this
    }

    public getJSON(): object {
        return {}
    }

    public fromJSON(_json: object): Struct {
        return this
    }

    public fromOptions(_options: any): Struct {
        return this
    }

    public from(_options: any): Struct {
        return this.fromOptions(_options)
    }

    public format(): object {
        return this.getJSON()
    }

    /*
     * API
     */

    public encode(): Buffer {
        const size = this.getSize()
        const bw = size === -1 ? new BufferWriter() : new StaticWriter(size)
        this.write(bw)
        return bw.render()
    }

    public decode(data: Buffer): Struct {
        const br = new BufferReader(data)
        this.read(br)
        return this
    }

    public toHex(): string {
        return this.encode().toString('hex')
    }

    public fromHex(str: string): Struct {
        enforce(typeof str === 'string', 'str', 'string')

        const size = str.length >>> 1
        const data = Buffer.from(str, 'hex')

        if (data.length !== size) {
            throw new Error('Invalid hex string.')
        }

        return this.decode(data)
    }

    public toBase64(): string {
        return this.encode().toString('base64')
    }

    public fromBase64(str: string): Struct {
        enforce(typeof str === 'string', 'str', 'string')

        const data = Buffer.from(str, 'base64')

        if (str.length > size64(data.length)) {
            throw new Error('Invalid base64 string.')
        }

        return this.decode(data)
    }

    public toJSON(): object {
        return this.getJSON()
    }

    public [custom](): object {
        return this.format()
    }

    /*
     * Static API
     */

    public static read(br: BufferReader): Struct {
        return new this().read(br)
    }

    public static decode(data: Buffer): Struct {
        return new this().decode(data)
    }

    public static fromHex(str: string): Struct {
        return new this().fromHex(str)
    }

    public static fromBase64(str: string): Struct {
        return new this().fromBase64(str)
    }

    public static fromString(str: string): Struct {
        return new this().fromString(str)
    }

    public static fromJSON(json: object): Struct {
        return new this().fromJSON(json)
    }

    public static fromOptions(options: object): Struct {
        return new this().fromOptions(options)
    }

    public static from(options: object): Struct {
        return new this().from(options)
    }

    /*
     * Aliases
     */

    public toWriter(bw: BufferWriter | StaticWriter): BufferWriter | StaticWriter {
        return this.write(bw)
    }

    public fromReader(br: BufferReader): Struct {
        return this.read(br)
    }

    public toRaw(): Buffer {
        return this.encode()
    }

    public fromRaw(data: Buffer): Struct {
        return this.decode(data)
    }

    /*
     * Static Aliases
     */

    public static fromReader(br: BufferReader): Struct {
        return this.read(br)
    }

    public static fromRaw(data: Buffer): Struct {
        return this.decode(data)
    }
}

/*
 * Helpers
 */

function size64(size: number): number {
    const expect = ((4 * size) / 3 + 3) & ~3
    return expect >>> 0
}
