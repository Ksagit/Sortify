export const FeaturesSection = () => {
  return (
    <div className="text-left">
      <h2 className="mb-8 text-4xl leading-tight font-bold text-foreground md:text-5xl">
        Learn Through
        <span className="block bg-primary bg-clip-text text-transparent">
          Interactive Experience
        </span>
      </h2>
      <div className="space-y-6">
        <div className="group flex items-start space-x-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-1 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/20">
            <span className="text-lg text-primary-foreground">⚡</span>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              Step-by-step execution
            </h3>
            <p className="text-muted-foreground">
              Watch algorithms unfold one step at a time with detailed
              explanations
            </p>
          </div>
        </div>
        <div className="group flex items-start space-x-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-chart-2 to-chart-3 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-chart-2/20">
            <span className="text-lg text-white">🎛️</span>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              Adjustable speed
            </h3>
            <p className="text-muted-foreground">
              Control animation speed to match your learning pace
            </p>
          </div>
        </div>
        <div className="group flex items-start space-x-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-chart-4 to-chart-5 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-chart-4/20">
            <span className="text-lg text-black">📊</span>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              Multiple data sets
            </h3>
            <p className="text-muted-foreground">
              Test with different array sizes and data patterns
            </p>
          </div>
        </div>
        <div className="group flex items-start space-x-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-destructive to-chart-5 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-destructive/20">
            <span className="text-lg text-white">📈</span>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              Performance comparison
            </h3>
            <p className="text-muted-foreground">
              Compare algorithms side-by-side with detailed metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
