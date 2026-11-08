// ================================
// ISIGameSwitch - Pencarian Tanggal Rilis Otomatis (Wikidata)
// Dipakai di admin.html saja.
// ================================
//
// Sumber data: Wikidata (gratis, tanpa API key, tanpa daftar).
// 1. Cari judul lewat wbsearchentities.
// 2. Ambil tanggal rilis (P577) kandidat lewat wbgetentities, utamakan
//    tanggal rilis untuk platform Nintendo Switch (P400 = Q19610114).

const WD_SWITCH = 'Q19610114';   // Nintendo Switch
const WD_VIDEO_GAME = 'Q7889';   // video game

function normalizeGameTitle(str) {
    return String(str || '')
        .toLowerCase()
        .normalize('NFKD').replace(/[̀-ͯ]/g, '')
        .replace(/[™®©]/g, '')
        .replace(/\b(nintendo switch( 2)?|switch( 2)? edition|for nintendo switch)\b/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

// Skor kemiripan judul (0..1). Judul yang persis sama selalu menang.
function titleSimilarity(a, b) {
    const na = normalizeGameTitle(a), nb = normalizeGameTitle(b);
    if (!na || !nb) return 0;
    if (na === nb) return 1;
    const wa = new Set(na.split(' ')), wb = new Set(nb.split(' '));
    let common = 0;
    wa.forEach(w => { if (wb.has(w)) common++; });
    const score = (2 * common) / (wa.size + wb.size);
    return (na.includes(nb) || nb.includes(na)) ? Math.min(0.95, score + 0.15) : Math.min(0.95, score);
}

function isValidIsoDate(s) {
    return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

const WD_TIMEOUT_MS = 12000;

async function wdJson(url) {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), WD_TIMEOUT_MS) : null;
    let res;
    try {
        res = await fetch(url, ctrl ? { signal: ctrl.signal } : {});
    } catch (e) {
        throw new Error(e && e.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK');
    } finally {
        if (timer) clearTimeout(timer);
    }
    if (res.status === 429) throw new Error('HTTP_429');
    if (!res.ok) throw new Error('HTTP_' + res.status);
    return res.json();
}

const WD_API = 'https://www.wikidata.org/w/api.php?';

async function searchWikidata(title, lang) {
    const qs = new URLSearchParams({
        action: 'wbsearchentities', search: title, language: lang, uselang: lang,
        type: 'item', limit: '10', format: 'json', origin: '*'
    });
    const data = await wdJson(WD_API + qs.toString());
    return (data && Array.isArray(data.search)) ? data.search : [];
}

// Ambil klaim P31 (jenis), P400 (platform), P577 (tanggal rilis) langsung dari API Wikidata
async function getReleaseStatements(qids) {
    const qs = new URLSearchParams({
        action: 'wbgetentities', ids: qids.slice(0, 50).join('|'),
        props: 'claims', format: 'json', origin: '*'
    });
    const data = await wdJson(WD_API + qs.toString());
    const entities = (data && data.entities) || {};
    const idOf = snak => snak && snak.datavalue && snak.datavalue.value && snak.datavalue.value.id;
    const rows = [];
    Object.keys(entities).forEach(id => {
        const claims = entities[id].claims || {};
        const types = (claims.P31 || []).map(c => idOf(c.mainsnak));
        if (!types.includes(WD_VIDEO_GAME)) return;
        const onSwitch = (claims.P400 || []).some(c => idOf(c.mainsnak) === WD_SWITCH);
        (claims.P577 || []).forEach(c => {
            if (c.rank === 'deprecated') return;
            const v = c.mainsnak && c.mainsnak.datavalue && c.mainsnak.datavalue.value;
            if (!v || !v.time) return;
            const plats = ((c.qualifiers && c.qualifiers.P400) || []).map(idOf);
            rows.push({
                item: id,
                time: String(v.time).replace(/^\+/, ''),   // contoh: 2017-04-28T00:00:00Z
                prec: Number(v.precision) || 0,
                forSwitch: plats.includes(WD_SWITCH),
                onSwitch
            });
        });
    });
    return rows;
}


/**
 * Cari tanggal rilis sebuah judul game.
 * Mengembalikan { date: 'YYYY-MM-DD', matchedTitle, source } atau null jika tidak ketemu.
 */
async function fetchReleaseDate(title) {
    const q = String(title || '').trim();
    if (!q) return null;

    // Cari dalam bahasa Inggris (judul game umumnya Inggris), lalu gabungkan dengan hasil bahasa Indonesia
    let hits = await searchWikidata(q, 'en');
    if (hits.length < 3) {
        try { hits = hits.concat(await searchWikidata(q, 'id')); } catch (e) { /* abaikan */ }
    }

    // Kumpulkan kandidat yang judulnya cukup mirip
    const candidates = new Map();
    hits.forEach(h => {
        const names = [h.label, h.match && h.match.text].concat(h.aliases || []).filter(Boolean);
        const score = Math.max(0, ...names.map(n => titleSimilarity(q, n)));
        if (score >= 0.5 && (!candidates.has(h.id) || candidates.get(h.id).score < score)) {
            candidates.set(h.id, { id: h.id, label: h.label || q, score });
        }
    });
    if (candidates.size === 0) return null;

    const rows = await getReleaseStatements([...candidates.keys()]);
    if (rows.length === 0) return null;

    // Kelompokkan tanggal per game
    const byItem = new Map();
    rows.forEach(r => {
        if (r.time.startsWith('-')) return;
        const date = r.time.slice(0, 10);
        if (!isValidIsoDate(date)) return;
        if (!byItem.has(r.item)) byItem.set(r.item, { onSwitch: r.onSwitch, dates: [] });
        byItem.get(r.item).dates.push({ date, prec: r.prec, forSwitch: r.forSwitch });
    });
    if (byItem.size === 0) return null;

    // Pilih game terbaik: judul paling mirip, utamakan yang tersedia di Switch
    let best = null, bestRank = -1;
    byItem.forEach((info, id) => {
        const cand = candidates.get(id);
        if (!cand) return;
        const rank = cand.score + (info.onSwitch ? 0.3 : 0);
        if (rank > bestRank) { best = { id, cand, info }; bestRank = rank; }
    });
    if (!best) return null;

    // Pilih tanggal: tanggal khusus Switch dulu, lalu yang paling presisi, lalu paling awal
    const dates = best.info.dates.slice().sort((a, b) =>
        (b.forSwitch - a.forSwitch) || (b.prec - a.prec) || a.date.localeCompare(b.date));
    const chosen = dates[0];
    // Presisi tahun/bulan disimpan sebagai tanggal 1 di periode itu
    let date = chosen.date;
    if (chosen.prec === 10) date = date.slice(0, 8) + '01';
    if (chosen.prec <= 9) date = date.slice(0, 5) + '01-01';

    return {
        date,
        matchedTitle: best.cand.label,
        source: 'Wikidata',
        approximate: chosen.prec < 11
    };
}

function releaseErrorMessage(err) {
    const m = err && err.message;
    if (m === 'HTTP_429') return 'Terlalu banyak permintaan ke Wikidata, tunggu sebentar lalu coba lagi.';
    if (m === 'TIMEOUT') return 'Wikidata tidak merespons. Kemungkinan diblokir jaringan/ISP: coba jaringan lain (mis. data seluler) atau isi manual.';
    if (m === 'NETWORK') return 'Tidak bisa terhubung ke Wikidata. Cek koneksi internet atau coba jaringan lain.';
    return 'Gagal mengambil data dari Wikidata. Coba lagi nanti.';
}
