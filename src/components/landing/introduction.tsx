"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Zap, MonitorSmartphone, Code2 } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function TiltCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);

  // Mouse position normalized (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for buttery smooth motion
  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 22 });

  // 3D Rotations
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Glare position
  const [glarePos, setGlarePos] = React.useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setGlarePos({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div style={{ perspective: 1000 }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative rounded-2xl bg-white border border-[#BAE8E8] p-6 sm:p-8 shadow-soft hover:shadow-soft-lg hover:border-[#272343]/30 transition-shadow duration-300 overflow-hidden cursor-default h-full flex flex-col justify-between"
      >
        {/* Dynamic 3D Glare Sheen following cursor */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-30 rounded-2xl"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(13, 110, 110, 0.3), transparent 80%)`,
          }}
        />

        <div>
          {/* 3D Floating Icon */}
          <div
            style={{ transform: "translateZ(35px)" }}
            className="h-12 w-12 rounded-xl bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center text-[#272343] mb-5 shadow-soft-xs group-hover:bg-[#FFD803] group-hover:scale-105 transition-all duration-300"
          >
            <Icon className="h-6 w-6" />
          </div>

          {/* 3D Floating Title */}
          <h3
            style={{ transform: "translateZ(25px)" }}
            className="text-lg sm:text-xl font-bold text-[#272343] mb-2.5 transition-transform duration-300"
          >
            {title}
          </h3>

          {/* 3D Floating Description */}
          <p
            style={{ transform: "translateZ(15px)" }}
            className="text-sm text-[#2D334A]/80 leading-relaxed transition-transform duration-300"
          >
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function Introduction() {
  const pillars = [
    {
      icon: Zap,
      title: "Tanpa Ribet Registrasi",
      description:
        "Tanpa akun, tanpa langganan, dan tanpa paywall. Salin komponen yang Anda perlukan secara langsung.",
    },
    {
      icon: MonitorSmartphone,
      title: "Pratinjau Interaktif",
      description:
        "Uji tampilan responsif secara langsung di browser sebelum menyalin kode ke dalam proyek Anda.",
    },
    {
      icon: Code2,
      title: "Standar Kode Modern",
      description:
        "Dirancang dengan React, TypeScript, dan Tailwind CSS bersih yang langsung siap digunakan.",
    },
  ];

  return (
    <Section spacing="default" className="relative bg-gradient-to-b from-white via-[#E3F6F5]/40 to-white py-14 sm:py-20">
      <Container size="xl">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-h2 text-[#272343]">
            Bangun website lebih cepat tanpa harus membuat ulang komponen dari nol.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <TiltCard
              key={pillar.title}
              icon={pillar.icon}
              title={pillar.title}
              description={pillar.description}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
