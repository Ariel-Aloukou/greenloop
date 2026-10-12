"use client";

import { useId } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { X, Flame, Loader2 } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useRegisterModal } from "@/app/lib/register-modal-context";
import { useAuth } from "@/app/lib/auth-context";

const registerSchema = z.object({
  name: z.string().min(2, "Veuillez entrer votre nom"),
  email: z
    .string()
    .min(1, "Veuillez entrer votre email")
    .email("Email invalide"),
  phone: z.string().optional(),
  acceptsTerms: z.literal(true, { message: "Vous devez accepter les conditions" }),
});

type RegisterForm = z.infer<typeof registerSchema>;

const EASE = [0.22, 1, 0.36, 1] as const;

export function RegisterModal() {
  const id = useId();
  const { open, onOpenChange } = useRegisterModal();
  const { register: authRegister } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    await new Promise((r) => setTimeout(r, 1200));
    authRegister({ name: data.name, email: data.email, phone: data.phone || undefined });
    toast.success("Inscription réussie !", {
      description: "Bienvenue sur GreenGas — 25 pts offerts !",
    });
    reset();
    onOpenChange(false);
    router.push("/dashboard");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[9998] bg-[#030a06]/80 backdrop-blur-md"
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={cn(
              "fixed z-[9999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[calc(100%-2rem)] max-w-md",
              "rounded-2xl border border-white/[0.1] bg-[#051009] shadow-[0_40px_100px_rgba(0,0,0,0.6)]",
              "focus:outline-none"
            )}
          >
            {/* Glow décoratif */}
            <div
              className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 65%)",
                filter: "blur(30px)",
              }}
              aria-hidden
            />

            <div className="relative z-10 p-7 md:p-8">
              {/* Close button */}
              <Dialog.Close className="absolute top-4 right-4 w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40">
                <X className="w-4 h-4" />
              </Dialog.Close>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-green-400" strokeWidth={1.8} />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold text-white">
                    Rejoindre GreenGas
                  </Dialog.Title>
                  <Dialog.Description className="text-[13px] text-white/40 mt-0.5">
                    Rejoignez un bac, scannez vos dépôts et gagnez des GreenPoints.
                  </Dialog.Description>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                {/* Nom */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${id}-name`} className="text-[12px] font-medium text-white/50">
                    Nom complet <span className="text-green-400">*</span>
                  </label>
                  <input
                    id={`${id}-name`}
                    {...register("name")}
                    type="text"
                    placeholder="Votre nom"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-sm bg-white/[0.04] border text-white/80 placeholder:text-white/20",
                      "focus:outline-none focus:ring-2 transition-all duration-300",
                      errors.name
                        ? "border-red-500/40 focus:ring-red-500/30"
                        : "border-white/[0.08] hover:border-white/[0.15] focus:ring-green-500/30"
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400/80">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${id}-email`} className="text-[12px] font-medium text-white/50">
                    Email <span className="text-green-400">*</span>
                  </label>
                  <input
                    id={`${id}-email`}
                    {...register("email")}
                    type="email"
                    placeholder="vous@email.com"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-sm bg-white/[0.04] border text-white/80 placeholder:text-white/20",
                      "focus:outline-none focus:ring-2 transition-all duration-300",
                      errors.email
                        ? "border-red-500/40 focus:ring-red-500/30"
                        : "border-white/[0.08] hover:border-white/[0.15] focus:ring-green-500/30"
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400/80">{errors.email.message}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${id}-phone`} className="text-[12px] font-medium text-white/50">
                    Téléphone <span className="text-white/25">(optionnel)</span>
                  </label>
                  <input
                    id={`${id}-phone`}
                    {...register("phone")}
                    type="tel"
                    placeholder="+225 01 02 03 04 05"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-sm bg-white/[0.04] border text-white/80 placeholder:text-white/20",
                      "focus:outline-none focus:ring-2 transition-all duration-300",
                      "border-white/[0.08] hover:border-white/[0.15] focus:ring-green-500/30"
                    )}
                  />
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-1">
                  <input
                    id={`${id}-terms`}
                    {...register("acceptsTerms")}
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded border-white/[0.15] bg-white/[0.04] text-green-600 focus:ring-green-500/30 focus:outline-none accent-green-600"
                  />
                  <label htmlFor={`${id}-terms`} className="text-[12px] text-white/40 leading-relaxed cursor-pointer">
                    J&apos;accepte les{" "}
                    <a href="#" className="text-green-400/70 hover:text-green-400 underline underline-offset-2 transition-colors">
                      conditions d&apos;utilisation
                    </a>{" "}
                    et la{" "}
                    <a href="#" className="text-green-400/70 hover:text-green-400 underline underline-offset-2 transition-colors">
                      politique de confidentialité
                    </a>{" "}
                    de GreenGas.
                  </label>
                </div>
                {errors.acceptsTerms && (
                  <p className="text-xs text-red-400/80 -mt-2">{errors.acceptsTerms.message}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl mt-2",
                    "bg-green-600 hover:bg-green-500 text-white font-semibold text-sm",
                    "shadow-[0_0_24px_rgba(22,163,74,0.3)] hover:shadow-[0_0_36px_rgba(22,163,74,0.5)]",
                    "border border-green-500/25 transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Inscription en cours…
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4" strokeWidth={1.8} />
                      Créer mon compte GreenGas
                    </>
                  )}
                </button>

                <p className="text-[11px] text-white/25 text-center leading-relaxed">
                  Gratuit · Sans engagement · 25 pts offerts à l&apos;inscription
                </p>
              </form>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
