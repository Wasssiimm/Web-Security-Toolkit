import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

function arcColor(bits) {
  if (bits < 28)  return '#f87171'
  if (bits < 36)  return '#fb923c'
  if (bits < 60)  return '#facc15'
  if (bits < 128) return '#4ade80'
  return '#34d399'
}

export default function EntropyGauge({ entropy, effectiveEntropy, entropyLabel }) {
  const { dark } = useTheme()
  const display = effectiveEntropy ?? entropy ?? 0
  const color   = arcColor(display)
  const data    = [{ value: Math.min(display, 128) / 128 * 100, fill: color }]
  const penalised = effectiveEntropy != null && effectiveEntropy < entropy
  const trackFill = dark ? '#1f2937' : '#e5e7eb'

  return (
    <div className="panel panel-fuchsia p-5">
      <h3 className="text-xs font-mono-cyber font-semibold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider mb-4">
        &gt; Entropy
      </h3>

      <div className="flex items-center gap-6">
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
                background={{ fill: trackFill }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold leading-none" style={{ color }}>
              {Math.round(display)}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">bits</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="font-semibold" style={{ color }}>{entropyLabel}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Effective entropy:{' '}
            <span className="text-gray-800 dark:text-gray-200">{display} bits</span>
          </p>
          {penalised && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Raw: {entropy} bits — reduced by pattern penalties
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
