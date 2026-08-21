"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "/admin";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await loginAction(null, formData);
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      toast.success("Berhasil masuk ke Dashboard Admin!");
      router.push(nextParam);
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan otentikasi. Silakan coba lagi."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Return to Public Site Link */}
      <div className="flex items-center justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#2D334A]/70 hover:text-[#272343] transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] rounded px-1 py-0.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke JakDev</span>
        </Link>
      </div>

      <Card className="w-full border-[#BAE8E8] bg-white shadow-soft">
        <CardHeader className="space-y-2 text-center pb-2 pt-6">
          <div className="mx-auto flex items-center justify-center py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="JakDev"
              width={168}
              height={40}
              className="h-10 w-auto"
            />
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-[#272343] flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5 text-[#2D334A]/70" />
                <span>Alamat Email</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@jakdev.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-10 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-[#272343] flex items-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5 text-[#2D334A]/70" />
                <span>Kata Sandi</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-10 text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#2D334A]/60 hover:text-[#272343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] rounded"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="default"
              disabled={isLoading}
              className="w-full font-semibold shadow-soft-sm gap-2"
            >
              {isLoading ? (
                <span>Sedang masuk...</span>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <React.Suspense
        fallback={
          <div className="p-8 text-center text-xs text-[#2D334A]/60">
            Memuat formulir login...
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
