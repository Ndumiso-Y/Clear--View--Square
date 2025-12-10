import { useState, useRef, useEffect } from 'react'

// Knowledge Base - ONLY source of truth for chatbot responses
const KNOWLEDGE_BASE = {
  centre: {
    name: "Clearview Square Shopping Centre",
    address: "166 Kock Street, Rustenburg Central (next to Engen Garage and Kenny G's)",
    status: "NOW OPEN",
    hours: {
      weekday: "Monday–Friday: 08:00–20:00",
      saturday: "Saturday: 08:00–15:00",
      sunday: "Sunday & Public Holidays: 08:00–15:00",
      note: "Individual stores may vary"
    },
    facilities: [
      "250+ secure parking bays (basement + outdoor)",
      "Backup generator",
      "24/7 security",
      "Outdoor seating",
      "Anchor supermarket (Checkers)"
    ],
    contact: {
      email: "clearviewsquare@gmail.com",
      phone: ["071 363 2116", "082 229 3580"]
    }
  },

  stores: [
    // ANCHORS
    { name: "Checkers", category: "Anchors", description: "Full supermarket offering fresh produce & essentials" },
    { name: "Mugg & Bean", category: "Anchors", description: "Restaurant & coffee shop" },
    { name: "Clicks", category: "Anchors", description: "Health, beauty & pharmacy" },

    // GROCERIES / FOOD & DRINK
    { name: "Checkers LiquorShop", category: "Food & Drink", description: "Alcohol (18+ only)", ageRestricted: true },
    { name: "Boesmanland Biltong", category: "Food & Drink", description: "Biltong & dried meats" },
    { name: "Fish & Chips", category: "Food & Drink", description: "Fried fish, seafood, fast meals" },
    { name: "Spice Haven", category: "Food & Drink", description: "Spices, herbs, specialty ingredients" },
    { name: "Milky Lane", category: "Food & Drink", description: "Ice cream, waffles, sweet treats" },

    // FASHION & FOOTWEAR
    { name: "PnP Clothing", category: "Fashion", description: "Affordable fashion for family" },
    { name: "Next Step Clothing", category: "Fashion", description: "Trendy men's & women's clothing" },

    // HEALTH & BEAUTY
    { name: "CannAfrica", category: "Health & Beauty", description: "CBD wellness" },
    { name: "Better Sight Solutions", category: "Health & Beauty", description: "Eye tests, glasses" },

    // ELECTRONICS & TECH
    { name: "Vuse", category: "Electronics & Tech", description: "Vape products (18+ only)", ageRestricted: true },
    { name: "Electronics Hub", category: "Electronics & Tech", description: "Tech accessories" },
    { name: "Gaming Zone", category: "Electronics & Tech", description: "Games & consoles" },
    { name: "PC Link", category: "Electronics & Tech", description: "Repairs, upgrades" },

    // SERVICES
    { name: "Man Cave Barber", category: "Services", description: "Haircuts & grooming" },
    { name: "Cash Crusaders", category: "Services", description: "Buy/sell goods, loans" },
    { name: "Postlink", category: "Services", description: "Courier & postal services" },
    { name: "Brands SA", category: "Services", description: "Marketing & branding services" },

    // PETS & SPECIALTY
    { name: "Pet Shop", category: "Pets & Specialty", description: "Pet food & accessories" },
    { name: "London Petal", category: "Pets & Specialty", description: "Flowers & gifts" },

    // FITNESS
    { name: "F45", category: "Fitness", description: "Group HIIT training gym" },

    // FINANCIAL
    { name: "Capitec ATM", category: "Financial", description: "24/7 cash withdrawals" },
    { name: "Nedbank ATM", category: "Financial", description: "Cash withdrawals" }
  ],

  leasing: {
    welcome: "Leasing enquiries welcome for aligned tenants",
    benefits: ["High foot traffic", "Strong anchors", "Modern finishes", "Secure parking"],
    contact: {
      phone: ["071 363 2116", "082 229 3580"],
      email: ["clearviewsquare@gmail.com", "imobileera@gmail.com"]
    }
  },

  lostAndFound: {
    handler: "Centre Management",
    requirements: [
      "Your name",
      "Contact number",
      "Date & time you were at the mall",
      "Description of the item",
      "Where it may have been lost (e.g., 'near Checkers', basement parking)"
    ],
    notes: [
      "Items are logged and stored for a limited period",
      "Proof of ownership may be required"
    ],
    contact: "clearviewsquare@gmail.com"
  }
}

const ESCALATION_MESSAGE = {
  text: "I'm not able to answer that yet. Please contact Centre Management.",
  contact: {
    email: "clearviewsquare@gmail.com",
    phones: ["071 363 2116", "082 229 3580"]
  }
}

// AI Response Generator
function generateResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim()

  // GREETING
  if (msg.match(/^(hi|hello|hey|good morning|good afternoon|howzit|sawubona)/)) {
    return {
      type: 'text',
      message: "Hey there! 👋 Welcome to Clearview Square! I'm here to help you find stores, check our hours, or answer any questions about the mall. What can I help you with today?"
    }
  }

  // HOURS / OPENING TIMES
  if (msg.match(/(hours|open|close|time|opening|closing|when.*open)/)) {
    return {
      type: 'text',
      message: `Great question! Here are our trading hours:\n\n📅 **${KNOWLEDGE_BASE.centre.hours.weekday}**\n📅 **${KNOWLEDGE_BASE.centre.hours.saturday}**\n📅 **${KNOWLEDGE_BASE.centre.hours.sunday}**\n\n*Note: ${KNOWLEDGE_BASE.centre.hours.note}*`
    }
  }

  // LOCATION / ADDRESS / WHERE
  if (msg.match(/(where|location|address|directions|find you|how.*get)/)) {
    return {
      type: 'text',
      message: `You'll find us at:\n\n📍 **${KNOWLEDGE_BASE.centre.address}**\n\nWe're right next to Engen Garage and Kenny G's in Rustenburg Central. Easy to spot!`
    }
  }

  // PARKING
  if (msg.match(/park(ing)?/)) {
    return {
      type: 'text',
      message: `We've got plenty of secure parking! 🚗\n\n✅ ${KNOWLEDGE_BASE.centre.facilities[0]}\n\nYou can park in the basement or outdoor bays. Safe and convenient!`
    }
  }

  // FACILITIES
  if (msg.match(/(facilities|amenities|what.*have|features)/)) {
    const facilities = KNOWLEDGE_BASE.centre.facilities.map(f => `✅ ${f}`).join('\n')
    return {
      type: 'text',
      message: `Here's what we offer at Clearview Square:\n\n${facilities}\n\nWe've got everything you need for a safe, comfortable shopping experience!`
    }
  }

  // LOST & FOUND
  if (msg.match(/(lost|found|missing|left.*behind)/)) {
    const requirements = KNOWLEDGE_BASE.lostAndFound.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')
    return {
      type: 'text',
      message: `Oh no! Lost something? Don't worry, Lost & Found is handled by Centre Management.\n\n**Please provide:**\n${requirements}\n\n${KNOWLEDGE_BASE.lostAndFound.notes.join('\n')}\n\n📧 Contact: ${KNOWLEDGE_BASE.lostAndFound.contact}`
    }
  }

  // LEASING
  if (msg.match(/(lease|leasing|rent|tenant|shop space|available space)/)) {
    const benefits = KNOWLEDGE_BASE.leasing.benefits.map(b => `✅ ${b}`).join('\n')
    return {
      type: 'text',
      message: `Interested in leasing? Great choice! 🏪\n\n**Why Clearview Square?**\n${benefits}\n\n${KNOWLEDGE_BASE.leasing.welcome}.`,
      showContact: true
    }
  }

  // SPECIFIC STORE SEARCHES
  const storeKeywords = {
    'checkers': ['checkers', 'supermarket', 'groceries', 'grocery'],
    'mugg': ['mugg', 'bean', 'coffee', 'restaurant'],
    'clicks': ['clicks', 'pharmacy', 'health'],
    'liquor': ['liquor', 'alcohol', 'wine', 'beer'],
    'biltong': ['biltong', 'boesmanland'],
    'fish': ['fish', 'chips'],
    'spice': ['spice', 'herbs'],
    'milky': ['milky lane', 'ice cream', 'waffles'],
    'pnp': ['pnp', 'clothing', 'fashion'],
    'next step': ['next step'],
    'cannafrica': ['cannafrica', 'cbd'],
    'sight': ['sight', 'glasses', 'eye'],
    'vuse': ['vuse', 'vape'],
    'electronics': ['electronics hub', 'tech accessories'],
    'gaming': ['gaming', 'games', 'console'],
    'pc': ['pc link', 'computer'],
    'barber': ['barber', 'man cave', 'haircut'],
    'cash crusaders': ['cash crusaders'],
    'postlink': ['postlink', 'courier', 'postal'],
    'brands sa': ['brands sa', 'branding'],
    'pet': ['pet shop', 'pets'],
    'flowers': ['london petal', 'flowers', 'gifts'],
    'f45': ['f45', 'gym', 'fitness'],
    'atm': ['atm', 'cash', 'capitec', 'nedbank']
  }

  for (const [key, keywords] of Object.entries(storeKeywords)) {
    if (keywords.some(kw => msg.includes(kw))) {
      const stores = KNOWLEDGE_BASE.stores.filter(s =>
        s.name.toLowerCase().includes(key) || keywords.some(kw => s.name.toLowerCase().includes(kw))
      )

      if (stores.length > 0) {
        const storeList = stores.map(s => {
          let info = `**${s.name}** – ${s.description}`
          if (s.ageRestricted) info += ' ⚠️'
          return info
        }).join('\n\n')

        return {
          type: 'text',
          message: `Sure, I can help with that! 😊\n\n${storeList}`
        }
      }
    }
  }

  // GENERAL STORE LIST
  if (msg.match(/(stores|shops|what.*sell|what.*have|tenant|list)/)) {
    const anchors = KNOWLEDGE_BASE.stores.filter(s => s.category === 'Anchors')
    const categories = [...new Set(KNOWLEDGE_BASE.stores.map(s => s.category))]

    return {
      type: 'text',
      message: `We have 26 great stores at Clearview Square! 🛍️\n\n**Our Anchors:**\n${anchors.map(s => `• ${s.name}`).join('\n')}\n\n**Categories:**\n${categories.map(c => `• ${c}`).join('\n')}\n\nWhat type of store are you looking for?`
    }
  }

  // AGE RESTRICTIONS (Alcohol, Vape, CBD)
  if (msg.match(/(18|age|alcohol|vape|cbd|restrict)/)) {
    return {
      type: 'text',
      message: `Here's what you need to know:\n\n🔞 **Alcohol** (Checkers LiquorShop) – Only sold to persons 18+\n🔞 **Vaping products** (Vuse) – Only for persons 18+\n✅ **CBD items** (CannAfrica) – Legal wellness products\n\nValid ID required for age-restricted purchases.`
    }
  }

  // CONTACT INFO
  if (msg.match(/(contact|phone|email|call|reach)/)) {
    return {
      type: 'text',
      message: `You can reach Centre Management here:\n\n📧 **Email:** ${KNOWLEDGE_BASE.centre.contact.email}\n📞 **Phone:** ${KNOWLEDGE_BASE.centre.contact.phone.join(' / ')}\n\nWe're here to help!`,
      showContact: true
    }
  }

  // STOCK AVAILABILITY - ESCALATE
  if (msg.match(/(stock|available|have.*in stock|sell.*product)/)) {
    return {
      type: 'escalation',
      ...ESCALATION_MESSAGE
    }
  }

  // COMPLAINTS/INCIDENTS - ESCALATE
  if (msg.match(/(complain|complaint|issue|problem|incident|security)/)) {
    return {
      type: 'escalation',
      ...ESCALATION_MESSAGE
    }
  }

  // JOBS/HR - ESCALATE
  if (msg.match(/(job|hiring|vacancy|work|employ|cv|apply)/)) {
    return {
      type: 'escalation',
      ...ESCALATION_MESSAGE
    }
  }

  // EVENTS - ESCALATE
  if (msg.match(/(event|promotion|marketing|advert)/)) {
    return {
      type: 'escalation',
      ...ESCALATION_MESSAGE
    }
  }

  // THANK YOU
  if (msg.match(/(thank|thanks|appreciate)/)) {
    return {
      type: 'text',
      message: "You're very welcome! 😊 Anything else I can help you with today?"
    }
  }

  // DEFAULT - ESCALATE (anything not in Knowledge Base)
  return {
    type: 'escalation',
    ...ESCALATION_MESSAGE
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi there! 👋 I'm your Clearview Square assistant. Ask me about stores, hours, facilities, or anything else!",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Generate bot response
    setTimeout(() => {
      const response = generateResponse(inputValue)

      const botMessage = {
        type: 'bot',
        text: response.message || response.text,
        showContact: response.showContact,
        isEscalation: response.type === 'escalation',
        contact: response.contact,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    }, 800)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-300 group"
          aria-label="Open chat"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <div className="font-bold">Clearview Square</div>
                <div className="text-xs text-white/80 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Online now
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} rounded-2xl px-4 py-3 shadow-sm`}>
                  <div className="text-sm whitespace-pre-line">{msg.text}</div>

                  {/* Show contact buttons for escalation or leasing */}
                  {(msg.isEscalation || msg.showContact) && (
                    <div className="mt-3 space-y-2">
                      <a
                        href={`mailto:${msg.contact?.email || KNOWLEDGE_BASE.centre.contact.email}`}
                        className="block bg-blue-500 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        📩 Email Us
                      </a>
                      <a
                        href={`tel:${(msg.contact?.phones || KNOWLEDGE_BASE.centre.contact.phone)[0].replace(/\s/g, '')}`}
                        className="block bg-green-500 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        📞 Call Us
                      </a>
                    </div>
                  )}

                  <div className="text-[10px] mt-2 opacity-60">
                    {msg.timestamp.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
