# bufio

Buffer and serialization utilities for node.js and browser.

## Usage

```typescript
import * as assert from 'assert'
import * as bufio from '@bitrelay/bufio'

const bw = bufio.write()
bw.writeU64(100)
bw.writeString('foo')
const data = bw.render()

const br = bufio.read(data)
assert(br.readU64() === 100)
assert(br.readString(3) === 'foo')
```

## Struct Usage

```typescript
import { BufferReader, BufferWriter, Struct } from '@bitrelay/bufio'

interface ParentSchema {
  value: number
  childs: ChildSchema[]
}

class Parent extends Struct implements ParentSchema {
  public value: number

  public childs: Child[] = []

  constructor(data: Partial<ParentSchema> = {}) {
    super()
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
    bw.writeU64(this.value)
    bw.writeVarint(this.childs.length)
    for (const child of this.childs) {
      child.write(bw)
    }
    return bw
  }

  public static read(br: BufferReader): ParentSchema {
    const value = br.readU64()
    const childCount = br.readVarint()
    const childs: ChildSchema[] = []
    for (let i = 0; i < childCount; i++) {
      childs.push(Child.read(br))
    }
    return { value, childs }
  }
}

interface ChildSchema {
  foo: string
}

class Child extends Struct implements ChildSchema {
  public foo: string

  constructor(data: Partial<ChildSchema> = {}) {
    super()
    if (data.foo) {
      this.foo = data.foo
    }
  }

  public write(bw: BufferWriter): BufferWriter {
    bw.writeVarString(this.foo, 'ascii')
    return bw
  }

  public static read(br: BufferReader): ChildSchema {
    return { foo: br.readVarString('ascii') }
  }
}

const parent = new Parent({ value: 1, childs: [{ foo: 'bar' }, { foo: 'another' }] })

console.log('Buffer:')
console.log(parent.toBuffer())

console.log('Decoded:')
console.log(Parent.fromBuffer(parent.toBuffer()))

console.log('Hex:')
console.log(parent.toHex())

console.log('Decoded:')
console.log(Parent.fromHex(parent.toHex()))

console.log('Base64:')
console.log(parent.toBase64())

console.log('Decoded:')
console.log(Parent.fromBase64(parent.toBase64()))

console.log('Object:')
console.log(parent.toObject())
```

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work. `</legalese>`

## License

- Copyright (c) 2019, Philipp Petzold (MIT License).
- Copyright (c) 2014-2017, Christopher Jeffrey (https://github.com/bcoin-org/bufio).
- Copyright (c) 2014-2015, Fedor Indutny (https://github.com/bcoin-org/bufio).

See LICENSE for more info.
