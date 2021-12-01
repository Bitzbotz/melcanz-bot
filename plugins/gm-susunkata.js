let fetch = require('node-fetch')
let timeout = 120000
let poin = 500

let handler = async (m, { conn, usedPrefix }) => {
    conn.susunkata = conn.susunkata ? conn.susunkata : {}
    let id = m.chat
    if (id in conn.susunkata) {
        conn.reply(m.chat, 'belum dijawab!', conn.susunkata[id][0])
        throw false
    }
    let res = await fetch(API('amel', '/game/susunkata', {}, 'apikey'))
    if (!res.ok) throw eror
    let json = await res.json()
    if (json.status != 200) throw json
    let caption = `
${json.result.soal}

Tipe: ${json.result.tipe}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}suka untuk bantuan
`.trim()
    conn.susunkata[id] = [
        await conn.sendButton(m.chat, caption, wm, 'Bantuan', '.suka', m),
        json, poin,
        setTimeout(async () => {
            if (conn.susunkata[id]) await conn.sendButton(m.chat, `Waktu habis!\nJawabannya adalah *${json.result.jawaban}*`, wm, 'Susun Kata', '.susunkata', conn.susunkata[id][0])
            delete conn.susunkata[id]
        }, timeout)
    ]
}
handler.help = ['susunkata']
handler.tags = ['game']
handler.command = /^susunkata/i

handler.game = true

module.exports = handler