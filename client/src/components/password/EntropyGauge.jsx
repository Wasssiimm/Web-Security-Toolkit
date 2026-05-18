import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

function arcColor(bits) {
  if (bits < 28)  return '#f87171'  // red-400    — Very weak
  if (bits < 36)  return '#fb923c'  // orange-400 — Weak
  if (bits < 60)  return '#facc15'  // yellow-400 — Fair
  if (bits < 128) return '#4ade80'  // green-400  — Strong
  return '#34d399'                   // emerald-400 — Very strong
}

export default function EntropyGauge({ entropy, effectiveEntropy, entropyLabel }) {
  const display = effectiveEntropy ?? entropy ?? 0
  const color   = arcColor(display)
  // Normalise to 0-100 for Recharts (scale is 0–128 bits)
  const data    = [{ value: Math.min(display, 128) / 128 * 100, fill: color }]
  const penalised = effectiveEntropy != null && effectiveEntropy < entropy

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Entropy</h3>

      <div className="flex items-center gap-6">
        {/* Radial gauge */}
        <div className="relative w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              data={data}
              barSize={10}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                background={{ fill: '#1f2937' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold leading-none" style={{ color }}>
              {Math.round(display)}
            </span>
            <span className="text-xs text-gray-500 mt-0.5">bits</span>
          </div>
        </div>

        {/* Text detail */}
        <div className="space-y-1.5">
          <p className="font-semibold" style={{ color }}>{entropyLabel}</p>
          <p className="text-sm text-gray-400">
            Effective entropy:{' '}
            <span className="text-gray-200">{display} bits</span>
          </p>
          {penalised && (
            <p className="text-xs text-gray-500">
              Raw: {entropy} bits — reduced by pattern penalties
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
