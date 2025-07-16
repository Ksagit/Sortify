export const AlgorithmPreview = () => {
  return (
    <div className="relative">
      <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-10 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h3 className="mb-2 text-2xl font-bold text-white">
            Live Algorithm Preview
          </h3>
          <p className="text-white/70">Watch sorting in real-time</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
          <div className="flex h-48 items-end justify-center space-x-3">
            {[80, 160, 100, 180, 120, 200, 110, 140, 90, 170].map(
              (height, index) => (
                <div key={index} className="group relative">
                  <div
                    className="via-cerulean rounded-t-xl bg-gradient-to-t from-primary to-primary shadow-lg transition-all duration-1000 ease-in-out hover:scale-110"
                    style={{
                      height: `${height}px`,
                      width: '20px',
                      animationDelay: `${index * 150}ms`,
                    }}
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform font-mono text-xs text-white/60">
                    {height}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-primary"></div>
              <span className="text-sm text-white/80">Sorting...</span>
            </div>
            <div className="text-sm text-white/60">Step 3/8</div>
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-3">
          <div className="h-3 w-3 rounded-full bg-primary/60"></div>
          <div className="h-3 w-3 rounded-full bg-primary"></div>
          <div className="h-3 w-3 rounded-full bg-primary/60"></div>
        </div>
      </div>
    </div>
  )
}
