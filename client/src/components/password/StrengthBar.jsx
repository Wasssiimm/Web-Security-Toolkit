const STRENGTHS = [
  { label: 'Very Weak', bar: 'bg-red-500',    text: 'text-red-400',    width: '20%'  },
  { label: 'Weak',      bar: 'bg-orange-500', text: 'text-orange-400', width: '40%'  },
  { label: 'Fair',      bar: 'bg-yellow-500', text: 'text-yellow-400', width: '60%'  },
  { label: 'Strong',    bar: 'bg-lime-500',   text: 'text-lime-400',   width: '80%'  },
  { label: 'Very Strong', bar: 'bg-green-500', text: 'text-green-400', width: '100%' },
]

export default function StrengthBar({ score = 0, label }) {
  const s = STRENGTHS[score] ?? STRENGTHS[0]

  return (
    <div className="space-y-2">
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${s.bar}`}
          style={{ width: s.width }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Password strength</span>
        <span className={`font-medium ${s.text}`}>{label ?? s.label}</span>
      </div>
    </div>
  )
}
