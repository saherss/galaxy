import React, { type ReactNode } from 'react'

// ── PALETTE ───────────────────────────────────────────────────────────────────

const W = {
  bg:       '#191410',
  bgPage:   '#1C1712',
  gold:     '#D0A628',
  goldL:    '#E8C450',
  goldD:    '#A07818',
  cream:    '#F2EDE2',
  white:    '#FAF6EE',
  muted:    '#8C7A58',
  dim:      '#4A4030',
  rule:     'rgba(208,166,40,0.16)',
  rowEven:  'rgba(208,166,40,0.04)',
}

// ── FONTS ─────────────────────────────────────────────────────────────────────

const DISPLAY = "'El Messiri', sans-serif"
const BODY = "'Cairo', sans-serif"

// ── FLUID SIZING ──────────────────────────────────────────────────────────────

// The sheet is an inline-size container (.gx-sheet), so 100cqw is its own width.
// `fl` hits `max` at the full 794px sheet and eases down to `min` as it narrows.
const SHEET = 794
const fl = (min: number, max: number) =>
  `clamp(${min}px, ${((max / SHEET) * 100).toFixed(3)}cqw, ${max}px)`

// Inverse ramp, for the handful of values that need to be *larger* on a narrow
// sheet: `wide` at the full 794px, growing toward `narrow` as it shrinks.
const flDown = (wide: number, narrow: number) =>
  `clamp(${wide}px, calc(${narrow}px - ${(((narrow - wide) / SHEET) * 100).toFixed(3)}cqw), ${narrow}px)`

// Horizontal padding shared by the cover and inner pages.
const PAD_X = fl(16, 52)

// ── MENU DATA ─────────────────────────────────────────────────────────────────

const D = {
  hotCoffee:  { ar: 'القهوة الساخنة',      en: 'Hot Coffee',       items: ['إسبريسو سينجل','إسبريسو دابل','أمريكانو','كابتشينو','كافيه لاتيه','فلات وايت','كورتادو','موكا','سبانيش لاتيه','كراميل لاتيه'] },
  icedCoffee: { ar: 'القهوة الباردة',       en: 'Iced Coffee',      items: ['آيس أمريكانو','آيس لاتيه','آيس كابتشينو','آيس موكا','آيس وايت موكا','آيس فانيليا لاتيه'] },
  turkish:    { ar: 'القهوة الشرقي',        en: 'Turkish & French', items: ['تركي سادة','تركي مضبوط','تركي زيادة','تركي هيل','تركي بندق','فرنسي','فرنسي بندق','فرنسي فانيليا'] },
  tea:        { ar: 'الشاي',               en: 'Tea',              items: ['شاي أحمر','شاي أخضر','شاي بلبن','شاي أخضر تفاح','شاي كرك','شاي ماسالا','شاي فروتة','شاي ليمون'] },
  herbal:     { ar: 'الأعشاب',             en: 'Herbal Infusions', items: ['ينسون','نعناع','بابونج','تيليو','كراوية','كراوية بلبن','خمرة','ميرمية','كركديه','قرفة','زنجبيل','زنجبيل ليمون','ليمون نعناع','ليمون عسل','حلبة','حلبة لبن'] },
  chocolate:  { ar: 'مشروبات شوكولاتة',    en: 'Chocolate',        items: ['هوت شوكليت','وايت هوت شوكليت','دارك هوت شوكليت','هوت شوكليت مارشميلو'] },
  winter:     { ar: 'مشروبات شتوية',       en: 'Winter Drinks',    items: ['سحلب','سحلب أوريو','سحلب لوتس','سحلب نوتيلا','قرفة بلبن','حمص الشام'] },
  mojito:     { ar: 'الموهيتو',            en: 'Mojito',           items: ['كلاسيك','بلو','جرين أبل','باشن فروت','بيري','فراولة','مانجو','بطيخ','خوخ','ليمون','بيناكولادا','ميكس بيري'] },
  milkshake:  { ar: 'الميلك شيك',          en: 'Milkshake',        items: ['شوكليت','وايت شوكليت','كراميل','أوريو','لوتس','نوتيلا','فانيليا','فراولة','مانجو','موز','بلوبيري','ريد فيلفيت','كيندر','سنيكرز'] },
  frappe:     { ar: 'الفرابيه',            en: 'Frappe',           items: ['فرابيه قهوة','موكا','كراميل','وايت موكا','فانيليا','أوريو','لوتس','نوتيلا','شوكليت'] },
  juices:     { ar: 'العصائر الفريش',      en: 'Fresh Juices',     items: ['مانجو','برتقال','فراولة','جوافة','ليمون','ليمون نعناع','موز','موز بلبن','فراولة بلبن','مانجو بلبن','أفوكادو','كوكتيل','رمان','بطيخ','كنتالوب'] },
  smoothie:   { ar: 'السموذي',             en: 'Smoothie',         items: ['مانجو','فراولة','ليمون','ميكس بيري','باشن فروت','بينا كولادا'] },
  waterSoda:  { ar: 'مياه ومشروبات غازية', en: 'Water & Soda',     items: ['مياه معدنية','مياه فوارة','كولا','كولا دايت','سبرايت','فانتا'] },
  extras:     { ar: 'الإضافات',            en: 'Extras',           items: ['شوت إسبريسو','لبن نباتي','كريمة مخفوقة','آيس كريم','صوص شوكليت','صوص وايت','صوص كراميل','صوص كراميل مملح','سيرب فانيليا','سيرب كراميل','سيرب موهيتو','سيرب بلو كوراكاو','سيرب جرين أبل','سيرب ليمون','سيرب خوخ','سيرب بطيخ','سيرب جوز الهند'] },
}

// ── PHOTO URLS ────────────────────────────────────────────────────────────────

const P = {
  espresso: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=400&fit=crop&auto=format',
  latte:    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&auto=format',
  iced:     'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&auto=format',
  smoothie: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=400&fit=crop&auto=format',
  beans:    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=640&h=480&fit=crop&auto=format',
  cup:      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=640&h=480&fit=crop&auto=format',
  matcha:   'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&auto=format',
}

// ── WOOD TEXTURE ──────────────────────────────────────────────────────────────

const woodBg: React.CSSProperties = {
  backgroundColor: W.bg,
  backgroundImage: [
    // Main plank lines
    'repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 2px, transparent 2px, transparent 74px)',
    // Lighter plank accent
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 148px)',
    // Fine grain horizontal
    'repeating-linear-gradient(180deg, rgba(255,255,255,0.022) 0px, rgba(255,255,255,0.022) 1px, transparent 1px, transparent 3px)',
    // Top/bottom shadow vignette
    'linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.0) 18%, rgba(0,0,0,0.0) 82%, rgba(0,0,0,0.38) 100%)',
    // Warm center highlight
    'radial-gradient(ellipse at 50% 50%, rgba(180,120,30,0.06) 0%, transparent 70%)',
  ].join(','),
}

// ── SHARED SHEET PIECES ───────────────────────────────────────────────────────

// Gold strip that caps the top and bottom of every sheet.
function GoldStrip({ edge }: { edge: 'top' | 'bottom' }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, height: 5, zIndex: 3,
      top: edge === 'top' ? 0 : undefined,
      bottom: edge === 'bottom' ? 0 : undefined,
      background: `linear-gradient(to right, ${W.goldD}80, ${W.gold}, ${W.goldD}80)`,
    }}/>
  )
}

// Inset hairline frame. Plain borders rather than a fixed-size <svg> so the
// frame tracks whatever size the sheet has settled at.
function SheetFrame({ double = false }: { double?: boolean }) {
  return (
    <>
      <div style={{
        position: 'absolute', inset: fl(8, 13), zIndex: 2, pointerEvents: 'none',
        border: `1px solid ${W.gold}`, opacity: double ? 0.22 : 0.18,
      }}/>
      {double && (
        <div style={{
          position: 'absolute', inset: fl(13, 20), zIndex: 2, pointerEvents: 'none',
          border: `0.4px solid ${W.gold}`, opacity: 0.1,
        }}/>
      )}
    </>
  )
}

// ── SVG COMPONENTS ────────────────────────────────────────────────────────────

function BrushStroke({ width = 220, color = W.gold, weight = 3.5 }: { width?: number; color?: string; weight?: number }) {
  const w = width
  return (
    <svg viewBox={`0 0 ${w} 18`} style={{ display: 'block', width: '100%', maxWidth: w, height: 'auto' }}>
      <path d={`M 6,10 Q ${w * 0.22},5.5 ${w * 0.5},10 Q ${w * 0.78},14.5 ${w - 6},10`}
        stroke={color} strokeWidth={weight} fill="none" strokeLinecap="round" opacity="0.92"/>
      <path d={`M 10,12.5 Q ${w * 0.22},9 ${w * 0.5},12.5 Q ${w * 0.78},16 ${w - 10},12.5`}
        stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.28"/>
    </svg>
  )
}

// Small decorative botanical leaf
function GoldLeaf({ size = 40, rotate = 0 }: { size?: number; rotate?: number }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 40 64" fill="none"
      style={{ display: 'block', transform: `rotate(${rotate}deg)`, flexShrink: 0 }}>
      <path d="M 20,62 C 2,42 2,22 20,4 C 38,22 38,42 20,62 Z"
        stroke={W.gold} strokeWidth="0.9" fill="none" opacity="0.55"/>
      <line x1="20" y1="62" x2="20" y2="4" stroke={W.gold} strokeWidth="0.7" opacity="0.4"/>
      {[14, 28, 42].map((y, i) => (
        <line key={i}
          x1={20 - (6 + i)} y1={y} x2={20 + (6 + i)} y2={y}
          stroke={W.gold} strokeWidth="0.5" opacity="0.28"/>
      ))}
    </svg>
  )
}

// Circular photo cut-out with gold ring. `size` takes a fluid length.
function PhotoCircle({ src, size, alt = '' }: { src: string; size: number | string; alt?: string }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
      border: `2.5px solid ${W.gold}`,
      boxShadow: `0 0 0 1px ${W.goldD}50, 0 10px 36px rgba(0,0,0,0.7)`,
    }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// COVER PAGE
// ═══════════════════════════════════════════════════════════════

// A cover row: dish name, dotted lead, price slot.
function CoverItem({ item, big }: { item: string; big: boolean }) {
  return (
    <div style={{ display: 'flex', direction: 'rtl', alignItems: 'center', padding: big ? '8.5px 0' : '7px 0', borderBottom: `0.5px solid ${W.rule}` }}>
      <span style={{ fontFamily: BODY, fontSize: big ? fl(13.5, 15) : fl(13, 14), fontStyle: 'italic', color: W.cream, flex: 1 }}>{item}</span>
      <span style={{ color: W.muted, fontSize: big ? 10 : 9, letterSpacing: big ? '5px' : '4px', marginLeft: big ? 12 : 10, flexShrink: 0 }}>——</span>
      <span style={{ fontFamily: BODY, fontSize: big ? fl(13, 14) : fl(12, 13), color: W.gold, direction: 'ltr', minWidth: big ? 22 : 20, textAlign: 'right', marginLeft: big ? 10 : 8, flexShrink: 0 }}>—</span>
    </div>
  )
}

function Cover() {
  return (
    <div className="gx-sheet" style={{
      ...woodBg, position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      minHeight: 'min(141vw, 1123px)',
      boxShadow: '0 24px 96px rgba(0,0,0,0.95)',
    }}>

      {/* ── BEANS PHOTO FADE (bottom-right) ───────────────── */}
      <img src={P.beans} alt=""
        style={{
          position: 'absolute', bottom: 0, right: 0, width: '53%', aspectRatio: '420 / 300',
          objectFit: 'cover', opacity: 0.22, zIndex: 0,
          maskImage: 'radial-gradient(ellipse at 100% 100%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 100% 100%, black 30%, transparent 70%)',
        }}/>

      {/* ── HEADER BAND ───────────────────────────────────── */}
      <div className="gx-band" style={{
        position: 'relative', zIndex: 1,
        minHeight: fl(150, 228),
        padding: '14px 0',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.32) 85%, transparent 100%)',
      }}>
        {/* ── LEFT: brand panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `10px ${fl(16, 44)} 10px ${PAD_X}`, direction: 'rtl' }}>
          {/* EN label — above, wide-tracked gold */}
          <div style={{ fontFamily: BODY, fontSize: 7.5, color: W.gold, letterSpacing: '0.48em', textTransform: 'uppercase', direction: 'ltr', marginBottom: 10, opacity: 0.85 }}>
            Galaxy Café
          </div>
          {/* Brand name */}
          <div style={{ fontFamily: DISPLAY, fontSize: fl(38, 82), fontWeight: 700, color: W.cream, lineHeight: 0.95, letterSpacing: '0.01em', textShadow: `0 2px 40px rgba(208,166,40,0.18)` }}>
            جالاكسي
          </div>
          {/* Thin gold rule below name */}
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 1.5, backgroundColor: W.gold, flexShrink: 0 }}/>
            <div style={{ width: 6, height: 6, border: `1.5px solid ${W.gold}`, transform: 'rotate(45deg)', flexShrink: 0 }}/>
            <div style={{ flex: 1, height: 0.5, backgroundColor: W.gold, opacity: 0.35 }}/>
          </div>
        </div>

        {/* ── ORNAMENTAL DIVIDER ── */}
        <div className="gx-band-sep">
          <div className="gx-band-line gx-band-line--a"/>
          {/* Star ornament */}
          <svg width={20} height={20} viewBox="0 0 20 20" style={{ flexShrink: 0, margin: '4px' }}>
            <path d="M10,1 L11.8,8.2 L19,10 L11.8,11.8 L10,19 L8.2,11.8 L1,10 L8.2,8.2 Z"
              fill={W.gold} opacity="0.9"/>
          </svg>
          <svg width={10} height={10} viewBox="0 0 10 10" style={{ flexShrink: 0, margin: '3px' }}>
            <path d="M5,0.5 L5.9,4.1 L9.5,5 L5.9,5.9 L5,9.5 L4.1,5.9 L0.5,5 L4.1,4.1 Z"
              fill={W.gold} opacity="0.45"/>
          </svg>
          <div className="gx-band-line gx-band-line--b"/>
        </div>

        {/* ── RIGHT: tagline panel ── */}
        <div className="gx-band-tag" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `10px ${PAD_X} 10px ${flDown(8, 16)}`, direction: 'rtl', gap: 14 }}>
          {/* Decorative gold accent line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 0.5, backgroundColor: W.gold, opacity: 0.4 }}/>
            <div style={{ width: 4, height: 4, backgroundColor: W.gold, transform: 'rotate(45deg)', flexShrink: 0, opacity: 0.7 }}/>
          </div>
          {/* Tagline */}
          <div style={{ fontFamily: BODY, fontSize: fl(13, 14.5), color: W.cream, lineHeight: 1.85, opacity: 0.62 }}>
            قهوة رائعة في كل وقت ومع أي شخص
          </div>
          {/* Bottom accent */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 4, height: 4, backgroundColor: W.gold, transform: 'rotate(45deg)', flexShrink: 0, opacity: 0.7 }}/>
            <div style={{ flex: 1, height: 0.5, backgroundColor: W.gold, opacity: 0.4 }}/>
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────
          Flows instead of sitting at fixed offsets; the flexible
          spacers soak up whatever height is left on a tall sheet. */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', padding: `${flDown(12, 16)} ${PAD_X} ${fl(24, 42)}` }}>

        {/* ── SECTION 1: COFFEE ─────────────────────────────── */}
        <div>
          {/* Script heading + brushstroke */}
          <div style={{ direction: 'rtl', marginBottom: 14 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: fl(32, 62), fontStyle: 'italic', color: W.cream, lineHeight: 1.05, letterSpacing: '0.01em' }}>
              القهوة
            </div>
            <BrushStroke width={300} weight={4}/>
          </div>
          {/* Photo + items */}
          <div style={{ display: 'flex', direction: 'rtl', gap: fl(14, 28), alignItems: 'flex-start' }}>
            <PhotoCircle src={P.espresso} size={fl(88, 168)} alt="espresso"/>
            <div style={{ flex: 1, paddingTop: 6, minWidth: 0 }}>
              {['إسبريسو سينجل', 'كابتشينو', 'كافيه لاتيه', 'فلات وايت', 'آيس لاتيه'].map((item, i) => (
                <CoverItem key={i} item={item} big/>
              ))}
            </div>
            {/* Leaf decoration */}
            <div style={{ paddingTop: 10, flexShrink: 0 }}>
              <GoldLeaf size={32} rotate={-18}/>
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 24px', minHeight: 24 }}/>

        {/* ── SECTION 2: DRINKS ─────────────────────────────── */}
        <div>
          <div style={{ direction: 'rtl', marginBottom: 14 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: fl(26, 46), fontStyle: 'italic', color: W.cream, lineHeight: 1.05, opacity: 0.9 }}>
              مشروبات متنوعة
            </div>
            <BrushStroke width={230} weight={3}/>
          </div>
          <div style={{ display: 'flex', direction: 'rtl', gap: fl(14, 28), alignItems: 'flex-start' }}>
            <PhotoCircle src={P.smoothie} size={fl(72, 130)} alt="smoothie"/>
            <div style={{ flex: 1, paddingTop: 4, minWidth: 0 }}>
              {['موهيتو كلاسيك', 'ميلك شيك شوكليت', 'فرابيه قهوة', 'عصير مانجو'].map((item, i) => (
                <CoverItem key={i} item={item} big={false}/>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: '1.4 1 28px', minHeight: 28 }}/>

        {/* ── BOTTOM LABEL ──────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: BODY, fontSize: 8, color: W.muted, letterSpacing: '0.28em', textTransform: 'uppercase', direction: 'ltr' }}>
            Galaxy Café · قائمة المشروبات · 2025
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <GoldLeaf size={16} rotate={25}/>
            <GoldLeaf size={20} rotate={0}/>
            <GoldLeaf size={16} rotate={-25}/>
          </div>
        </div>
      </div>

      <SheetFrame double/>
      <GoldStrip edge="top"/>
      <GoldStrip edge="bottom"/>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// INNER PAGE COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Section header with optional photo circle
function SectionHeader({ ar, en, photo }: { ar: string; en: string; photo?: string }) {
  return (
    <div style={{ marginBottom: 12, direction: 'rtl' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: fl(10, 14), marginBottom: 8 }}>
        {photo && (
          <div style={{ flexShrink: 0, marginBottom: 4 }}>
            <PhotoCircle src={photo} size={fl(40, 52)} alt={en}/>
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: DISPLAY, fontSize: fl(21, 26), fontStyle: 'italic', color: W.cream, lineHeight: 1.05 }}>
            {ar}
          </div>
        </div>
      </div>
      <BrushStroke width={160} weight={3}/>
      <div style={{ fontFamily: BODY, fontSize: 6.5, color: W.muted, letterSpacing: '0.26em', textTransform: 'uppercase', direction: 'ltr', marginTop: 5, opacity: 0.75 }}>
        {en}
      </div>
    </div>
  )
}

// Standard menu item row
function MenuItem({ item, even }: { item: string; even: boolean }) {
  return (
    <div style={{
      display: 'flex', direction: 'rtl', alignItems: 'center',
      padding: '5.5px 5px',
      backgroundColor: even ? W.rowEven : 'transparent',
    }}>
      <span style={{ fontFamily: BODY, fontSize: 13, fontStyle: 'italic', color: W.cream, flex: 1, lineHeight: 1.4 }}>{item}</span>
      <span style={{ color: W.dim, fontSize: 9, letterSpacing: '4px', marginLeft: 10, flexShrink: 0 }}>——</span>
      <span style={{ fontFamily: BODY, fontSize: 12, color: W.gold, direction: 'ltr', minWidth: 18, textAlign: 'right', marginLeft: 8, flexShrink: 0 }}>—</span>
    </div>
  )
}

// Full section: header + items
function Section({ d, photo }: { d: typeof D.hotCoffee; photo?: string }) {
  return (
    <div style={{ marginBottom: fl(18, 24) }}>
      <SectionHeader ar={d.ar} en={d.en} photo={photo}/>
      {d.items.map((item, i) => <MenuItem key={i} item={item} even={i % 2 === 0}/>)}
    </div>
  )
}

// Inner page shell
function Page({ children, pageNum }: { children: ReactNode; pageNum: number }) {
  return (
    <div className="gx-sheet" style={{
      ...woodBg, position: 'relative', overflow: 'hidden',
      minHeight: 'min(141vw, 1123px)',
      flexShrink: 0, boxShadow: '0 14px 60px rgba(0,0,0,0.8)',
    }}>
      {/* Cup photo top-right accent */}
      <img src={P.cup} alt=""
        style={{
          position: 'absolute', top: 0, right: 0, width: '29%', aspectRatio: '230 / 160',
          objectFit: 'cover', opacity: 0.1, zIndex: 0,
          maskImage: 'radial-gradient(ellipse at 100% 0%, black 20%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 100% 0%, black 20%, transparent 65%)',
        }}/>
      {/* Main content */}
      <div style={{ padding: `${fl(22, 36)} ${fl(15, 50)} ${fl(46, 70)}`, position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      {/* Page number */}
      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
        <GoldLeaf size={14} rotate={90}/>
        <span style={{ fontFamily: BODY, fontSize: 9, color: W.muted, letterSpacing: '0.24em', direction: 'ltr' }}>{pageNum}</span>
        <GoldLeaf size={14} rotate={-90}/>
      </div>
      <SheetFrame/>
      <GoldStrip edge="top"/>
      <GoldStrip edge="bottom"/>
    </div>
  )
}

// Page header (brand + divider + label)
function PageHeader() {
  return (
    <div style={{ display: 'flex', direction: 'rtl', alignItems: 'center', justifyContent: 'space-between', marginBottom: fl(22, 32), paddingBottom: 18, borderBottom: `0.5px solid ${W.rule}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: fl(10, 14), direction: 'rtl', minWidth: 0 }}>
        <PhotoCircle src={P.espresso} size={fl(34, 42)} alt="coffee"/>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: DISPLAY, fontSize: fl(18, 22), fontStyle: 'italic', color: W.cream, lineHeight: 1 }}>جالاكسي</div>
          <div style={{ fontFamily: BODY, fontSize: 6.5, color: W.muted, letterSpacing: '0.22em', textTransform: 'uppercase', direction: 'ltr', marginTop: 3 }}>Galaxy Café</div>
        </div>
      </div>
      <div style={{ flex: 1, margin: `0 ${fl(10, 20)}`, height: 1, background: `linear-gradient(to right, transparent, ${W.gold}40, transparent)` }}/>
      <div style={{ fontFamily: BODY, fontSize: 7.5, color: W.gold, letterSpacing: '0.28em', textTransform: 'uppercase', direction: 'ltr', opacity: 0.85, flexShrink: 0 }}>
        قائمة المشروبات
      </div>
    </div>
  )
}

// Two-column inner page layout. `.gx-cols` collapses to one column on a
// narrow sheet and `.gx-rule` (the divider) drops out with it.
function TwoColPage({ left, right, n }: { left: ReactNode; right: ReactNode; n: number }) {
  return (
    <Page pageNum={n}>
      <PageHeader/>
      <div className="gx-cols">
        <div className="gx-rule"/>
        <div style={{ minWidth: 0 }}>{left}</div>
        <div style={{ minWidth: 0 }}>{right}</div>
      </div>
    </Page>
  )
}

// ═══════════════════════════════════════════════════════════════
// INNER PAGES
// ═══════════════════════════════════════════════════════════════

function InnerPages() {
  const S = (d: typeof D.hotCoffee, photo?: string) => <Section d={d} photo={photo}/>

  return (
    <>
      <TwoColPage n={2}
        left={<>{S(D.hotCoffee, P.espresso)}{S(D.icedCoffee, P.iced)}</>}
        right={<>{S(D.turkish)}{S(D.tea, P.matcha)}</>}
      />
      <TwoColPage n={3}
        left={<>{S(D.herbal, P.matcha)}</>}
        right={<>{S(D.chocolate)}{S(D.winter)}{S(D.mojito)}</>}
      />
      <TwoColPage n={4}
        left={<>{S(D.milkshake, P.smoothie)}</>}
        right={<>{S(D.frappe)}{S(D.juices)}</>}
      />
      <TwoColPage n={5}
        left={<>{S(D.smoothie, P.smoothie)}{S(D.waterSoda)}</>}
        right={<>{S(D.extras)}</>}
      />
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  return (
    <div style={{
      backgroundColor: '#0D0B08', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: 'clamp(14px, 4vw, 32px) clamp(10px, 3vw, 24px)',
      gap: 'clamp(16px, 3vw, 28px)',
      // Consumed by the responsive rules in index.css.
      '--gx-gold': W.gold,
      '--gx-gold-35': `${W.gold}35`,
    } as React.CSSProperties}>
      <Cover/>
      <InnerPages/>
    </div>
  )
}
