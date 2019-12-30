import * as assert from 'assert'
import { BufferReader, BufferWriter, Struct } from '../index'

interface ParentSchema {
    str: string
    value: number
    childs: ChildSchema[]
}

class Parent extends Struct implements ParentSchema {
    public str: string

    public value: number

    public childs: Child[] = []

    constructor(data: Partial<ParentSchema> = {}) {
        super()
        if (data.str) {
            this.str = data.str
        }
        if (data.value) {
            this.value = data.value
        }
        if (data.childs) {
            for (const child of data.childs) {
                this.childs.push(new Child(child))
            }
        }
    }

    public write(bw: BufferWriter): BufferWriter {
        bw.writeVarString(this.str, 'ascii')
        bw.writeU64(this.value)
        bw.writeVarint(this.childs.length)
        for (const child of this.childs) {
            child.write(bw)
        }
        return bw
    }

    public static read(br: BufferReader): ParentSchema {
        const str = br.readVarString('ascii')
        const value = br.readU64()
        const childCount = br.readVarint()
        const childs: ChildSchema[] = []
        for (let i = 0; i < childCount; i++) {
            childs.push(Child.read(br))
        }
        return { str, value, childs }
    }
}

interface ChildSchema {
    foo: string
    bar: number
}

class Child extends Struct implements ChildSchema {
    public foo: string

    public bar: number

    constructor(data: Partial<ChildSchema> = {}) {
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

    public static read(br: BufferReader): ChildSchema {
        return {
            foo: br.readVarString('ascii'),
            bar: br.readU64(),
        }
    }
}

describe('Struct', () => {
    it('should pass', () => {
        const data = {
            str: 'HelloWorld',
            value: 66,
            childs: [
                {
                    foo: 'Goodbye',
                    bar: 11,
                },
                {
                    foo: 'Blank',
                    bar: 16,
                },
            ],
        }
        const parent = new Parent(data)
        assert.deepStrictEqual(Parent.fromBuffer(parent.toBuffer()), parent)
        assert.strictEqual(
            parent.toHex(),
            '0a48656c6c6f576f726c6442000000000000000207476f6f646279650b0000000000000005426c616e6b1000000000000000'
        )
        assert.deepStrictEqual(Parent.fromHex(parent.toHex()), parent)
        assert.strictEqual(parent.toBase64(), 'CkhlbGxvV29ybGRCAAAAAAAAAAIHR29vZGJ5ZQsAAAAAAAAABUJsYW5rEAAAAAAAAAA=')
        assert.deepStrictEqual(Parent.fromBase64(parent.toBase64()), parent)
        assert.deepStrictEqual(parent.toObject(), data)
    })
})