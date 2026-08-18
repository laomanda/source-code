import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { AmbientBackground } from "@/components/landing/ambient-background";
import { ArrowRight, Copy, Terminal } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#BAE8E8]/60 bg-white">
      <AmbientBackground />

      <Container size="xl" className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] shadow-soft-sm">
            <span className="h-2 w-2 rounded-full bg-[#FFD803] animate-pulse" />
            <span className="font-heading font-semibold text-xs text-[#272343]">
              100% Free Developer Source-Code Ecosystem
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-display max-w-3xl mx-auto">
              Free source code for{" "}
              <span className="relative inline-block text-[#272343]">
                modern web interfaces.
                <span className="absolute left-0 bottom-1 w-full h-3 bg-[#FFD803]/40 -z-10 rounded" />
              </span>
            </h1>
            <p className="text-body-large text-[#2D334A] max-w-2xl mx-auto">
              Discover reusable UI components, section blocks, and full templates. Preview them in real time, copy clean source code with one click, and ship faster.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild variant="primary" size="lg" className="shadow-soft">
              <Link href="/library" className="flex items-center gap-2">
                <span>Browse Library</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          {/* Core Journey Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium text-[#2D334A]/80 pt-2">
            <span className="px-2.5 py-1 rounded bg-[#E3F6F5] border border-[#BAE8E8]/70 text-[#272343] font-semibold">01 Browse</span>
            <span className="text-[#BAE8E8] font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-[#E3F6F5] border border-[#BAE8E8]/70 text-[#272343] font-semibold">02 Preview</span>
            <span className="text-[#BAE8E8] font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-[#FFD803] text-[#272343] font-bold border border-[#F2CD00]/50 shadow-soft-sm">03 Copy</span>
            <span className="text-[#BAE8E8] font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-[#E3F6F5] border border-[#BAE8E8]/70 text-[#272343] font-semibold">04 Build</span>
          </div>

          {/* Hero Interactive Showcase Card Mockup */}
          <div className="w-full max-w-3xl pt-6">
            <div className="rounded-xl border border-[#BAE8E8] bg-white shadow-soft-md overflow-hidden text-left">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#E3F6F5]/60 border-b border-[#BAE8E8]">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 font-mono text-xs text-[#2D334A]/70 flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-[#272343]" />
                    AnimatedNavbar.tsx
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" size="sm">React</Badge>
                  <Badge variant="secondary" size="sm">Tailwind CSS</Badge>
                </div>
              </div>

              {/* Code Snippet / Visual Live Preview Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#BAE8E8]">
                {/* Live Preview Side */}
                <div className="p-6 bg-white flex flex-col justify-between space-y-6">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#2D334A]/60">Live UI Preview</span>
                    <h3 className="font-heading font-bold text-lg text-[#272343]">Responsive Floating Navbar</h3>
                    <p className="text-xs text-[#2D334A]/80">
                      Clean navbar with sticky backdrop blur and responsive mobile drawer trigger.
                    </p>
                  </div>

                  {/* Interactive Mock Button */}
                  <div className="p-4 rounded-lg bg-[#E3F6F5]/40 border border-[#BAE8E8] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-[#FFD803] flex items-center justify-center font-bold text-xs text-[#272343]">J</div>
                        <span className="text-xs font-bold text-[#272343]">Brand</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-10 rounded bg-[#BAE8E8]" />
                        <span className="h-2 w-10 rounded bg-[#BAE8E8]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#2D334A]/70">
                    <span>Desktop · Tablet · Mobile</span>
                    <span className="text-[#0D6E6E] font-medium">Ready to use</span>
                  </div>
                </div>

                {/* Code Side */}
                <div className="p-5 bg-[#272343] text-white flex flex-col justify-between font-mono text-xs">
                  <div className="space-y-1.5 text-slate-300">
                    <p className="text-slate-400">{"// Copy and paste into your project"}</p>
                    <p><span className="text-[#FFD803]">export function</span> <span className="text-[#BAE8E8]">Navbar</span>() &#123;</p>
                    <p className="pl-3 text-slate-300">return (</p>
                    <p className="pl-6 text-[#E3F6F5]">&lt;header <span className="text-amber-300">className</span>=<span className="text-emerald-300">&quot;sticky top-0 z-50&quot;</span>&gt;</p>
                    <p className="pl-9 text-slate-400">&lt;!-- Instant responsive layout --&gt;</p>
                    <p className="pl-6 text-[#E3F6F5]">&lt;/header&gt;</p>
                    <p className="pl-3">);</p>
                    <p>&#125;</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">TypeScript · JSX</span>
                    <div className="inline-flex items-center gap-1 text-xs text-[#FFD803] font-sans font-semibold">
                      <Copy className="h-3.5 w-3.5" />
                      <span>One-click Copy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
