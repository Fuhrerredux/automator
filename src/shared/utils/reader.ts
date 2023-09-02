export function readFileObject(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export function extractValue(string: string, withQuotes?: boolean): string {
  const data = string.trim()
  const first = (withQuotes ? data.indexOf('"') : data.indexOf('=')) + 1
  const last = withQuotes ? data.lastIndexOf('"') : data.length

  return data.substring(first, last).trim()
}

export function removeBaseDirectoryFromPath(base: string, path: string) {
  return path.substring(base.length + 1)
}
