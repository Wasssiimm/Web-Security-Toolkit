const STRENGTHS = [
  { label: 'Very Weak',   bar: 'from-red-500 to-red-400',         text: 'text-red-500 dark:text-red-400',         width: '20%'  },
  { label: 'Weak',        bar: 'from-orange-500 to-orange-400',   text: 'text-orange-500 dark:text-orange-400',   width: '40%'  },
  { label: 'Fair',        bar: 'from-yellow-500 to-yellow-400',   text: 'text-yellow-600 dark:text-yellow-400',   width: '60%'  },
  { label: 'Strong',      bar: 'from-lime-500 to-lime-400',       text: 'text-lime-700 dark:text-lime-400',       width: '80%'  },
  { label: 'Very Strong', bar: 'from-emerald-500 to-emerald-400', text: 'text-emerald-600 dark:text-emerald-400', width: '100%' },
]

export default function StrengthBar({ score = 0, label }) {
  const s = STRENGTHS[score] ?? STRENGTHS[0]

  return (
    <div className="panel p-6 space-y-3">
      <div className="flex justify-between text-xs font-mono-cyber">
        <span className="text-gray-500 dark:text-[#555] uppercase tracking-wider">Strength</span>
        <span className={`font-semibold uppercase tracking-wider ${s.text}`}>{label ?? s.label}</span>
      </div>
      <div className="relative h-2 bg-gray-100 dark:bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${s.bar}`}
          style={{ width: s.width }}
        />
      </div>
      <div className="grid grid-cols-5 gap-1">
        {STRENGTHS.map((tier, i) => (
          <div
            key={tier.label}
            className={`h-0.5 rounded-full transition-colors ${
              i <= score ? `bg-gradient-to-r ${tier.bar}` : 'bg-gray-100 dark:bg-[#1a1a1a]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
