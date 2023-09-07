const ideas: SpriteType = {
  directory: 'common/ideas',
  property: 'picture',
  type: 'idea',
  res: 'gfx/interface/ideas'
}
const goals: SpriteType = {
  directory: 'common/national_focus',
  property: 'icon',
  type: 'focus',
  res: 'gfx/interface/goals'
}

export default [
  {
    label: 'placeholder.ideas',
    value: ideas
  },
  {
    label: 'placeholder.focuses',
    value: goals
  }
] as DropdownOption<SpriteType>[]

export { ideas, goals }
