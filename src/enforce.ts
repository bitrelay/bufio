/*
 * Enforce type
 */
export function enforce(value: any, name: string, type: string): void {
    if (!value) {
        const err = new TypeError(`'${name}' must be a(n) ${type}.`)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(err, enforce)
        }
        throw err
    }
}
