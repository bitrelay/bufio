/**
 * Encoding Error
 * @extends {Error}
 */
export class EncodingError extends Error {
    /**
     * Encoding error type.
     */
    public type = 'EncodingError'

    /**
     * Encoding error code.
     */
    public code = 'ERR_ENCODING'

    /**
     * Create an encoding error.
     */
    constructor(offset: number, reason: string, start?: (...args: any[]) => void) {
        super()
        this.name = 'EncodingError'
        this.message = `${reason} (offset=${offset}).`

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, start || EncodingError)
        }
    }
}
