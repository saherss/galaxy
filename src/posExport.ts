import { MENU, type Lang, type Menu } from './menu'

/** One row of the POS sheet, in the column order the POS program expects. */
export type PosRow = Record<string, string | number>

export const POS_HEADER = ['الاسم', 'الباركود', 'السعر', 'الفئة', 'التكلفة'] as const

/** Suffix appended to a drink's name to distinguish its two till buttons. */
const SIZE_LABEL: Record<Lang, { small: string; large: string }> = {
  ar: { small: 'صغير', large: 'كبير' },
  en: { small: 'Small', large: 'Large' },
}

/**
 * Flatten the menu into POS rows.
 *
 * A drink poured in two sizes is two things to sell, so it becomes two rows
 * with their own barcodes — the original number stays on the large pour so the
 * till keeps recognising it, and the small pour carries a newer one. Drinks
 * sold one size emit a single row with no suffix.
 *
 * `posOnly` records (stock items, and drinks struck off the price list) are
 * emitted verbatim; the sheet is sorted by barcode so the ordering is stable.
 */
export function buildPosRows(lang: Lang = 'ar', source: Menu = MENU): PosRow[] {
  const L = SIZE_LABEL[lang]
  const rows: PosRow[] = []

  for (const section of source.sections) {
    for (const item of section.items) {
      const name = item.name[lang]
      const category = section.name[lang]
      const cost = item.cost ?? ''
      const price = item.seasonal ? '' : (item.price ?? '')

      if (typeof item.small === 'number' && item.barcodeSmall) {
        rows.push({ 'الاسم': `${name} - ${L.small}`, 'الباركود': item.barcodeSmall, 'السعر': item.small, 'الفئة': category, 'التكلفة': '' })
        rows.push({ 'الاسم': `${name} - ${L.large}`, 'الباركود': item.barcode, 'السعر': price, 'الفئة': category, 'التكلفة': cost })
      } else {
        rows.push({ 'الاسم': name, 'الباركود': item.barcode, 'السعر': price, 'الفئة': category, 'التكلفة': cost })
      }
    }
  }

  for (const p of source.posOnly) {
    rows.push({
      'الاسم': p.name,
      'الباركود': p.barcode,
      'السعر': p.price ?? '',
      'الفئة': p.category,
      'التكلفة': p.cost ?? '',
    })
  }

  return rows.sort((a, b) => String(a['الباركود']).localeCompare(String(b['الباركود'])))
}
