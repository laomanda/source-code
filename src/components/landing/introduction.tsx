import * as React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, MonitorSmartphone, Code2 } from "lucide-react";

export function Introduction() {
  const pillars = [
    {
      icon: Zap,
      title: "Zero Registration Barrier",
      description:
        "No account creation, no subscriptions, and no paywalls. Find what you need and copy it immediately.",
    },
    {
      icon: MonitorSmartphone,
      title: "Isolated Live Previews",
      description:
        "Every resource can be inspected in interactive viewports to verify layout responsiveness before copying.",
    },
    {
      icon: Code2,
      title: "Modern Tech Standards",
      description:
        "Built with clean HTML, Tailwind CSS, React, and TypeScript. Standard implementations ready to paste into your codebase.",
    },
  ];

  return (
    <Section spacing="default" className="bg-[#E3F6F5]/30 border-y border-[#BAE8E8]/70">
      <Container size="xl">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="font-mono text-xs font-semibold text-[#272343] uppercase tracking-wider bg-[#E3F6F5] px-3 py-1 rounded border border-[#BAE8E8]">
            Why JakDev Exists
          </span>
          <h2 className="text-h2">
            Build faster without reinventing common UI patterns.
          </h2>
          <p className="text-body text-[#2D334A]/80">
            JakDev focuses on providing clean, practical, and reusable source code. We cut out the unnecessary clutter so you can focus entirely on shipping your product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="bg-white border-[#BAE8E8] shadow-soft">
                <CardHeader className="space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-[#FFD803] flex items-center justify-center text-[#272343] shadow-soft-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg text-[#272343]">{pillar.title}</CardTitle>
                  <CardDescription className="text-sm text-[#2D334A]/80 leading-relaxed">
                    {pillar.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
