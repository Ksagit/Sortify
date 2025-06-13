export const AlgorithmPreview = () => {
  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">
            Live Algorithm Preview
          </h3>
          <p className="text-white/70">Watch sorting in real-time</p>
        </div>
        <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-end justify-center space-x-3 h-48">
            {[80, 160, 100, 180, 120, 200, 110, 140, 90, 170].map(
              (height, index) => (
                <div key={index} className="relative group">
                  <div
                    className="bg-gradient-to-t from-primary via-cerulean to-primary rounded-t-xl transition-all duration-1000 ease-in-out hover:scale-110 shadow-lg"
                    style={{
                      height: `${height}px`,
                      width: "20px",
                      animationDelay: `${index * 150}ms`,
                    }}
                  />
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/60 font-mono">
                    {height}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="flex justify-center mt-8 space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">Sorting...</span>
            </div>
            <div className="text-white/60 text-sm">Step 3/8</div>
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-3">
          <div className="w-3 h-3 bg-primary/60 rounded-full"></div>
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <div className="w-3 h-3 bg-primary/60 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
