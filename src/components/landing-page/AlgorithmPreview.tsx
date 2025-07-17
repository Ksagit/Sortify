export const AlgorithmPreview = () => {
  return (
    <div className="relative">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-card/95 to-card/80 p-10 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h3 className="mb-2 text-2xl font-bold text-card-foreground">
            Live Algorithm Preview
          </h3>
          <p className="text-muted-foreground">Watch sorting in real-time</p>
        </div>
        <div className="rounded-2xl border border-border bg-muted/50 p-6 shadow-inner">
          <div className="flex h-48 items-end justify-center space-x-3">
            {[80, 160, 100, 180, 120, 200, 110, 140, 90, 170].map(
              (height, index) => (
                <div key={`bar-${height}`} className="group relative">
                  <div
                    className="rounded-t-xl bg-gradient-to-t from-chart-1 to-chart-4 shadow-lg transition-all duration-1000 ease-in-out hover:scale-110 hover:shadow-primary/30"
                    style={{
                      height: `${height}px`,
                      width: "20px",
                      animationDelay: `${index * 150}ms`,
                    }}
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform font-mono text-xs text-muted-foreground">
                    {height}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-primary shadow-primary/50"></div>
              <span className="text-sm text-muted-foreground">Sorting...</span>
            </div>
            <div className="text-sm text-muted-foreground">Step 3/8</div>
          </div>
        </div>
      </div>
    </div>
  )
}
