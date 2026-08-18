import * as React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Search, Eye, Copy, Hammer } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Browse",
      description: "Search and filter through reusable components, blocks, and pages for your preferred tech stack.",
      icon: Search,
    },
    {
      number: "02",
      title: "Preview",
      description: "Interact with live isolated previews and switch viewports to verify responsive behavior.",
      icon: Eye,
    },
    {
      number: "03",
      title: "Copy",
      description: "Click once to copy the clean, formatted source code directly to your clipboard.",
      icon: Copy,
    },
    {
      number: "04",
      title: "Build",
      description: "Paste the code into your project, tweak it to your needs, and ship your product faster.",
      icon: Hammer,
    },
  ];

  return (
    <Section id="how-it-works" spacing="default" className="bg-white">
      <Container size="xl">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="font-mono text-xs font-semibold text-[#272343] uppercase tracking-wider bg-[#E3F6F5] px-3 py-1 rounded border border-[#BAE8E8]">
            Simple Workflow
          </span>
          <h2 className="text-h2">How JakDev Works</h2>
          <p className="text-body text-[#2D334A]/80">
            A frictionless workflow designed specifically for fast developer productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-xl border border-[#BAE8E8] bg-white p-6 shadow-soft flex flex-col justify-between space-y-4 hover:border-[#8CD3D3] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-2xl text-[#272343]/30 tracking-tight">
                    {step.number}
                  </span>
                  <div className="h-8 w-8 rounded-md bg-[#E3F6F5] flex items-center justify-center text-[#272343] border border-[#BAE8E8]">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-heading font-bold text-lg text-[#272343]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#2D334A]/80 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="h-1 w-full bg-[#E3F6F5] rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-[#FFD803]" />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
