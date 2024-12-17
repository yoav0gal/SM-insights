import { AnimatedBackground } from "./animated-background";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <AnimatedBackground />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
              Unlock the Power of Your Comment Section
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
              AudieLens helps content creators form deeper connections with
              their audience by analyzing social media comments and finding the
              most relevant insights.
            </p>
          </div>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-white text-purple-600 rounded-md hover:bg-gray-100 hover:text-purple-700 transition-colors">
              Get Started
            </button>
            <button className="px-4 py-2 bg-purple-600 bg-opacity-50 text-white border border-white rounded-md hover:bg-white hover:text-purple-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
