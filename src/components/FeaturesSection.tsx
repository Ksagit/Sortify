export function FeaturesSection() {
  return (
    <div className="text-left">
      <div className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6 backdrop-blur-sm">
        🎯 Key Features
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
        Learn Through
        <span className="bg-gradient-to-r from-primary via-cerulean to-primary bg-clip-text text-transparent block">
          Interactive Experience
        </span>
      </h2>
      <div className="space-y-6">
        <div className="flex items-start space-x-4 group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-cerulean rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0">
            <span className="text-white text-lg">⚡</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              Step-by-step execution
            </h3>
            <p className="text-white/70">
              Watch algorithms unfold one step at a time with detailed
              explanations
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-4 group">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0">
            <span className="text-white text-lg">🎛️</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              Adjustable speed
            </h3>
            <p className="text-white/70">
              Control animation speed to match your learning pace
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-4 group">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0">
            <span className="text-white text-lg">📊</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              Multiple data sets
            </h3>
            <p className="text-white/70">
              Test with different array sizes and data patterns
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-4 group">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0">
            <span className="text-white text-lg">📈</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              Performance comparison
            </h3>
            <p className="text-white/70">
              Compare algorithms side-by-side with detailed metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
