import * as assert from 'assert'
import { BufferReader, BufferWriter, Struct } from '../index'

class Parent extends Struct {
    public str: string

    public value: number

    public children: Child[] = []

    constructor(data: Partial<Parent> = {}) {
        super()
        Object.assign(this, data)
    }

    public write(bw: BufferWriter): BufferWriter {
        bw.writeVarString(this.str, 'ascii')
        bw.writeU64(this.value)
        bw.writeVarint(this.children.length)
        for (const child of this.children) {
            child.write(bw)
        }
        return bw
    }

    public static read(br: BufferReader): Parent {
        const str = br.readVarString('ascii')
        const value = br.readU64()
        const childCount = br.readVarint()
        const children: Child[] = []
        for (let i = 0; i < childCount; i++) {
            children.push(Child.read(br))
        }
        return new this({ str, value, children })
    }
}

class Child extends Struct {
    public foo: string

    public bar: number

    constructor(data: Partial<Child> = {}) {
        super()
        if (data.foo) {
            this.foo = data.foo
        }
        if (data.bar) {
            this.bar = data.bar
        }
    }

    public write(bw: BufferWriter): BufferWriter {
        bw.writeVarString(this.foo, 'ascii')
        bw.writeU64(this.bar)
        return bw
    }

    public static read(br: BufferReader): Child {
        return new this({
            foo: br.readVarString('ascii'),
            bar: br.readU64(),
        })
    }
}

describe('Struct', () => {
    it('should pass', () => {
        const parent = new Parent({
            str: 'anything',
            value: 66,
            children: [
                new Child({
                    foo: 'one',
                    bar: 11,
                }),
                new Child({
                    foo: 'another',
                    bar: 16,
                }),
            ],
        })
        assert.deepStrictEqual(Parent.fromBuffer(parent.toBuffer()), parent)
        assert.strictEqual(
            parent.toHex(),
            '08616e797468696e67420000000000000002036f6e650b0000000000000007616e6f746865721000000000000000'
        )
        assert.deepStrictEqual(Parent.fromHex(parent.toHex()), parent)
        assert.strictEqual(parent.toBase64(), 'CGFueXRoaW5nQgAAAAAAAAACA29uZQsAAAAAAAAAB2Fub3RoZXIQAAAAAAAAAA==')
        assert.deepStrictEqual(Parent.fromBase64(parent.toBase64()), parent)
    })
})
