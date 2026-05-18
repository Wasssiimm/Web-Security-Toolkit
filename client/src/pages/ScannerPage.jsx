import ScoreCircle from '../components/shared/ScoreCircle'

export default function ScannerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Web Security Scanner</h1>
      {/* Temporary preview — remove when ScannerForm is built in Step 3 */}
      <div className="flex gap-6">
        <ScoreCircle score={9} grade="A" />
        <ScoreCircle score={6} grade="B" />
        <ScoreCircle score={4} grade="C" />
        <ScoreCircle score={1} grade="F" />
      </div>
    </div>
  )
}
