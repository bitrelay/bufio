# bufio

![](https://github.com/bitrelay/bufio/workflows/Main%20CI/badge.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Buffer and serialization utilities for node.js and browser.

## Installation

```
npm install @bitrelay/bufio
```

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

class MyStruct extends Struct {
  public str = 'hello'

  public value = 0

  public write(bw: BufferWriter): BufferWriter {
    bw.writeVarString(this.str, 'ascii')
    bw.writeU64(this.value)
    return bw
  }

  public static read(br: BufferReader): object {
    const str = br.readVarString('ascii')
    const value = br.readU64()
    return { str, value }
  }
}

const instance = new MyStruct()

console.log('Buffer:')
console.log(instance.toBuffer())

console.log('Decoded:')
console.log(MyStruct.fromBuffer(instance.toBuffer()))

console.log('Hex:')
console.log(instance.toHex())

console.log('Decoded:')
console.log(MyStruct.fromHex(instance.toHex()))

console.log('Base64:')
console.log(instance.toBase64())

console.log('Decoded:')
console.log(MyStruct.fromBase64(instance.toBase64()))

console.log('Object:')
console.log(instance.toObject())
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
