"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, QrCode, CreditCard, Copy, Check } from "lucide-react";

export function Support() {
  const [copied, setCopied] = React.useState(false);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("000-000-0000");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section id="support" spacing="default" className="bg-[#E3F6F5]/40 border-t border-[#BAE8E8]">
      <Container size="xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#BAE8E8] text-xs font-semibold text-[#272343]">
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>Optional Project Support</span>
          </div>
          <h2 className="text-h2">Support JakDev</h2>
          <p className="text-body text-[#2D334A]/80">
            JakDev is 100% free and will always stay free. If these resources save you development hours, you can choose to support the continuous growth of the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* QRIS Support Box */}
          <Card className="bg-white border-[#BAE8E8] shadow-soft flex flex-col items-center text-center p-6 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-[#FFD803] flex items-center justify-center text-[#272343] shadow-soft-sm">
              <QrCode className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">QRIS Payment</CardTitle>
              <CardDescription className="text-xs">
                Scan using any digital wallet or Indonesian banking app.
              </CardDescription>
            </div>
            
            {/* QR Placeholder Box */}
            <div className="h-44 w-44 rounded-lg bg-[#E3F6F5]/70 border-2 border-dashed border-[#BAE8E8] flex flex-col items-center justify-center p-4 space-y-2">
              <QrCode className="h-14 w-14 text-[#272343]/40" />
              <span className="font-mono text-[10px] text-[#2D334A]/60 font-semibold tracking-wider">
                [QRIS MOCKUP PLACEHOLDER]
              </span>
            </div>
            <span className="text-caption">Instant digital support</span>
          </Card>

          {/* Bank Transfer Box */}
          <Card className="bg-white border-[#BAE8E8] shadow-soft flex flex-col items-center text-center p-6 space-y-4 justify-between">
            <div className="space-y-4 flex flex-col items-center">
              <div className="h-10 w-10 rounded-lg bg-[#272343] flex items-center justify-center text-white shadow-soft-sm">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">Bank Transfer</CardTitle>
                <CardDescription className="text-xs">
                  Direct transfer to project account.
                </CardDescription>
              </div>

              <div className="w-full p-4 rounded-lg bg-[#E3F6F5]/50 border border-[#BAE8E8] space-y-2 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#2D334A]/70 font-medium">Bank Name:</span>
                  <span className="font-mono font-bold text-[#272343]">BCA / Mandiri (Placeholder)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#2D334A]/70 font-medium">Account Name:</span>
                  <span className="font-semibold text-[#272343]">JakDev Project</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-[#BAE8E8]/60">
                  <span className="text-[#2D334A]/70 font-medium">Account No:</span>
                  <span className="font-mono font-bold text-[#272343]">000-000-0000</span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleCopyAccount}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Account Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Account Number</span>
                </>
              )}
            </Button>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
