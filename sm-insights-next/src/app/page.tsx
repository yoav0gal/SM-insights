import Link from "next/link";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Zap,
  Shield,
  BarChart,
} from "lucide-react";
import { HeroSection } from "./components/hero-section";
import { FeatureCard } from "./components/feature-card";
import { ReasonCard } from "./components/reason-card";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-white dark:bg-gray-800 shadow-sm">
        <Link className="flex items-center justify-center" href="#">
          <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <span className="ml-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
            AudieLens
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:text-purple-600 dark:hover:text-purple-400"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium px-4 py-2 rounded-full border border-purple-600 text-purple-600 hover:bg-purple-100 hover:text-purple-700 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900 dark:hover:text-purple-300"
            href="/login"
          >
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <HeroSection />
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-purple-600 dark:text-purple-400">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <FeatureCard
                icon={MessageCircle}
                title="Comment Analysis"
                description="Get valuable insights from your comment section with our advanced analysis tools."
                color="text-purple-600 dark:text-purple-400"
              />
              <FeatureCard
                icon={Users}
                title="Audience Connection"
                description="Form deeper connections with your audience by understanding their needs and preferences."
                color="text-pink-500 dark:text-pink-400"
              />
              <FeatureCard
                icon={TrendingUp}
                title="Relevance Filtering"
                description="Easily find and prioritize the most relevant comments to streamline your engagement."
                color="text-red-500 dark:text-red-400"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-purple-600 dark:text-purple-400">
              Why Choose AudieLens?
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <ReasonCard
                icon={Zap}
                title="Lightning Fast"
                description="Get insights in seconds, not hours."
                color="purple"
              />
              <ReasonCard
                icon={Shield}
                title="Secure & Private"
                description="Your data is always protected and never shared."
                color="pink"
              />
              <ReasonCard
                icon={BarChart}
                title="Actionable Metrics"
                description="Turn data into decisions with our intuitive dashboard."
                color="red"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-purple-50 dark:bg-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 AudieLens. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
            href="/terms-and-conditions"
          >
            Terms and Conditions
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
            href="/privacy-policy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
