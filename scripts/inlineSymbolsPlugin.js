import replace from 'vite-plugin-filter-replace'
import { DEV } from './constants.js'

function validateSymbols(symbols, symbolsMin, externalSymbols) {
  const keys = Object.keys(symbols)
  const keysMin = Object.keys(symbolsMin)

  if (keys.length !== keysMin.length) {
    throw new Error('Symbols length mismatch')
  }

  for (const key of keys) {
    if (!keysMin.includes(key)) {
      throw new Error(`Symbol "${key}" not found in symbols.min`)
    }
  }

  const miniValuesSet = new Set(Object.values(symbolsMin))

  if (miniValuesSet.size !== keysMin.length) {
    throw new Error('Duplicate values in symbols.min')
  }

  if (externalSymbols) {
    const externalSymbolsEntries = Object.entries(externalSymbols)

    externalSymbolsEntries.forEach(([key, value]) => {
      if (keys.includes(key)) {
        throw new Error(`External symbol "${key}" already defined in symbols`)
      }

      if (miniValuesSet.has(value)) {
        throw new Error(`External symbol value "${value}" already defined in symbols.min`)
      }
    })
  }
}

function createUsageReplacements(key, to) {
  return [
    {
      from: ` [${key}];`,
      to: ` ${to};`
    },
    {
      from: ` [${key}] = `,
      to: ` ${to} = `
    },
    {
      from: ` [${key}](`,
      to: ` ${to}(`
    },
    {
      from: `[${key}]:`,
      to: `${to}:`
    },
    {
      from: `?.[${key}]`,
      to: `?.${to}`
    },
    {
      from: `[${key}]`,
      to: `.${to}`
    },
    {
      from: `${key} in `,
      to: `'${to}' in `
    }
  ]
}

function createReplacements(key, value, to) {
  return [
    {
      from: `const ${key} = "${value}"`,
      to: `const $${key} = "${to}"`
    },
    ...createUsageReplacements(key, to)
  ]
}

export function inlineSymbols(symbols, symbolsMin = symbols, externalSymbols) {
  if (symbols !== symbolsMin || externalSymbols) {
    validateSymbols(symbols, symbolsMin, externalSymbols)
  }

  const symbolEntries = Object.entries(symbols)
  const replacements = symbolEntries.flatMap(
    ([key, value]) => createReplacements(key, value, DEV ? value : symbolsMin[key])
  )

  if (externalSymbols) {
    const externalSymbolEntries = Object.entries(externalSymbols)

    replacements.push(
      ...externalSymbolEntries.flatMap(
        ([key, value]) => createUsageReplacements(key, value)
      )
    )
  }

  return replace(
    [
      {
        filter: /\.js$/,
        replace: replacements
      }
    ]
  )
}
