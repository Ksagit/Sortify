export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-muted to-background pb-10">
      <div className="container mx-auto px-6 py-20">
        <h1 className="mb-8 text-center text-4xl font-bold text-foreground md:text-6xl">
          Sorting Algorithm Visualizer
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-xl text-muted-foreground">
          Choose a sorting algorithm below to start visualizing how it works
        </p>
        <div className="text-center">
          <p className="text-muted-foreground/60">
            Algorithm selection coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
