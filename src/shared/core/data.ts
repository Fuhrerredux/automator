export function normalize<T extends object>(obj: T) {
  return JSON.stringify(obj)
}

export function denormalize<T extends object>(data: string) {
  return JSON.parse(data) as T
}

/**
 * Function to serialize unsupported data types such as array and object that will
 * be flush in the SQLite Database.
 * 
 * @param obj the object
 * @param keys keys of the properties that needs to be serialized
 * @returns new object with serialized array properties
 */
export function serializeObject<T extends object>(obj: T, keys: (keyof T)[]): Record<keyof T, string | number> {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    if (keys.includes(key as keyof T)) {
      prev[key as keyof T] = JSON.stringify(value)
    } else prev[key as keyof T] = value
    return prev
  }, {} as Record<keyof T, string | number>)
}

/**
 * Function to deserialize the properties with an array and object that was serialized
 * when flushed to the database.
 * 
 * @param obj the object
 * @param keys keys of the properties that needs to be deserialized
 * @returns new object with proper data types.
 */
export function deserializeObject<T extends object, E extends object>(obj: T, keys: (keyof T)[]) {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    if (keys.includes(key as keyof T)) {
      prev[key as keyof E] = JSON.parse(value)
    } else prev[key as keyof E] = value
    return prev
  }, {} as E)
}

export function buildToken(string: string): string {
  return string.replace(/[-]|\s+/g, '_')
}
