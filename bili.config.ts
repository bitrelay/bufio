import { Config } from 'bili'

const config: Config = {
    input: 'src/index.ts',
    output: {
        dir: 'lib',
    },
    plugins: {
        typescript2: {
            tsconfig: 'tsconfig.build.json',
        },
    },
}

export default config
