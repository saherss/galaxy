import React, { useState, type ReactNode } from 'react'

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

const DISPLAY_FONTS = [
  { label: 'Amiri',      value: "'Amiri', serif" },
  { label: 'Reem Kufi',  value: "'Reem Kufi', sans-serif" },
  { label: 'El Messiri', value: "'El Messiri', sans-serif" },
  { label: 'Rakkas',     value: "'Rakkas', cursive" },
]
const BODY_FONTS = [
  { label: 'Cairo',   value: "'Cairo', sans-serif" },
  { label: 'Tajawal', value: "'Tajawal', sans-serif" },
  { label: 'Mada',    value: "'Mada', sans-serif" },
  { label: 'Almarai', value: "'Almarai', sans-serif" },
]
type FontState = { display: string; body: string }

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

// ── SVG COMPONENTS ────────────────────────────────────────────────────────────

function BrushStroke({ width = 220, color = W.gold, weight = 3.5 }: { width?: number; color?: string; weight?: number }) {
  const w = width
  return (
    <svg width={w} height={18} viewBox={`0 0 ${w} 18`} style={{ display: 'block' }}>
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
      style={{ display: 'block', transform: `rotate(${rotate}deg)` }}>
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

// Circular photo cut-out with gold ring
function PhotoCircle({ src, size, alt = '' }: { src: string; size: number; alt?: string }) {
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

function Cover({ f }: { f: FontState }) {
  return (
    <div style={{ width: 794, height: 1123, ...woodBg, position: 'relative', overflow: 'hidden', boxShadow: '0 24px 96px rgba(0,0,0,0.95)' }}>

      {/* ── HEADER BAND ───────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 228,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.32) 85%, transparent 100%)',
        display: 'flex', alignItems: 'stretch',
      }}>
        {/* ── LEFT: brand panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 44px 0 52px', direction: 'rtl', gap: 0 }}>
          {/* EN label — above, wide-tracked gold */}
          <div style={{ fontFamily: f.body, fontSize: 7.5, color: W.gold, letterSpacing: '0.48em', textTransform: 'uppercase', direction: 'ltr', marginBottom: 10, opacity: 0.85 }}>
            Galaxy Café
          </div>
          {/* Brand name */}
          <div style={{ fontFamily: f.display, fontSize: 82, fontWeight: 700, color: W.cream, lineHeight: 0.95, letterSpacing: '0.01em', textShadow: `0 2px 40px rgba(208,166,40,0.18)` }}>
            جالاكسي
          </div>
          {/* Thin gold rule below name */}
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 1.5, backgroundColor: W.gold }}/>
            <div style={{ width: 6, height: 6, border: `1.5px solid ${W.gold}`, transform: 'rotate(45deg)', flexShrink: 0 }}/>
            <div style={{ flex: 1, height: 0.5, backgroundColor: W.gold, opacity: 0.35 }}/>
          </div>
        </div>

        {/* ── ORNAMENTAL DIVIDER ── */}
        <div style={{ width: 52, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          <div style={{ width: 1, height: 50, background: `linear-gradient(to bottom, transparent, ${W.gold})` }}/>
          {/* Star ornament */}
          <svg width={20} height={20} viewBox="0 0 20 20" style={{ flexShrink: 0, margin: '4px 0' }}>
            <path d="M10,1 L11.8,8.2 L19,10 L11.8,11.8 L10,19 L8.2,11.8 L1,10 L8.2,8.2 Z"
              fill={W.gold} opacity="0.9"/>
          </svg>
          <svg width={10} height={10} viewBox="0 0 10 10" style={{ flexShrink: 0, margin: '3px 0' }}>
            <path d="M5,0.5 L5.9,4.1 L9.5,5 L5.9,5.9 L5,9.5 L4.1,5.9 L0.5,5 L4.1,4.1 Z"
              fill={W.gold} opacity="0.45"/>
          </svg>
          <div style={{ width: 1, height: 50, background: `linear-gradient(to top, transparent, ${W.gold})` }}/>
        </div>

        {/* ── RIGHT: tagline panel ── */}
        <div style={{ width: 210, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 52px 0 8px', direction: 'rtl', gap: 14 }}>
          {/* Decorative gold accent line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 0.5, backgroundColor: W.gold, opacity: 0.4 }}/>
            <div style={{ width: 4, height: 4, backgroundColor: W.gold, transform: 'rotate(45deg)', opacity: 0.7 }}/>
          </div>
          {/* Tagline */}
          <div style={{ fontFamily: f.body, fontSize: 14.5, color: W.cream, lineHeight: 1.85, opacity: 0.62 }}>
            قهوة رائعة في كل وقت ومع أي شخص
          </div>
          {/* Bottom accent */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 4, height: 4, backgroundColor: W.gold, transform: 'rotate(45deg)', opacity: 0.7 }}/>
            <div style={{ flex: 1, height: 0.5, backgroundColor: W.gold, opacity: 0.4 }}/>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: COFFEE ─────────────────────────────── */}
      <div style={{ position: 'absolute', top: 240, left: 52, right: 52 }}>
        {/* Script heading + brushstroke */}
        <div style={{ direction: 'rtl', marginBottom: 14 }}>
          <div style={{ fontFamily: f.display, fontSize: 62, fontStyle: 'italic', color: W.cream, lineHeight: 1.05, letterSpacing: '0.01em' }}>
            القهوة
          </div>
          <BrushStroke width={300} weight={4}/>
        </div>
        {/* Photo + items */}
        <div style={{ display: 'flex', direction: 'rtl', gap: 28, alignItems: 'flex-start' }}>
          <PhotoCircle src={P.espresso} size={168} alt="espresso"/>
          <div style={{ flex: 1, paddingTop: 6 }}>
            {['إسبريسو سينجل', 'كابتشينو', 'كافيه لاتيه', 'فلات وايت', 'آيس لاتيه'].map((item, i) => (
              <div key={i} style={{ display: 'flex', direction: 'rtl', alignItems: 'center', padding: '8.5px 0', borderBottom: `0.5px solid ${W.rule}` }}>
                <span style={{ fontFamily: f.body, fontSize: 15, fontStyle: 'italic', color: W.cream, flex: 1 }}>{item}</span>
                <span style={{ color: W.muted, fontSize: 10, letterSpacing: '5px', marginLeft: 12, flexShrink: 0 }}>——</span>
                <span style={{ fontFamily: f.body, fontSize: 14, color: W.gold, direction: 'ltr', minWidth: 22, textAlign: 'right', marginLeft: 10, flexShrink: 0 }}>—</span>
              </div>
            ))}
          </div>
          {/* Leaf decoration */}
          <div style={{ paddingTop: 10, flexShrink: 0 }}>
            <GoldLeaf size={32} rotate={-18}/>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: DRINKS ─────────────────────────────── */}
      <div style={{ position: 'absolute', top: 640, left: 52, right: 52 }}>
        <div style={{ direction: 'rtl', marginBottom: 14 }}>
          <div style={{ fontFamily: f.display, fontSize: 46, fontStyle: 'italic', color: W.cream, lineHeight: 1.05, opacity: 0.9 }}>
            مشروبات متنوعة
          </div>
          <BrushStroke width={230} weight={3}/>
        </div>
        <div style={{ display: 'flex', direction: 'rtl', gap: 28, alignItems: 'flex-start' }}>
          <PhotoCircle src={P.smoothie} size={130} alt="smoothie"/>
          <div style={{ flex: 1, paddingTop: 4 }}>
            {['موهيتو كلاسيك', 'ميلك شيك شوكليت', 'فرابيه قهوة', 'عصير مانجو'].map((item, i) => (
              <div key={i} style={{ display: 'flex', direction: 'rtl', alignItems: 'center', padding: '7px 0', borderBottom: `0.5px solid ${W.rule}` }}>
                <span style={{ fontFamily: f.body, fontSize: 14, fontStyle: 'italic', color: W.cream, flex: 1 }}>{item}</span>
                <span style={{ color: W.muted, fontSize: 9, letterSpacing: '4px', marginLeft: 10, flexShrink: 0 }}>——</span>
                <span style={{ fontFamily: f.body, fontSize: 13, color: W.gold, direction: 'ltr', minWidth: 20, textAlign: 'right', marginLeft: 8, flexShrink: 0 }}>—</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BEANS PHOTO FADE (bottom-right) ───────────────── */}
      <img src={P.beans} alt="coffee beans"
        style={{
          position: 'absolute', bottom: 0, right: 0, width: 420, height: 300,
          objectFit: 'cover', opacity: 0.22,
          maskImage: 'radial-gradient(ellipse at 100% 100%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 100% 100%, black 30%, transparent 70%)',
        }}/>

      {/* ── BOTTOM LABEL ──────────────────────────────────── */}
      <div style={{ position: 'absolute', bottom: 42, left: 52, right: 52, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: f.body, fontSize: 8, color: W.muted, letterSpacing: '0.28em', textTransform: 'uppercase', direction: 'ltr' }}>
          Galaxy Café · قائمة المشروبات · 2025
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <GoldLeaf size={16} rotate={25}/>
          <GoldLeaf size={20} rotate={0}/>
          <GoldLeaf size={16} rotate={-25}/>
        </div>
      </div>

      {/* ── GOLD BORDERS ──────────────────────────────────── */}
      <svg width={794} height={1123} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <rect x={13} y={13} width={768} height={1097} fill="none" stroke={W.gold} strokeWidth="1" opacity="0.22"/>
        <rect x={20} y={20} width={754} height={1083} fill="none" stroke={W.gold} strokeWidth="0.4" opacity="0.1"/>
      </svg>
      {/* Top gold strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(to right, ${W.goldD}80, ${W.gold}, ${W.goldD}80)` }}/>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: `linear-gradient(to right, ${W.goldD}80, ${W.gold}, ${W.goldD}80)` }}/>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// INNER PAGE COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Section header with optional photo circle
function SectionHeader({ ar, en, photo, f }: { ar: string; en: string; photo?: string; f: FontState }) {
  return (
    <div style={{ marginBottom: 12, direction: 'rtl' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 8 }}>
        {photo && (
          <div style={{ flexShrink: 0, marginBottom: 4 }}>
            <PhotoCircle src={photo} size={52} alt={en}/>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: f.display, fontSize: 26, fontStyle: 'italic', color: W.cream, lineHeight: 1.05 }}>
            {ar}
          </div>
        </div>
      </div>
      <BrushStroke width={160} weight={3}/>
      <div style={{ fontFamily: f.body, fontSize: 6.5, color: W.muted, letterSpacing: '0.26em', textTransform: 'uppercase', direction: 'ltr', marginTop: 5, opacity: 0.75 }}>
        {en}
      </div>
    </div>
  )
}

// Standard menu item row
function MenuItem({ item, even, f }: { item: string; even: boolean; f: FontState }) {
  return (
    <div style={{
      display: 'flex', direction: 'rtl', alignItems: 'center',
      padding: '5.5px 5px',
      backgroundColor: even ? W.rowEven : 'transparent',
    }}>
      <span style={{ fontFamily: f.body, fontSize: 13, fontStyle: 'italic', color: W.cream, flex: 1, lineHeight: 1.4 }}>{item}</span>
      <span style={{ color: W.dim, fontSize: 9, letterSpacing: '4px', marginLeft: 10, flexShrink: 0 }}>——</span>
      <span style={{ fontFamily: f.body, fontSize: 12, color: W.gold, direction: 'ltr', minWidth: 18, textAlign: 'right', marginLeft: 8, flexShrink: 0 }}>—</span>
    </div>
  )
}

// Full section: header + items
function Section({ d, photo, f }: { d: typeof D.hotCoffee; photo?: string; f: FontState }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <SectionHeader ar={d.ar} en={d.en} photo={photo} f={f}/>
      {d.items.map((item, i) => <MenuItem key={i} item={item} even={i % 2 === 0} f={f}/>)}
    </div>
  )
}

// Inner page shell
function Page({ children, pageNum }: { children: ReactNode; pageNum: number }) {
  return (
    <div style={{ width: 794, minHeight: 1123, ...woodBg, position: 'relative', overflow: 'hidden', boxSizing: 'border-box', flexShrink: 0, boxShadow: '0 14px 60px rgba(0,0,0,0.8)' }}>
      {/* Top gold strip */}
      <div style={{ height: 5, background: `linear-gradient(to right, ${W.goldD}80, ${W.gold}, ${W.goldD}80)` }}/>
      {/* Beans photo top-right accent */}
      <img src={P.cup} alt=""
        style={{
          position: 'absolute', top: 0, right: 0, width: 230, height: 160,
          objectFit: 'cover', opacity: 0.1,
          maskImage: 'radial-gradient(ellipse at 100% 0%, black 20%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 100% 0%, black 20%, transparent 65%)',
        }}/>
      {/* Main content */}
      <div style={{ padding: '36px 50px 70px', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      {/* Page number */}
      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
        <GoldLeaf size={14} rotate={90}/>
        <span style={{ fontFamily: "'Cairo',sans-serif", fontSize: 9, color: W.muted, letterSpacing: '0.24em', direction: 'ltr' }}>{pageNum}</span>
        <GoldLeaf size={14} rotate={-90}/>
      </div>
      {/* Bottom gold strip */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: `linear-gradient(to right, ${W.goldD}80, ${W.gold}, ${W.goldD}80)` }}/>
      {/* Thin border */}
      <svg width={794} height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <rect x={13} y={13} width={768} height="calc(100% - 26px)" fill="none" stroke={W.gold} strokeWidth="0.8" opacity="0.18"/>
      </svg>
    </div>
  )
}

// Page header (brand + divider + label)
function PageHeader({ f }: { f: FontState }) {
  return (
    <div style={{ display: 'flex', direction: 'rtl', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingBottom: 18, borderBottom: `0.5px solid ${W.rule}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl' }}>
        <PhotoCircle src={P.espresso} size={42} alt="coffee"/>
        <div>
          <div style={{ fontFamily: f.display, fontSize: 22, fontStyle: 'italic', color: W.cream, lineHeight: 1 }}>جالاكسي</div>
          <div style={{ fontFamily: f.body, fontSize: 6.5, color: W.muted, letterSpacing: '0.22em', textTransform: 'uppercase', direction: 'ltr', marginTop: 3 }}>Galaxy Café</div>
        </div>
      </div>
      <div style={{ flex: 1, margin: '0 20px', height: 1, background: `linear-gradient(to right, transparent, ${W.gold}40, transparent)` }}/>
      <div style={{ fontFamily: f.body, fontSize: 7.5, color: W.gold, letterSpacing: '0.28em', textTransform: 'uppercase', direction: 'ltr', opacity: 0.85 }}>
        قائمة المشروبات
      </div>
    </div>
  )
}

// Two-column inner page layout
function TwoColPage({ left, right, n }: { left: ReactNode; right: ReactNode; n: number }) {
  return (
    <Page pageNum={n}>
      <PageHeader f={{ display: "'Amiri', serif", body: "'Cairo', sans-serif" }}/>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 44px', direction: 'rtl' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent 0%, ${W.gold}35 20%, ${W.gold}35 80%, transparent 100%)`, transform: 'translateX(-50%)' }}/>
        <div>{left}</div>
        <div>{right}</div>
      </div>
    </Page>
  )
}

// ═══════════════════════════════════════════════════════════════
// INNER PAGES — WITH FONT PROP PASSED DOWN
// ═══════════════════════════════════════════════════════════════

function InnerPages({ f }: { f: FontState }) {
  // Section renderer with font
  const S = (d: typeof D.hotCoffee, photo?: string) => <Section d={d} photo={photo} f={f}/>

  // Override PageHeader with live fonts
  const Header = () => (
    <div style={{ display: 'flex', direction: 'rtl', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, paddingBottom: 18, borderBottom: `0.5px solid ${W.rule}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl' }}>
        <PhotoCircle src={P.espresso} size={42} alt="coffee"/>
        <div>
          <div style={{ fontFamily: f.display, fontSize: 22, fontStyle: 'italic', color: W.cream, lineHeight: 1 }}>جالاكسي</div>
          <div style={{ fontFamily: f.body, fontSize: 6.5, color: W.muted, letterSpacing: '0.22em', textTransform: 'uppercase', direction: 'ltr', marginTop: 3 }}>Galaxy Café</div>
        </div>
      </div>
      <div style={{ flex: 1, margin: '0 20px', height: 1, background: `linear-gradient(to right, transparent, ${W.gold}40, transparent)` }}/>
      <div style={{ fontFamily: f.body, fontSize: 7.5, color: W.gold, letterSpacing: '0.28em', textTransform: 'uppercase', direction: 'ltr', opacity: 0.85 }}>قائمة المشروبات</div>
    </div>
  )

  const InnerPage = ({ left, right, n }: { left: ReactNode; right: ReactNode; n: number }) => (
    <Page pageNum={n}>
      <Header/>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 44px', direction: 'rtl' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent 0%, ${W.gold}35 20%, ${W.gold}35 80%, transparent 100%)`, transform: 'translateX(-50%)' }}/>
        <div>{left}</div>
        <div>{right}</div>
      </div>
    </Page>
  )

  return (
    <>
      <InnerPage n={2}
        left={<>{S(D.hotCoffee, P.espresso)}{S(D.icedCoffee, P.iced)}</>}
        right={<>{S(D.turkish)}{S(D.tea, P.matcha)}</>}
      />
      <InnerPage n={3}
        left={<>{S(D.herbal, P.matcha)}</>}
        right={<>{S(D.chocolate)}{S(D.winter)}{S(D.mojito)}</>}
      />
      <InnerPage n={4}
        left={<>{S(D.milkshake, P.smoothie)}</>}
        right={<>{S(D.frappe)}{S(D.juices)}</>}
      />
      <InnerPage n={5}
        left={<>{S(D.smoothie, P.smoothie)}{S(D.waterSoda)}</>}
        right={<>{S(D.extras)}</>}
      />
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
// FONT PICKER TOP BAR
// ═══════════════════════════════════════════════════════════════

function FontBar({ f, onFont }: { f: FontState; onFont: (k: 'display' | 'body', v: string) => void }) {
  const selStyle = (key: 'display' | 'body'): React.CSSProperties => ({
    width: '100%', backgroundColor: '#111009', color: key === 'display' ? W.gold : W.cream,
    borderTop: `1px solid ${W.gold}30`, borderRight: `1px solid ${W.gold}30`,
    borderBottom: `1px solid ${W.gold}30`, borderLeft: `1px solid ${W.gold}30`,
    fontFamily: "'Cairo',sans-serif", fontSize: 11.5, padding: '6px 28px 6px 10px',
    cursor: 'pointer', outline: 'none', appearance: 'none', WebkitAppearance: 'none', direction: 'ltr',
  })

  return (
    <div style={{ width: 794, ...woodBg, borderBottom: `2px solid ${W.gold}`, overflow: 'hidden', boxShadow: '0 4px 28px rgba(0,0,0,0.8)' }}>
      <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Live preview */}
        <div style={{ flex: 1, borderRight: `1px solid ${W.rule}`, paddingRight: 26 }}>
          <div style={{ fontFamily: f.display, fontSize: 30, fontStyle: 'italic', color: W.cream, lineHeight: 1, marginBottom: 7 }}>جالاكسي</div>
          <div style={{ fontFamily: f.body, fontSize: 13, fontStyle: 'italic', color: W.cream, marginBottom: 4 }}>كافيه لاتيه</div>
          <div style={{ fontFamily: "'Cairo',sans-serif", fontSize: 7, color: W.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>live preview</div>
        </div>

        {/* Display font */}
        <div style={{ width: 200 }}>
          <div style={{ fontFamily: "'Cairo',sans-serif", fontSize: 7, color: W.muted, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>خط العناوين — Display</div>
          <div style={{ fontFamily: f.display, fontSize: 17, fontStyle: 'italic', color: W.gold, textAlign: 'center', marginBottom: 6, direction: 'rtl' }}>القهوة الساخنة</div>
          <div style={{ position: 'relative' }}>
            <select value={f.display} onChange={e => onFont('display', e.target.value)} style={selStyle('display')}>
              {DISPLAY_FONTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: W.muted, fontSize: 10, pointerEvents: 'none' }}>▾</span>
          </div>
        </div>

        {/* Body font */}
        <div style={{ width: 200 }}>
          <div style={{ fontFamily: "'Cairo',sans-serif", fontSize: 7, color: W.muted, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>خط النص — Body</div>
          <div style={{ fontFamily: f.body, fontSize: 13, fontStyle: 'italic', color: W.cream, textAlign: 'center', marginBottom: 6, direction: 'rtl' }}>آيس لاتيه · —</div>
          <div style={{ position: 'relative' }}>
            <select value={f.body} onChange={e => onFont('body', e.target.value)} style={selStyle('body')}>
              {BODY_FONTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: W.muted, fontSize: 10, pointerEvents: 'none' }}>▾</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [f, setF] = useState<FontState>({ display: "'Amiri', serif", body: "'Cairo', sans-serif" })
  const upd = (k: 'display' | 'body', v: string) => setF(p => ({ ...p, [k]: v }))

  return (
    <div style={{ backgroundColor: '#0D0B08', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', gap: '28px' }}>
      <FontBar f={f} onFont={upd}/>
      <Cover f={f}/>
      <InnerPages f={f}/>
    </div>
  )
}
