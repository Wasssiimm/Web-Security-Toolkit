import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

function arcColor(score) {
  if (score >= 8) return '#4ade80'  // green-400
  if (score >= 5) return '#facc15'  // yellow-400
  if (score >= 3) return '#fb923c'  // orange-400
  return '#f87171'                   // red-400
}

export default function ScoreCircle({ score = 0, grade = '?' }) {
  const color = arcColor(score)
  // Normalise to 0-100 so Recharts fills the arc proportionally
  const data = [{ value: (score / 10) * 100, fill: color }]

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
            background={{ fill: '#1f2937' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold leading-none" style={{ color }}>
          {grade}
        </span>
        <span className="text-xs text-gray-400 mt-1">{score}/10</span>
      </div>
    </div>
  )
}
