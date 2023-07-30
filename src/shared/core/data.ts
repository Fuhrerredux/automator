export function normalize<T extends object>(obj: T) {
  return JSON.stringify(obj)
}

export function denormalize<T extends object>(data: string) {
  return JSON.parse(data) as T
}

export function denormalizeObject<T extends object, E extends object>(obj: T, keys: (keyof T)[]) {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    if (keys.includes(key as keyof T)) {
      prev[key as keyof E] = JSON.parse(value)
    } else prev[key as keyof E] = value
    return prev
  }, {} as E)
}

export function buildToken(string: string): string {
  return string.replace('-', '_')
}
