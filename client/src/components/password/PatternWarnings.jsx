const PATTERN_LABELS = {
  'common-password':    'Known common password',
  'keyboard-row':       'Full keyboard row (qwertyuiop)',
  'keyboard-sequence':  'Keyboard sequence (qwerty, asdfgh…)',
  'numeric-sequence':   'Numeric sequence (123456, 654321…)',
  'sequential-letters': 'Sequential letters (abcdef…)',
  'repetition':         'Repeated characters (aaa, 111…)',
  'year':               'Contains a year',
  'date':               'Contains a date pattern',
  'month-name':         'Contains a month name',
  'leet-password':      'Leetspeak variant of a common word',
  'leet-admin':         'Leetspeak variant of "admin"',
  'common-word':        'Contains a common word',
}

export default function PatternWarnings({ patterns, feedback, crackTime }) {
  if (!patterns) return null

  return (
    <div className="panel panel-fuchsia p-5 space-y-4">
      <h3 className="text-xs font-mono-cyber font-semibold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider">
        &gt; Pattern Analysis
      </h3>

      {patterns.length === 0 ? (
        <p className="text-sm text-green-600 dark:text-green-400">✓ No weak patterns detected</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {patterns.map(p => (
            <span
              key={p}
              className="inline-flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 text-xs px-3 py-1 rounded-full"
            >
              <span>⚠</span>
              {PATTERN_LABELS[p] ?? p}
            </span>
          ))}
        </div>
      )}

      {feedback?.warning && (
        <p className="text-sm text-orange-600 dark:text-orange-400">{feedback.warning}</p>
      )}

      {feedback?.suggestions?.length > 0 && (
        <ul className="space-y-1">
          {feedback.suggestions.map((s, i) => (
            <li key={i} className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
              <span className="text-cyan-500 dark:text-cyan-400 shrink-0">→</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}

      {crackTime && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Online attack</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{crackTime.online}</p>
            <p className="text-xs text-gray-400 dark:text-gray-600">~100 guesses / sec</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Offline attack</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{crackTime.offline}</p>
            <p className="text-xs text-gray-400 dark:text-gray-600">~10B guesses / sec (GPU)</p>
          </div>
        </div>
      )}
    </div>
  )
}
