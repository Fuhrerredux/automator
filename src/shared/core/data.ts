export function normalize<T extends object>(obj: T) {
  const arr: string[] = []

  Object.values(obj).forEach((e) => {
    if (typeof e === 'object' || Array.isArray(e)) arr.push(JSON.stringify(e))
    else arr.push(e)
  })

  return arr
}
