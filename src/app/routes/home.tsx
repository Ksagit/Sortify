export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-accent to-secondary pb-10">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-platinum mb-8 text-center text-4xl font-bold md:text-6xl">
          Sorting Algorithm Visualizer
        </h1>
        <p className="text-platinum/80 mx-auto mb-12 max-w-2xl text-center text-xl">
          Choose a sorting algorithm below to start visualizing how it works
        </p>

        {/* Algorithm selection will go here */}
        <div className="text-center">
          <p className="text-platinum/60">Algorithm selection coming soon...</p>
        </div>
      </div>
    </div>
  )
}
