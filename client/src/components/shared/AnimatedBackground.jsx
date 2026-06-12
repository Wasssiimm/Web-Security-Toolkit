/*
  Network topology background — CSS-only, no JS animation.
  Nodes represent hosts; animated packets travel the edges.
  Purely decorative: aria-hidden, pointer-events-none.
*/

const NODES = {
  A: [140,  200],
  B: [420,   90],
  C: [760,  210],
  D: [1150,  100],
  E: [1360,  380],
  F: [960,   720],
  G: [260,   710],
  H: [580,   460],
}

/* Each edge gets its own packet with an offset delay for organic feel */
const EDGES = [
  { from: 'A', to: 'B', dur: '4.2s', delay: '1.2s'  },
  { from: 'B', to: 'C', dur: '5.1s', delay: '2.6s'  },
  { from: 'C', to: 'D', dur: '4.6s', delay: '0.8s'  },
  { from: 'D', to: 'E', dur: '3.8s', delay: '3.1s'  },
  { from: 'A', to: 'G', dur: '6.0s', delay: '0.0s'  },
  { from: 'C', to: 'H', dur: '4.0s', delay: '1.5s'  },
  { from: 'H', to: 'G', dur: '5.3s', delay: '0.4s'  },
  { from: 'H', to: 'F', dur: '4.4s', delay: '2.2s'  },
  { from: 'F', to: 'E', dur: '5.7s', delay: '1.7s'  },
]

/* Fixed delays so renders are deterministic */
const PING_DELAY = {
  A: '0.0s', B: '1.3s', C: '2.7s', D: '0.5s',
  E: '3.2s', F: '1.8s', G: '0.9s', H: '2.1s',
}

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">

      {/* Base colour */}
      <div className="absolute inset-0 bg-[#ececed] dark:bg-[#090909]" />

      {/* Dot grid */}
      <div className="absolute inset-0 bg-dot-grid bg-dot-fade" />

      {/* Scanlines — very faint CRT texture */}
      <div className="scanlines absolute inset-0" />

      {/* Network topology */}
      <svg
        className="net-bg absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        {/* Dim background edges */}
        {EDGES.map(({ from, to }, i) => {
          const [x1, y1] = NODES[from]
          const [x2, y2] = NODES[to]
          return (
            <path
              key={`e${i}`}
              d={`M${x1},${y1} L${x2},${y2}`}
              className="net-edge"
            />
          )
        })}

        {/* Animated packets — pathLength="1" normalises dashoffset math */}
        {EDGES.map(({ from, to, dur, delay }, i) => {
          const [x1, y1] = NODES[from]
          const [x2, y2] = NODES[to]
          return (
            <path
              key={`p${i}`}
              d={`M${x1},${y1} L${x2},${y2}`}
              pathLength="1"
              className="net-packet"
              style={{ animationDuration: dur, animationDelay: delay }}
            />
          )
        })}

        {/* Host nodes */}
        {Object.entries(NODES).map(([key, [cx, cy]]) => (
          <g key={key}>
            <circle cx={cx} cy={cy} r="2.5" className="net-node" />
            <circle
              cx={cx} cy={cy} r="2.5"
              className="net-ping"
              style={{ animationDelay: PING_DELAY[key] }}
            />
          </g>
        ))}
      </svg>

      {/* Vignette — softens the network behind text, stronger in light mode */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#ececed]/40 via-transparent to-[#ececed]/70 dark:from-transparent dark:to-[#090909]/60" />
    </div>
  )
}
