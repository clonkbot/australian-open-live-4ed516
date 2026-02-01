import { useState, useEffect } from 'react'

interface Player {
  name: string
  country: string
  flag: string
  seed?: number
}

interface MatchResult {
  id: number
  round: string
  player1: Player
  player2: Player
  score: string
  winner: 1 | 2
  court: string
}

interface LiveMatch {
  player1: Player
  player2: Player
  sets: { p1: number; p2: number }[]
  currentGame: { p1: number; p2: number }
  serving: 1 | 2
  status: string
}

interface OddsPlayer {
  name: string
  country: string
  flag: string
  odds: number
  change: 'up' | 'down' | 'same'
}

const matchResults: MatchResult[] = [
  {
    id: 1,
    round: "Men's Semi-Final",
    player1: { name: 'Jannik Sinner', country: 'ITA', flag: '🇮🇹', seed: 1 },
    player2: { name: 'Ben Shelton', country: 'USA', flag: '🇺🇸', seed: 21 },
    score: '7-6(2) 6-2 6-2',
    winner: 1,
    court: 'Rod Laver Arena'
  },
  {
    id: 2,
    round: "Men's Semi-Final",
    player1: { name: 'Alexander Zverev', country: 'GER', flag: '🇩🇪', seed: 2 },
    player2: { name: 'Novak Djokovic', country: 'SRB', flag: '🇷🇸', seed: 7 },
    score: '7-6(5) 7-6(4) 6-2',
    winner: 1,
    court: 'Rod Laver Arena'
  },
  {
    id: 3,
    round: "Women's Semi-Final",
    player1: { name: 'Aryna Sabalenka', country: 'BLR', flag: '🇧🇾', seed: 1 },
    player2: { name: 'Paula Badosa', country: 'ESP', flag: '🇪🇸', seed: 11 },
    score: '6-4 6-2',
    winner: 1,
    court: 'Rod Laver Arena'
  },
  {
    id: 4,
    round: "Women's Semi-Final",
    player1: { name: 'Madison Keys', country: 'USA', flag: '🇺🇸', seed: 19 },
    player2: { name: 'Iga Swiatek', country: 'POL', flag: '🇵🇱', seed: 2 },
    score: '5-7 6-1 7-6(8)',
    winner: 1,
    court: 'Rod Laver Arena'
  },
  {
    id: 5,
    round: "Mixed Doubles QF",
    player1: { name: 'Hsieh/Zielinski', country: 'TPE/POL', flag: '🇹🇼' },
    player2: { name: 'Dabrowski/Pavic', country: 'CAN/CRO', flag: '🇨🇦' },
    score: '6-3 7-5',
    winner: 1,
    court: 'Margaret Court Arena'
  },
  {
    id: 6,
    round: "Men's Doubles SF",
    player1: { name: 'Arevalo/Pavic', country: 'ESA/CRO', flag: '🇸🇻' },
    player2: { name: 'Bolelli/Vavassori', country: 'ITA', flag: '🇮🇹' },
    score: '6-4 3-6 6-4',
    winner: 2,
    court: 'John Cain Arena'
  }
]

const liveMatchData: LiveMatch = {
  player1: { name: 'Jannik Sinner', country: 'ITA', flag: '🇮🇹', seed: 1 },
  player2: { name: 'Alexander Zverev', country: 'GER', flag: '🇩🇪', seed: 2 },
  sets: [
    { p1: 6, p2: 3 },
    { p1: 7, p2: 6 },
    { p1: 4, p2: 5 }
  ],
  currentGame: { p1: 30, p2: 40 },
  serving: 2,
  status: '3rd Set'
}

const tournamentOdds: OddsPlayer[] = [
  { name: 'Jannik Sinner', country: 'ITA', flag: '🇮🇹', odds: 1.45, change: 'up' },
  { name: 'Alexander Zverev', country: 'GER', flag: '🇩🇪', odds: 2.80, change: 'down' },
  { name: 'Aryna Sabalenka', country: 'BLR', flag: '🇧🇾', odds: 1.55, change: 'same' },
  { name: 'Madison Keys', country: 'USA', flag: '🇺🇸', odds: 2.40, change: 'up' }
]

function TennisBall({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="w-8 h-8 rounded-full bg-[#C4D600] animate-ball shadow-lg shadow-[#C4D600]/30">
        <div className="absolute inset-1 rounded-full border border-white/30" style={{ borderStyle: 'dashed' }} />
      </div>
    </div>
  )
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  
  useEffect(() => {
    const finals = new Date()
    finals.setHours(19, 30, 0, 0)
    if (finals.getTime() < Date.now()) {
      finals.setDate(finals.getDate() + 1)
    }
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = finals.getTime() - now
      
      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div className="flex gap-4 justify-center">
      {[
        { value: timeLeft.hours, label: 'HRS' },
        { value: timeLeft.minutes, label: 'MIN' },
        { value: timeLeft.seconds, label: 'SEC' }
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#C4D600] to-[#9AAA00] rounded-lg flex items-center justify-center animate-glow">
            <span className="font-display text-4xl md:text-5xl text-[#0C2340]">
              {item.value.toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs tracking-[0.3em] text-white/60 mt-2 block">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function LiveScorecard({ match }: { match: LiveMatch }) {
  const [currentGame, setCurrentGame] = useState(match.currentGame)
  const [serving, setServing] = useState(match.serving)
  
  useEffect(() => {
    const interval = setInterval(() => {
      const points = [0, 15, 30, 40]
      const randomP1 = points[Math.floor(Math.random() * points.length)]
      const randomP2 = points[Math.floor(Math.random() * points.length)]
      setCurrentGame({ p1: randomP1, p2: randomP2 })
      setServing(Math.random() > 0.5 ? 1 : 2)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="bg-gradient-to-br from-[#1a3a5c] to-[#0C2340] rounded-2xl p-6 border border-[#C4D600]/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4D600]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FF6B35]/5 rounded-full blur-3xl" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-sm font-semibold tracking-wider">LIVE</span>
        </div>
        <span className="text-white/50 text-sm">{match.status}</span>
      </div>
      
      <div className="space-y-3">
        {[match.player1, match.player2].map((player, idx) => {
          const playerNum = (idx + 1) as 1 | 2
          const isServing = serving === playerNum
          return (
            <div key={idx} className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${isServing ? 'bg-white/5 animate-score' : ''}`}>
              <div className="w-6 flex justify-center">
                {isServing && <TennisBall className="scale-50" />}
              </div>
              <span className="text-2xl">{player.flag}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{player.name}</span>
                  {player.seed && <span className="text-[#C4D600] text-xs">({player.seed})</span>}
                </div>
              </div>
              <div className="flex gap-3">
                {match.sets.map((set, setIdx) => (
                  <div key={setIdx} className={`w-8 h-8 flex items-center justify-center rounded ${
                    setIdx === match.sets.length - 1 ? 'bg-[#C4D600]/20 text-[#C4D600]' : 'bg-white/10 text-white/70'
                  }`}>
                    <span className="font-display text-lg">{idx === 0 ? set.p1 : set.p2}</span>
                  </div>
                ))}
                <div className="w-10 h-8 flex items-center justify-center bg-[#FF6B35]/20 text-[#FF6B35] rounded">
                  <span className="font-display text-lg">{idx === 0 ? currentGame.p1 : currentGame.p2}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-white/40">
        <span>Rod Laver Arena</span>
        <span>Men's Singles Final</span>
      </div>
    </div>
  )
}

function MatchResultCard({ match, delay }: { match: MatchResult; delay: string }) {
  return (
    <div className={`bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 hover:border-[#C4D600]/30 transition-all duration-300 hover:transform hover:scale-[1.02] opacity-0 animate-slide-up ${delay}`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-[#C4D600] text-xs font-semibold tracking-wider">{match.round}</span>
        <span className="text-white/40 text-xs">{match.court}</span>
      </div>
      
      {[match.player1, match.player2].map((player, idx) => {
        const isWinner = match.winner === idx + 1
        return (
          <div key={idx} className={`flex items-center gap-3 py-2 ${isWinner ? '' : 'opacity-50'}`}>
            <span className="text-xl">{player.flag}</span>
            <span className={`flex-1 ${isWinner ? 'text-white font-semibold' : 'text-white/70'}`}>
              {player.name}
            </span>
            {player.seed && <span className="text-white/40 text-xs">({player.seed})</span>}
            {isWinner && <span className="text-[#C4D600]">✓</span>}
          </div>
        )
      })}
      
      <div className="mt-3 pt-3 border-t border-white/10">
        <span className="font-display text-lg text-white/80 tracking-wider">{match.score}</span>
      </div>
    </div>
  )
}

function OddsCard({ player, index }: { player: OddsPlayer; index: number }) {
  const changeIcon = player.change === 'up' ? '↑' : player.change === 'down' ? '↓' : '−'
  const changeColor = player.change === 'up' ? 'text-green-400' : player.change === 'down' ? 'text-red-400' : 'text-white/40'
  
  return (
    <div className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#FF6B35]/30 transition-all opacity-0 animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
      <span className="font-display text-2xl text-white/30">#{index + 1}</span>
      <span className="text-2xl">{player.flag}</span>
      <div className="flex-1">
        <span className="text-white font-medium">{player.name}</span>
        <span className="text-white/40 text-sm block">{player.country}</span>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2">
          <span className={`${changeColor} text-sm`}>{changeIcon}</span>
          <span className="font-display text-2xl text-[#FF6B35]">{player.odds.toFixed(2)}</span>
        </div>
        <span className="text-white/40 text-xs">to win</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0C2340] court-pattern relative">
      <div className="fixed inset-0 noise-overlay pointer-events-none" />
      
      {/* Hero Section */}
      <header className="relative overflow-hidden diagonal-slice bg-gradient-to-br from-[#0C2340] via-[#1a3a5c] to-[#0C2340] pb-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#C4D600]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4A90D9]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
        </div>
        
        <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6">
          <div className="flex items-center gap-3 opacity-0 animate-fade">
            <TennisBall />
            <span className="font-display text-2xl text-white tracking-wider">AO 2025</span>
          </div>
          <div className="hidden md:flex gap-8 text-white/70 text-sm">
            {['Schedule', 'Draws', 'Players', 'Tickets'].map((item, i) => (
              <a key={item} href="#" className={`hover:text-[#C4D600] transition-colors opacity-0 animate-fade`} style={{ animationDelay: `${i * 0.1}s` }}>
                {item}
              </a>
            ))}
          </div>
        </nav>
        
        <div className="relative z-10 text-center pt-12 md:pt-20 px-6">
          <div className="opacity-0 animate-slide-up">
            <span className="inline-block px-4 py-1 bg-[#C4D600]/20 text-[#C4D600] text-sm rounded-full mb-6 tracking-wider">
              JANUARY 12 - 26, 2025 • MELBOURNE
            </span>
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white mb-4 opacity-0 animate-slide-up delay-100">
            AUSTRALIAN
          </h1>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-[#C4D600] to-[#FF6B35] mb-8 opacity-0 animate-slide-up delay-200">
            OPEN
          </h1>
          
          <p className="text-white/60 max-w-xl mx-auto mb-12 opacity-0 animate-fade delay-300">
            The Grand Slam of Asia/Pacific. Where champions are crowned under the Melbourne sun.
          </p>
        </div>
      </header>
      
      {/* Finals Countdown */}
      <section className="relative -mt-10 px-6 md:px-12 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#0C2340] via-[#1a3a5c] to-[#0C2340] rounded-2xl p-8 border border-[#C4D600]/20 text-center">
            <h2 className="font-display text-3xl text-white mb-2">MEN'S FINAL STARTS IN</h2>
            <p className="text-white/50 mb-6">Sinner vs Zverev • Rod Laver Arena • 7:30 PM AEDT</p>
            <CountdownTimer />
          </div>
        </div>
      </section>
      
      {/* Live Scorecard */}
      <section className="px-6 md:px-12 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-display text-3xl text-white">LIVE NOW</h2>
          </div>
          <LiveScorecard match={liveMatchData} />
        </div>
      </section>
      
      {/* Match Results */}
      <section className="px-6 md:px-12 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl text-white">RECENT RESULTS</h2>
            <a href="#" className="text-[#C4D600] text-sm hover:underline">View All →</a>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchResults.map((match, i) => (
              <MatchResultCard key={match.id} match={match} delay={`delay-${(i + 1) * 100}`} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Tournament Odds */}
      <section className="px-6 md:px-12 mb-16 diagonal-slice-reverse bg-gradient-to-br from-[#1a3a5c]/50 to-transparent pt-20 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[#FF6B35] font-display text-lg">★</span>
            <h2 className="font-display text-3xl text-white">CHAMPIONSHIP ODDS</h2>
          </div>
          <p className="text-white/50 mb-8">Current favorites to lift the trophy</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {tournamentOdds.map((player, i) => (
              <OddsCard key={player.name} player={player} index={i} />
            ))}
          </div>
          
          <p className="text-white/30 text-xs mt-6 text-center">
            Odds provided for informational purposes only. Must be 18+ to gamble. Please bet responsibly.
          </p>
        </div>
      </section>
      
      {/* Quick Stats */}
      <section className="px-6 md:px-12 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '128', label: 'Players' },
              { value: '26', label: 'Countries' },
              { value: 'A$75M', label: 'Prize Money' },
              { value: '15', label: 'Days of Tennis' }
            ].map((stat, i) => (
              <div key={i} className={`text-center p-6 bg-white/5 rounded-xl border border-white/10 opacity-0 animate-slide-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="font-display text-4xl text-[#C4D600] mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <TennisBall />
              <span className="font-display text-xl text-white">AUSTRALIAN OPEN 2025</span>
            </div>
            <div className="flex gap-6 text-white/40 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/30 text-xs">
              Requested by <span className="text-white/50">@PekataAdakandra</span> · Built by <span className="text-white/50">@clonkbot</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}