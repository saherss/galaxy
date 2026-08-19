import { MENU, type Lang, type Menu, type Section } from './menu'

/** One row of the POS sheet, in the column order the POS program expects. */
export type PosRow = Record<string, string | number>

export const POS_HEADER = ['الاسم', 'الباركود', 'السعر', 'الفئة', 'التكلفة'] as const

/** Suffix distinguishing a drink's two till buttons. */
const SIZE_LABEL: Record<Lang, { small: string; large: string }> = {
  ar: { small: 'صغير', large: 'كبير' },
  en: { small: 'Small', large: 'Large' },
}

/**
 * The menu prints a section heading above its drinks, so "مانجو" under
 * العصائر الفريش is unambiguous on the page. A till has no headings — it has a
 * flat list — and four buttons all reading "مانجو" is unusable. Sections whose
 * items are bare flavours therefore carry a `posPrefix` that names the kind.
 */
function posName(section: Section, name: string, lang: Lang) {
  const prefix = section.posPrefix?.[lang]
  if (!prefix || name.includes(prefix)) return name
  return `${prefix} ${name}`
}

/**
 * Flatten the menu into POS rows.
 *
 * A drink poured in two sizes is two things to sell, so it becomes two rows
 * with their own barcodes — the original number stays on the large pour so the
 * till keeps recognising it.
 *
 * `posOnly` holds records the menu does not show. Stock items such as sugar are
 * still sold or counted, so they stay in the sheet; drinks that have been
 * retired are kept in menu.json for their barcode history but are marked
 * `archived` and left out, or the sheet fills with priceless rows for things
 * nobody can order.
 */
export function buildPosRows(lang: Lang = 'ar', source: Menu = MENU): PosRow[] {
  const L = SIZE_LABEL[lang]
  const rows: PosRow[] = []

  for (const section of source.sections) {
    for (const item of section.items) {
      const name = posName(section, item.name[lang], lang)
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
    if (p.archived) continue
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
