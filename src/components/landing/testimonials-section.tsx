"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export function TestimonialsSection() {
  return (
    <Section id="testimonials" spacing="default" className="bg-gradient-to-b from-white via-[#E3F6F5]/30 to-white py-14 sm:py-20 overflow-hidden">
      <Container size="xl">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-3">
          <h2 className="text-h2 text-[#272343]">
            Apa Kata Pengembang tentang JakDev?
          </h2>
          <p className="text-body text-[#2D334A]/80 max-w-xl mx-auto">
            Dipercaya oleh ribuan developer, UI/UX designer, dan tim produk untuk mempercepat slicing dan pembuatan antarmuka modern.
          </p>
        </div>
      </Container>

      {/* Full-width carousel with edge fades */}
      <div className="w-full relative">
        <StaggerTestimonials />
      </div>
    </Section>
  );
}
