export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean'
}

export function isNil(value: any): value is (null | undefined) {
  return value == null
}

export function isFunction(value: any): value is ((...args: any[]) => void) {
  return typeof value === 'function'
}
