import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="relative z-10 px-6 py-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary via-cerulean to-secondary rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <span className="text-white font-bold text-xl drop-shadow-sm">
              S
            </span>
          </div>
          <div>
            <span className="text-white text-xl font-bold">Sortify</span>
            <div className="text-primary/80 text-xs font-medium">
              Algorithm Visualizer
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          className="shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Get Started
        </Button>
      </nav>
    </header>
  );
}
