// The props are camelCase throughout, the React way, while SVG spells its
// presentation attributes like the CSS properties they are, `stroke-width`,
// and everything else as is, `viewBox`. The presentation attributes come in
// families sharing a prefix or a suffix; the three families with a camelCase
// sibling (`markerWidth`, `textLength`, `clipPathUnits`) are matched in full
const hyphenated = /^(?:stroke|fill|font|flood|stop|lighting|color|marker(?:End|Mid|Start)|text(?:Anchor|Decoration)|clip(?:Path|Rule)$|paintOrder|pointerEvents|unicodeBidi|vectorEffect|writingMode|baselineShift)|(?:Rendering|Spacing|Baseline)$/

export function toSvgAttributeName(name: string) {
  return hyphenated.test(name)
    ? name.replace(/[A-Z]/g, '-$&').toLowerCase()
    : name === 'tabIndex' || name === 'crossOrigin'
      ? name.toLowerCase()
      : name
}
