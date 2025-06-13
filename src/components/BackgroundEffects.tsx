export function BackgroundEffects() {
  return (
    <>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute top-60 right-20 w-24 h-24 bg-cerulean/20 rounded-full blur-lg animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-primary/15 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-16 h-16 bg-cerulean/10 rounded-full blur-md animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "2s" }}
        ></div>
      </div>

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/30 to-cerulean/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cerulean/30 to-primary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
      </div>
    </>
  );
}
