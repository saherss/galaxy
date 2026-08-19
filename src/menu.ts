import menuJson from './menu.json'

/** Every human-readable string carries one entry per language. */
export type Localized = { ar: string; en: string }

export type Lang = keyof Localized

export type Item = {
  id: number
  name: Localized
  /** The large size, or the only one. */
  price?: number
  /** Present only on drinks poured in two sizes. */
  small?: number
  /** Fruit priced by the season rather than a fixed figure. */
  seasonal?: boolean
  /** POS fields, so the sheet can be re-exported from here. The small
   *  pour is a separate thing to sell, so it gets its own barcode. */
  barcode: string
  barcodeSmall?: string
  cost: number | null
}

export type Section = {
  id: number
  key: string
  name: Localized
  /** Names the kind of drink in the POS sheet, where there are no section
   *  headings to tell one bare `مانجو` from another. */
  posPrefix?: Localized
  items: Item[]
}

/** Records the POS carries but the menu does not show: stock items, and
 *  drinks struck off the price list that still need to exist in the till. */
export type PosOnly = {
  barcode: string
  name: string
  category: string
  price: number | null
  cost: number | null
  /** A drink taken off the menu. Kept so its barcode is never reissued, but
   *  left out of the sheet — nobody can order it. */
  archived?: boolean
}

export type Menu = {
  currency: string
  /** Highest barcode ever issued. Kept so a retired SKU's number is never
   *  handed to a different drink, even after it leaves the file entirely. */
  lastBarcode: string
  sections: Section[]
  posOnly: PosOnly[]
}

export const MENU = menuJson as unknown as Menu

/** Ids are spaced by 10 so a new entry can be slotted between two others
 *  without renumbering; sorting by them fixes the running order. */
export const byId = <T extends { id: number }>(a: T, b: T) => a.id - b.id

export const SECTIONS: Section[] = [...MENU.sections]
  .sort(byId)
  .map((s) => ({ ...s, items: [...s.items].sort(byId) }))

export const BY_KEY = Object.fromEntries(SECTIONS.map((s) => [s.key, s])) as Record<string, Section>
