import { CircuitBackground } from "@/components/ui/circuit-background"

export default function Default() {
  return (
    <CircuitBackground className="flex min-h-[400px] w-full items-center justify-center rounded-xl border bg-background">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Circuit Background</h2>
        <p className="mt-2 text-muted-foreground">
          An animated circuit-board pattern behind your content.
        </p>
      </div>
    </CircuitBackground>
  )
}
