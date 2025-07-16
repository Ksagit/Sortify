export const FeaturesSection = () => {
  return (
    <div className="text-left">
      <div className="mb-6 inline-block rounded-full border border-primary/30 bg-primary/20 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
        🎯 Key Features
      </div>
      <h2 className="mb-8 text-4xl leading-tight font-bold text-white md:text-5xl">
        Learn Through
        <span className="via-cerulean block bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
          Interactive Experience
        </span>
      </h2>
      <div className="space-y-6">
        <div className="group flex items-start space-x-4">
          <div className="to-cerulean flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
            <span className="text-lg text-white">⚡</span>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold text-white">
              Step-by-step execution
            </h3>
            <p className="text-white/70">
              Watch algorithms unfold one step at a time with detailed
              explanations
            </p>
          </div>
        </div>
        <div className="group flex items-start space-x-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
            <span className="text-lg text-white">🎛️</span>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold text-white">
              Adjustable speed
            </h3>
            <p className="text-white/70">
              Control animation speed to match your learning pace
            </p>
          </div>
        </div>
        <div className="group flex items-start space-x-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
            <span className="text-lg text-white">📊</span>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold text-white">
              Multiple data sets
            </h3>
            <p className="text-white/70">
              Test with different array sizes and data patterns
            </p>
          </div>
        </div>
        <div className="group flex items-start space-x-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
            <span className="text-lg text-white">📈</span>
          </div>
          <div>
            <h3 className="mb-1 text-lg font-semibold text-white">
              Performance comparison
            </h3>
            <p className="text-white/70">
              Compare algorithms side-by-side with detailed metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
