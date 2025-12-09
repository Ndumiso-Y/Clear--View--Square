import { useEffect, useState } from 'react'

// Weather icon mapping component (large size for widget)
function WeatherIcon({ condition }) {
  const getIcon = () => {
    const conditionLower = condition?.toLowerCase() || ''

    // Clear / Sunny
    if (conditionLower === 'clear') {
      return (
        <svg className="w-16 h-16 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: '3s' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }

    // Clouds
    if (conditionLower === 'clouds') {
      return (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    }

    // Rain / Drizzle
    if (conditionLower === 'rain' || conditionLower === 'drizzle') {
      return (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15zm5 5l-1 2m4-2l-1 2m4-2l-1 2m4-2l-1 2" />
        </svg>
      )
    }

    // Thunderstorm
    if (conditionLower === 'thunderstorm') {
      return (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }

    // Snow
    if (conditionLower === 'snow') {
      return (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20m10-10H2m17-7l-10 10m0-10l10 10M7 7l10 10M7 17l10-10" />
        </svg>
      )
    }

    // Mist / Fog / Haze / Smoke / Dust
    if (conditionLower === 'mist' || conditionLower === 'fog' || conditionLower === 'haze' || conditionLower === 'smoke' || conditionLower === 'dust') {
      return (
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15h18M3 9h18M3 12h18" opacity="0.6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" opacity="0.4" />
        </svg>
      )
    }

    // Fallback - partly cloudy
    return (
      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  }

  return getIcon()
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  // Scoped blue color system for weather widget (condition-based)
  const getWeatherColors = (condition) => {
    const conditionLower = condition?.toLowerCase() || ''

    // Clear / Sunny - bright sky blue
    if (conditionLower === 'clear') {
      return {
        from: 'from-sky-400/95',
        via: 'via-blue-500/95',
        to: 'to-blue-600/95'
      }
    }

    // Clouds - softer, dimmer blue
    if (conditionLower === 'clouds') {
      return {
        from: 'from-slate-400/90',
        via: 'via-slate-500/90',
        to: 'to-slate-600/90'
      }
    }

    // Rain / Drizzle - deeper blue
    if (conditionLower === 'rain' || conditionLower === 'drizzle') {
      return {
        from: 'from-blue-600/95',
        via: 'via-blue-700/95',
        to: 'to-blue-800/95'
      }
    }

    // Thunderstorm - dark stormy blue
    if (conditionLower === 'thunderstorm') {
      return {
        from: 'from-slate-700/95',
        via: 'via-slate-800/95',
        to: 'to-slate-900/95'
      }
    }

    // Snow - cool light blue
    if (conditionLower === 'snow') {
      return {
        from: 'from-cyan-300/90',
        via: 'via-cyan-400/90',
        to: 'to-cyan-500/90'
      }
    }

    // Mist / Fog / Haze - soft gray-blue
    if (conditionLower === 'mist' || conditionLower === 'fog' || conditionLower === 'haze' || conditionLower === 'smoke' || conditionLower === 'dust') {
      return {
        from: 'from-gray-400/85',
        via: 'via-gray-500/85',
        to: 'to-gray-600/85'
      }
    }

    // Default - standard blue
    return {
      from: 'from-sky-500/90',
      via: 'via-blue-600/90',
      to: 'to-indigo-700/90'
    }
  }

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY

    // If no API key, silently fail
    if (!apiKey) {
      setLoading(false)
      return
    }

    // Fetch weather for Rustenburg
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Rustenburg,ZA&units=metric&appid=${apiKey}`
        )

        if (!response.ok) {
          setLoading(false)
          return
        }

        const data = await response.json()
        setWeather({
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          condition: data.weather[0].main
        })
        setLoading(false)
      } catch (error) {
        // Silently fail on network errors
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  // Don't render if no weather data
  if (loading || !weather) {
    return null
  }

  const colors = getWeatherColors(weather.condition)

  return (
    <div className="relative mt-6 rounded-2xl overflow-hidden shadow-2xl">
      {/* Gradient background with condition-based tint */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.from} ${colors.via} ${colors.to}`}></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

      {/* Content */}
      <div className="relative p-6">
        {/* Top row: Location + Live badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium text-white/90 uppercase tracking-wide">Rustenburg</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Main area: Temperature + Icon */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-6xl md:text-7xl font-bold text-white tracking-tight">
              {weather.temp}°
            </div>
            <div className="text-lg text-white/90 mt-1 capitalize">
              {weather.description}
            </div>
          </div>
          <div className="flex-shrink-0">
            <WeatherIcon condition={weather.condition} />
          </div>
        </div>

        {/* Bottom row: Updated info */}
        <div className="flex items-center gap-1.5 text-xs text-white/70">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Updated moments ago</span>
        </div>
      </div>
    </div>
  )
}
