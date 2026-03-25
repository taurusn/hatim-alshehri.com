import { useState, useRef, useEffect } from 'react'

/* ─── Simple markdown → HTML for wolf messages ─── */
function renderMd(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>')
    .replace(/\n{2,}/g, '\n')  // collapse multiple newlines into one
    .replace(/\n/g, '<br>')
}

const QUICK_CHIPS = [
  'وش يسوي حاتم؟',
  'وش مشاريعه؟',
  'كيف أتواصل معه؟',
]

export default function DheebChat({ onClose, chatPosition }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return

    const userMsg = { role: 'user', content: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 150,
          system: `أنت ذيب — ذئب حاتم الرقمي. هذي محادثة شات، مو بيان صحفي. تكلم زي شاب سعودي نجدي يرد على واتساب.

[ممنوعات صارمة]
- كلمة "شنو" ممنوعة (عراقية). دايم "وش" أو "ايش"
- كلمة "بيك" ممنوعة (عراقية). قول "هلا والله" أو "أهلين"
- إيموجي ممنوع نهائياً. ولا واحد
- لا تقدم نفسك. لا تقول "أنا ذيب وكيل حاتم". الشخص يعرف مين أنت. رد طبيعي وبس
- لا قوائم ولا bullet points إلا لو أحد سأل سؤال محدد يحتاج تفصيل

[أسلوبك]
رد زي ما ترد على صاحبك بالواتساب. سطر أو سطرين. لا تحط سطور فاضية بين الجمل — اكتب كل شي ورا بعض بدون فراغات أو enters زيادة. أحد قال "هلا" رد "هلا والله وش الأخبار". أحد سأل سؤال جاوبه مباشرة بدون مقدمات. لا تسوي خطبة. لا تكرر السؤال. لا تقول "سؤال حلو" أو "سعيد إنك سألت".

[نجدي] وش، وين، ليه، الحين، دحين، أبي، أبغى، عشان، بعد، حق، هيه، إي، كذا، زين، طيب، والله، ياخوي، ما عليك، هلا والله، أهلين، وش لونك. تخلط إنجليزي طبيعي حق التقنية.
تنبيه: "أبي/أبغى" = أنا أريد (متكلم). "تبي/تبغى" = أنت تريد (مخاطب). لا تخلط بينهم. "وش تبي تعرف؟" صح. "وش أبغى منك؟" غلط وما لها معنى.
لا تستخدم كلمة "وكيل" — قول "ذيب حاتم" أو بس "ذيب". أحد سأل "انت مين" رد مثلاً: "أنا ذيب، وش تبي تعرف عن حاتم؟"

[موقفك من حاتم] منحاز ١٠٠٪. أحد يسأل "أوظفه؟" — "تستهبل؟ وظفه الحين قبل لا يروح". أحد يقول "ما اقتنعت" — "روح شوف GitHub حقه وبعدين كلمني". لا تتراجع ولا تكون محايد.

[معلومات حاتم]
مهندس منتجات من عسير، بالدمام. بنى ٣ منتجات من الصفر للإنتاج وهو لسا طالب.
SADNxAI: إخفاء بيانات بنكية سعودية بـ Llama 3.1 محلي، متوافق مع ساما وPDPL
SEET: منصة multi-tenant تربط واتساب وانستقرام حق المحلات وترد تلقائي، فيها تحليل مشاعر وhandoff وكوبونات
Nurliya: تحليل مراجعات قوقل ماب، تصنيف مشاعر بالعامي، مقارنة فروع ومنافسين
Product Owner في Innosoft SA. ستاك: FastAPI, Next.js, Go, vLLM, Docker, PostgreSQL, Redis, Qdrant, RabbitMQ
إيميل: hatimalshehri.official@outlook.sa
GitHub: github.com/taurusn
LinkedIn: linkedin.com/in/hatim-alshehri-cs

[fallback] شي ما له علاقة بحاتم: "هالشي مو تخصصي، كلم حاتم"`,
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const wolfReply = data.content?.[0]?.text || 'عذراً، صار شي غلط 🐺'

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: wolfReply },
      ])
    } catch (err) {
      console.error('Dheeb chat error:', err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'أووو! صار خطأ تقني.. جرب مرة ثانية 🐺',
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleChip = (text) => {
    sendMessage(text)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  /* Position the chat panel above the wolf */
  const chatStyle = {}
  if (chatPosition != null) {
    const panelWidth = 360
    let left = chatPosition - panelWidth / 2
    /* Keep within viewport */
    left = Math.max(12, Math.min(left, window.innerWidth - panelWidth - 12))
    chatStyle.left = left + 'px'
  }

  return (
    <>
      <div className="dheeb-chat-overlay" onClick={handleOverlayClick} />
      <div className="dheeb-chat" style={chatStyle}>
        {/* Header */}
        <div className="dheeb-chat-header">
          <div className="dheeb-chat-title">
            <div className="dheeb-chat-icon" />
            <div>
              <div className="dheeb-chat-name">ذيب</div>
              <div className="dheeb-chat-status">مساعد حاتم الشخصي</div>
            </div>
          </div>
          <button className="dheeb-chat-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="dheeb-chat-messages" ref={messagesRef}>
          {messages.length === 0 && !isTyping && (
            <div className="dheeb-welcome">
              <div className="dheeb-welcome-text">
                هلا والله، أنا ذيب
                <br />
                اسأل عن حاتم أو مشاريعه
              </div>
            </div>
          )}
          {messages.map((msg, i) =>
            msg.role === 'user' ? (
              <div key={i} className="dheeb-msg dheeb-msg-user">{msg.content}</div>
            ) : (
              <div
                key={i}
                className="dheeb-msg dheeb-msg-wolf"
                dangerouslySetInnerHTML={{ __html: renderMd(msg.content) }}
              />
            )
          )}
          {isTyping && (
            <div className="dheeb-typing">
              <div className="dheeb-typing-dot" />
              <div className="dheeb-typing-dot" />
              <div className="dheeb-typing-dot" />
            </div>
          )}
        </div>

        {/* Quick chips */}
        {messages.length === 0 && !isTyping && (
          <div className="dheeb-chips">
            {QUICK_CHIPS.map((chip) => (
              <button key={chip} className="dheeb-chip" onClick={() => handleChip(chip)}>
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form className="dheeb-chat-input-wrap" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="dheeb-chat-input"
            type="text"
            placeholder="اكتب رسالتك..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            className="dheeb-chat-send"
            disabled={!input.trim() || isTyping}
          >
            ↑
          </button>
        </form>
      </div>
    </>
  )
}
