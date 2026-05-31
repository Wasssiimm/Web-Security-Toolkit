import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

function arcColor(score) {
  if (score >= 8) return '#4ade80'
  if (score >= 5) return '#facc15'
  if (score >= 3) return '#fb923c'
  return '#f87171'
}

export default function ScoreCircle({ score = 0, grade = '?' }) {
  const { dark } = useTheme()
  const color = arcColor(score)
  const data = [{ value: (score / 10) * 100, fill: color }]
  const trackFill = dark ? '#1a1a1a' : '#e5e7eb'

  return (
    <div className="relative w-36 h-36">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="90%"
          startAngle={90}
          endAngle={-270}
          data={data}
          barSize={12}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            background={{ fill: trackFill }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold leading-none" style={{ color }}>
          {grade}
        </span>
        <span className="text-xs text-gray-500 dark:text-[#555] mt-1">{score}/10</span>
      </div>
    </div>
  )
}
