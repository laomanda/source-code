"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function Support() {
  const [copiedBank, setCopiedBank] = React.useState(false);
  const [copiedWallet, setCopiedWallet] = React.useState(false);

  const handleCopyBank = () => {
    navigator.clipboard.writeText("1660007488711");
    setCopiedBank(true);
    toast.success("Nomor rekening Bank Mandiri berhasil disalin!");
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleCopyWallet = () => {
    navigator.clipboard.writeText("1660007488711");
    setCopiedWallet(true);
    toast.success("Nomor akun GoPay / DANA berhasil disalin!");
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  return (
    <Section id="support" spacing="default" className="bg-gradient-to-b from-white via-[#E3F6F5]/30 to-white">
      <Container size="xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <h2 className="text-h2">Dukung JakDev</h2>
          <p className="text-body text-[#2D334A]/80">
            JakDev 100% gratis dan akan selalu gratis. Jika sumber daya ini membantu mempercepat proses pengembangan Anda, Anda dapat memilih untuk mendukung keberlanjutan dan pertumbuhan platform ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Bank Mandiri Transfer Box */}
          <Card className="bg-white border-[#BAE8E8] shadow-soft flex flex-col items-center text-center p-6 space-y-5 justify-between">
            <div className="space-y-4 flex flex-col items-center w-full">
              <div className="h-11 w-11 rounded-xl bg-[#FFD803] flex items-center justify-center text-[#272343] shadow-soft-sm font-bold">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">Bank Mandiri</CardTitle>
                <CardDescription className="text-xs">
                  Transfer langsung via ATM, Livin&apos; by Mandiri, atau Mobile Banking.
                </CardDescription>
              </div>

              <div className="w-full p-4 rounded-xl bg-[#E3F6F5]/50 border border-[#BAE8E8] space-y-2.5 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#2D334A]/70 font-medium">Bank:</span>
                  <span className="font-bold text-[#272343]">Bank Mandiri</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#2D334A]/70 font-medium">Atas Nama:</span>
                  <span className="font-semibold text-[#272343]">JAKKOB OKTAPIANUS MI</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1.5 border-t border-[#BAE8E8]/60">
                  <span className="text-[#2D334A]/70 font-medium">No. Rekening:</span>
                  <span className="font-mono font-bold text-[#272343] text-sm tracking-wide">1660007488711</span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleCopyBank}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 font-semibold transition-colors"
            >
              {copiedBank ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Nomor Rekening Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin No. Rekening</span>
                </>
              )}
            </Button>
          </Card>

          {/* Gopay / DANA Box */}
          <Card className="bg-white border-[#BAE8E8] shadow-soft flex flex-col items-center text-center p-6 space-y-5 justify-between">
            <div className="space-y-4 flex flex-col items-center w-full">
              <div className="h-11 w-11 rounded-xl bg-[#272343] flex items-center justify-center text-white shadow-soft-sm font-bold">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">GoPay / DANA</CardTitle>
                <CardDescription className="text-xs">
                  Transfer mudah dan instan via dompet digital GoPay atau DANA.
                </CardDescription>
              </div>

              <div className="w-full p-4 rounded-xl bg-[#E3F6F5]/50 border border-[#BAE8E8] space-y-2.5 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#2D334A]/70 font-medium">E-Wallet:</span>
                  <span className="font-bold text-[#272343]">GoPay & DANA</span>
                </div>
                <div className="flex justify-between items-start text-xs">
                  <span className="text-[#2D334A]/70 font-medium shrink-0">Atas Nama:</span>
                  <span className="font-semibold text-[#272343] text-right pl-2 leading-tight">
                    JAKKOB OKTAPIANUS MICHAEL PANJAITAN
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1.5 border-t border-[#BAE8E8]/60">
                  <span className="text-[#2D334A]/70 font-medium">Nomor Akun:</span>
                  <span className="font-mono font-bold text-[#272343] text-sm tracking-wide">1660007488711</span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleCopyWallet}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 font-semibold transition-colors"
            >
              {copiedWallet ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Nomor Akun Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Nomor Akun</span>
                </>
              )}
            </Button>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
