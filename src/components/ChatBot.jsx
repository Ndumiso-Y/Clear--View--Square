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
    {
      name: "Checkers",
      category: "Anchors",
      description: "Full-service supermarket offering fresh produce, groceries, household essentials. May include Checkers LiquorShop attachment. Sixty60 delivery available",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Mugg & Bean",
      category: "Anchors",
      description: "Full-service coffeehouse serving breakfast, lunch, baked goods and specialty coffee. Sit-down & takeaway formats",
      hours: "Default centre hours (confirm with store). Local store may open earlier for breakfast"
    },
    {
      name: "Clicks",
      category: "Anchors",
      description: "National pharmacy and beauty retailer. Pharmacy services, ClubCard loyalty benefits",
      hours: "Default centre hours (confirm with store). Some Clicks pharmacies open earlier or close later"
    },

    // GROCERIES / FOOD & DRINK
    {
      name: "Checkers LiquorShop",
      category: "Food & Drink",
      description: "LiquorShop attached to Checkers selling wines, beers, spirits. Age restriction: 18+",
      ageRestricted: true,
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Boesmanland Biltong",
      category: "Food & Drink",
      description: "Biltong and dried meats. Local specialty retailer",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Fish & Chips",
      category: "Food & Drink",
      description: "Fish & chips takeaway: fried fish, chips, sauces. Menu varies",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Spice Haven",
      category: "Food & Drink",
      description: "Specialty spices, herbs and ethnic ingredients",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Milky Lane",
      category: "Food & Drink",
      description: "Waffles, milkshakes, sundaes and dessert items. May offer delivery via third-party platforms",
      hours: "Default centre hours (confirm with store)"
    },

    // RETAIL & VARIETY
    {
      name: "The Crazy Store",
      category: "Retail",
      description: "Discount variety store. Household items, toys, stationery, seasonal goods and bargains",
      hours: "Default centre hours (confirm with store)"
    },

    // FASHION & FOOTWEAR
    {
      name: "PnP Clothing",
      category: "Fashion",
      description: "Affordable family clothing ranges from Pick n Pay Clothing",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Next Step Clothing",
      category: "Fashion",
      description: "Trendy clothing & footwear for men and women",
      hours: "Default centre hours (confirm with store)"
    },

    // HEALTH & BEAUTY
    {
      name: "CannAfrica",
      category: "Health & Beauty",
      description: "CBD and wellness products: oils, topicals, edibles. Not medical advice",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Better Sight Solutions",
      category: "Health & Beauty",
      description: "Vision testing, glasses and vision solutions. Verify optometrist qualifications and appointments",
      hours: "Default centre hours (confirm with store)"
    },

    // ELECTRONICS & TECH
    {
      name: "Vuse",
      category: "Electronics & Tech",
      description: "Vape products and accessories. Age restriction: 18+",
      ageRestricted: true,
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Electronics Hub",
      category: "Electronics & Tech",
      description: "Phone accessories, chargers, small electronics and possible repairs",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Gaming Zone",
      category: "Electronics & Tech",
      description: "Games, consoles and accessories. Possibly arcade or events",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "PC Link",
      category: "Electronics & Tech",
      description: "Computer repairs, upgrades, data recovery and tech support",
      hours: "Default centre hours (confirm with store)"
    },

    // SERVICES
    {
      name: "Man Cave Barber",
      category: "Services",
      description: "Cuts, shaves and grooming services. Walk-ins accepted or by appointment",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Cash Crusaders",
      category: "Services",
      description: "Buy/sell pre-owned goods, short-term loans (pawn), and tested used items for resale",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Postlink",
      category: "Services",
      description: "Courier and postal services, parcel collection. Confirm whether PostNet/Post Office franchise",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "Brands SA",
      category: "Services",
      description: "Marketing and brand development services (agency)",
      hours: "Default centre hours (confirm with store)"
    },

    // PETS & SPECIALTY
    {
      name: "Pet Shop",
      category: "Pets & Specialty",
      description: "Pet food, toys, accessories. Possible grooming services (confirm)",
      hours: "Default centre hours (confirm with store)"
    },
    {
      name: "London Petal",
      category: "Pets & Specialty",
      description: "Florist for arrangements, bouquets and gifts. Check same-day order policy",
      hours: "Default centre hours (confirm with store)"
    },

    // FITNESS
    {
      name: "F45",
      category: "Fitness",
      description: "Group HIIT classes. Booking via F45 app or studio. Memberships and trials available",
      hours: "Studio hours: classes typically within morning and evening peaks (confirm studio schedule). Booking required via F45 app or studio"
    },

    // FINANCIAL
    {
      name: "Capitec ATM",
      category: "Financial",
      description: "Self-service ATM for cash withdrawals and balance enquiries (Capitec policies apply)",
      hours: "ATM: 24/7 (subject to maintenance)"
    },
    {
      name: "Nedbank ATM",
      category: "Financial",
      description: "Self-service Nedbank ATM for cash withdrawals. Specific functionality depends on machine model",
      hours: "ATM: 24/7 (subject to maintenance)"
    }
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
    'crazy': ['crazy store', 'variety', 'discount', 'toys', 'stationery'],
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
          if (s.hours) info += `\n⏰ Hours: ${s.hours}`
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
  const [weather, setWeather] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  // Fetch weather for greeting
  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    if (!apiKey) return

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Rustenburg,ZA&units=metric&appid=${apiKey}`
        )
        if (response.ok) {
          const data = await response.json()
          setWeather({
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            condition: data.weather[0].main
          })
        }
      } catch (error) {
        // Silently fail
      }
    }

    fetchWeather()
  }, [])

  // Generate initial greeting with weather
  const getInitialGreeting = () => {
    const hour = new Date().getHours()
    let timeGreeting = "Hi there"
    if (hour < 12) timeGreeting = "Good morning"
    else if (hour < 18) timeGreeting = "Good afternoon"
    else timeGreeting = "Good evening"

    if (weather) {
      return `${timeGreeting}! It's ${weather.temp}°C and ${weather.description} in Rustenburg today. 🌤️ I'm your Clearview Square assistant. How can I help you?`
    }
    return `${timeGreeting}! 👋 I'm your Clearview Square assistant. Ask me about stores, hours, facilities, or anything else!`
  }

  const [messages, setMessages] = useState([])

  // Update initial message when weather loads or component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        type: 'bot',
        text: getInitialGreeting(),
        timestamp: new Date(),
        showQuickActions: true
      }])
    }
  }, [weather])

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
          <div className="bg-gradient-to-r from-brand-dark to-brand-accent text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL || '/'}assets/hero/Tree isolated.webp`}
                  alt="Clearview Square"
                  className="w-full h-full object-contain"
                />
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
                <div className={`max-w-[85%] ${msg.type === 'user' ? 'bg-brand-dark text-white' : 'bg-white text-brand-dark border border-brand-accentSoft'} rounded-2xl px-4 py-3 shadow-sm`}>
                  <div className="text-sm whitespace-pre-line">{msg.text}</div>

                  {/* Show contact buttons for escalation or leasing */}
                  {(msg.isEscalation || msg.showContact) && (
                    <div className="mt-3 space-y-2">
                      <a
                        href={`mailto:${msg.contact?.email || KNOWLEDGE_BASE.centre.contact.email}`}
                        className="block bg-brand-dark text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-brand-accent transition-colors"
                      >
                        📩 Email Us
                      </a>
                      <a
                        href={`tel:${(msg.contact?.phones || KNOWLEDGE_BASE.centre.contact.phone)[0].replace(/\s/g, '')}`}
                        className="block bg-green-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        📞 Call Us
                      </a>
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  {msg.showQuickActions && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setInputValue("What stores do you have?")}
                        className="bg-brand-accentSoft text-brand-dark text-center py-2 px-3 rounded-lg text-xs font-medium hover:bg-brand-light hover:text-white transition-colors"
                      >
                        🏪 Find a Store
                      </button>
                      <button
                        onClick={() => setInputValue("What are your hours?")}
                        className="bg-brand-accentSoft text-brand-dark text-center py-2 px-3 rounded-lg text-xs font-medium hover:bg-brand-light hover:text-white transition-colors"
                      >
                        🕐 Centre Hours
                      </button>
                      <button
                        onClick={() => setInputValue("I lost something")}
                        className="bg-brand-accentSoft text-brand-dark text-center py-2 px-3 rounded-lg text-xs font-medium hover:bg-brand-light hover:text-white transition-colors"
                      >
                        🔍 Lost & Found
                      </button>
                      <button
                        onClick={() => setInputValue("Leasing information")}
                        className="bg-brand-accentSoft text-brand-dark text-center py-2 px-3 rounded-lg text-xs font-medium hover:bg-brand-light hover:text-white transition-colors"
                      >
                        🏢 Leasing
                      </button>
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
                className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-brand-dark text-white rounded-full p-3 hover:bg-brand-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
