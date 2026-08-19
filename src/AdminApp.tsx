import { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'

import { MENU, byId, type Item, type Menu, type Section } from './menu'
import { POS_HEADER, buildPosRows } from './posExport'
import { clearToken, getToken, loadMenu, saveMenu, setToken } from './github'

// ── LOOK ──────────────────────────────────────────────────────────────────────

const C = {
  bg: '#12100C', panel: '#1A1611', line: 'rgba(208,166,40,0.18)',
  gold: '#D0A628', cream: '#F2EDE2', muted: '#8C7A58',
  ok: '#5FA86A', bad: '#C4553F',
}
const FONT = "'Cairo', sans-serif"

const btn = (kind: 'primary' | 'ghost' = 'ghost'): React.CSSProperties => ({
  fontFamily: FONT, fontSize: 13, padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
  border: `1px solid ${kind === 'primary' ? C.gold : C.line}`,
  background: kind === 'primary' ? C.gold : 'transparent',
  color: kind === 'primary' ? '#1A1611' : C.cream,
  fontWeight: kind === 'primary' ? 600 : 400,
})

const field: React.CSSProperties = {
  fontFamily: FONT, fontSize: 13, padding: '6px 9px', borderRadius: 6,
  border: `1px solid ${C.line}`, background: '#0E0C09', color: C.cream,
  width: '100%', outline: 'none',
}

// ── PRICE CELL ────────────────────────────────────────────────────────────────

function NumCell({ value, onChange, placeholder }: {
  value: number | undefined
  onChange: (v: number | undefined) => void
  placeholder?: string
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => {
        const raw = e.target.value.trim()
        onChange(raw === '' ? undefined : Number(raw))
      }}
      style={{ ...field, width: 78, textAlign: 'center', direction: 'ltr' }}
    />
  )
}

// ── APP ───────────────────────────────────────────────────────────────────────

type Status = { kind: 'idle' | 'busy' | 'ok' | 'bad'; text: string }

export default function AdminApp() {
  const [token, setTok] = useState(getToken())
  const [draft, setDraft] = useState<Menu>(() => structuredClone(MENU))
  const [sha, setSha] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>({ kind: 'idle', text: 'يعرض النسخة المُجمّعة — اضغط تحميل لجلب النسخة الحيّة' })
  const [filter, setFilter] = useState('')

  // Pull the live file as soon as a token is available, so edits are never
  // based on a bundle that shipped days ago.
  useEffect(() => { if (token) void refresh(token) }, [])

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(MENU) || sha !== null,
    [draft, sha],
  )

  async function refresh(t = token) {
    setStatus({ kind: 'busy', text: 'جارٍ التحميل…' })
    try {
      const { text, sha } = await loadMenu(t)
      setDraft(JSON.parse(text))
      setSha(sha)
      setStatus({ kind: 'ok', text: 'تم تحميل النسخة الحيّة' })
    } catch (e) {
      setStatus({ kind: 'bad', text: String((e as Error).message) })
    }
  }

  async function publish() {
    if (!sha) { setStatus({ kind: 'bad', text: 'حمّل النسخة الحيّة أولاً قبل الحفظ' }); return }
    setStatus({ kind: 'busy', text: 'جارٍ الحفظ…' })
    try {
      const text = JSON.stringify(draft, null, 2) + '\n'
      const next = await saveMenu(token, text, sha, 'Update menu prices from the admin page')
      setSha(next)
      setStatus({ kind: 'ok', text: 'تم الحفظ — الموقع هيتحدّث خلال دقيقة تقريباً' })
    } catch (e) {
      setStatus({ kind: 'bad', text: String((e as Error).message) })
    }
  }

  function patch(sectionId: number, itemId: number, change: Partial<Item>) {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id !== sectionId ? s : { ...s, items: s.items.map((i) => (i.id === itemId ? { ...i, ...change } : i)) },
      ),
    }))
  }

  function exportExcel() {
    // Export the draft, not the bundled copy, so unsaved edits are included.
    const rows = buildPosRows('ar', draft)
    const ws = XLSX.utils.json_to_sheet(rows, { header: [...POS_HEADER] })
    for (let i = 0; i < rows.length; i++) {
      const cell = ws['B' + (i + 2)]
      if (cell) { cell.t = 's'; cell.z = '@' }   // keep the leading zeros
    }
    ws['!cols'] = [{ wch: 32 }, { wch: 12 }, { wch: 10 }, { wch: 22 }, { wch: 10 }]
    ws['!views'] = [{ RTL: true }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Products')
    XLSX.writeFile(wb, 'products.xlsx')
  }

  const sections: Section[] = [...draft.sections].sort(byId)
  const q = filter.trim()
  const counts = sections.reduce((a, s) => a + s.items.length, 0)

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.cream, fontFamily: FONT, padding: '0 0 60px' }}>
      {/* header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 10, background: 'rgba(18,16,12,0.96)',
        backdropFilter: 'blur(8px)', borderBottom: `1px solid ${C.line}`, padding: '14px clamp(12px,3vw,28px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <strong style={{ fontSize: 17, color: C.gold }}>لوحة تحكم المنيو</strong>
          <span style={{ fontSize: 12, color: C.muted }}>{counts} صنف · {sections.length} قسم</span>
          <div style={{ flex: 1 }}/>
          <button style={btn()} onClick={() => void refresh()}>تحميل</button>
          <button style={btn()} onClick={exportExcel}>تصدير Excel</button>
          <button style={btn('primary')} onClick={() => void publish()} disabled={!dirty}>حفظ ونشر</button>
        </div>
        <p style={{
          margin: '10px 0 0', fontSize: 12.5,
          color: status.kind === 'bad' ? C.bad : status.kind === 'ok' ? C.ok : C.muted,
        }}>
          {status.text}
        </p>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '22px clamp(12px,3vw,28px)' }}>
        {/* token */}
        <section style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 16, marginBottom: 22 }}>
          <label style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
            GitHub token <span style={{ color: C.muted }}>(fine-grained، صلاحية Contents: Read and write على مستودع galaxy فقط)</span>
          </label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="password"
              value={token}
              placeholder="github_pat_…"
              onChange={(e) => { setTok(e.target.value); setToken(e.target.value) }}
              style={{ ...field, flex: '1 1 320px', direction: 'ltr' }}
            />
            <button style={btn()} onClick={() => { clearToken(); setTok(''); setSha(null) }}>مسح</button>
          </div>
          <p style={{ fontSize: 11.5, color: C.muted, margin: '9px 0 0', lineHeight: 1.7 }}>
            التوكن بيتخزّن في المتصفح ده بس، وبيروح لـ api.github.com لا غير — مش بيتحفظ في الكود ولا بيترفع.
          </p>
        </section>

        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="ابحث عن صنف…"
          style={{ ...field, marginBottom: 18 }}
        />

        {sections.map((s) => {
          const items = [...s.items].sort(byId).filter(
            (i) => !q || i.name.ar.includes(q) || i.name.en.toLowerCase().includes(q.toLowerCase()),
          )
          if (!items.length) return null
          return (
            <section key={s.id} style={{ marginBottom: 26 }}>
              <h2 style={{ fontSize: 15, color: C.gold, margin: '0 0 10px', fontWeight: 600 }}>
                {s.name.ar} <span style={{ color: C.muted, fontWeight: 400, fontSize: 12 }}>· {s.name.en}</span>
              </h2>
              <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'hidden' }}>
                {items.map((i, n) => (
                  <div key={i.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                    padding: '10px 14px',
                    borderTop: n ? `1px solid ${C.line}` : 'none',
                  }}>
                    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                      <div style={{ fontSize: 13.5 }}>{i.name.ar}</div>
                      <div style={{ fontSize: 11, color: C.muted, direction: 'ltr', textAlign: 'right' }}>
                        {i.name.en} · {i.barcode}
                      </div>
                    </div>
                    {i.seasonal ? (
                      <span style={{ fontSize: 12, color: C.muted }}>موسمي</span>
                    ) : (
                      <>
                        <label style={{ fontSize: 11, color: C.muted }}>صغير</label>
                        <NumCell
                          value={i.small}
                          placeholder="—"
                          onChange={(v) => patch(s.id, i.id, { small: v })}
                        />
                        <label style={{ fontSize: 11, color: C.muted }}>كبير</label>
                        <NumCell
                          value={i.price}
                          placeholder="—"
                          onChange={(v) => patch(s.id, i.id, { price: v })}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
