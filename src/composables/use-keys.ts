export default function useKeys<V, I>(props: ComponentProps<V, I>) {
  return {
    valueFunc: (o: I) =>
      typeof props.valueKey === 'function' ? props.valueKey(o) : (o[props.valueKey] as V),
    displayFunc: (o: I) =>
      typeof props.displayKey === 'function' ? props.displayKey(o) : String(o[props.displayKey])
  }
}
