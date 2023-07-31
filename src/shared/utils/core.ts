/**
 * Groups an array of objects by a given key.
 *
 * @template T - The type of objects in the array.
 * @template K - The type of the key in the objects.
 * @param {T[]} source - The array of objects to group.
 * @param {K} key - The key to group the objects by.
 * @returns {Record<string, T[]>} An object whose keys are the values of the specified key in the array of objects,
 * and whose values are arrays of objects with the same key value.
 */
export function groupBy<T, K extends keyof T>(source: T[], key: K): Record<string, T[]> {
  return source.reduce(
    (dest: Record<string, T[]>, obj: T) => {
      const keyValue = obj[key] as unknown as string
      const group = dest[keyValue] || []
      group.push(obj)

      return {
        ...dest,
        [`${keyValue}`]: group
      }
    },
    {} as Record<string, T[]>
  )
}
