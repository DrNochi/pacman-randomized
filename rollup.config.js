import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'src/main.js',
    plugins: [
        babel(),
        terser()
    ],
    treeshake: true,
    output: {
        file: 'dist/pacman.min.js',
        sourcemap: 'dist/pacman.min.js.map',
        format: 'umd'
    }
}
