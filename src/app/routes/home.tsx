export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-accent to-secondary relative overflow-hidden pb-10">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-platinum mb-8 text-center">
          Sorting Algorithm Visualizer
        </h1>
        <p className="text-xl text-platinum/80 text-center mb-12 max-w-2xl mx-auto">
          Choose a sorting algorithm below to start visualizing how it works
        </p>

        {/* Algorithm selection will go here */}
        <div className="text-center">
          <p className="text-platinum/60">Algorithm selection coming soon...</p>
        </div>
      </div>
    </div>
  );
}
