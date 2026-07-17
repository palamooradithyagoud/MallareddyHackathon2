import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";

import { useToast } from "../context/ToastContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetForm = z.infer<typeof resetSchema>;

export const ResetPassword: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (_data: ResetForm) => {
    setLoading(true);
    try {
      // Simulate API change delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      showToast("Password updated successfully!", "success");
      setIsSuccess(true);
    } catch (err) {
      showToast("Could not reset password. Access token might be invalid.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass-panel w-full" animate={false}>
        {!isSuccess ? (
          <>
            <div className="flex flex-col gap-1 mb-6 text-center">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 display-font">Set new password</h1>
              <p className="text-sm font-semibold text-slate-400">
                Type in your new secure authentication credentials below
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                leftIcon={<Lock className="w-4 h-4" />}
                {...register("password")}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                leftIcon={<Lock className="w-4 h-4" />}
                {...register("confirmPassword")}
              />

              <Button type="submit" className="w-full mt-2" isLoading={loading}>
                Save Password
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50 display-font">Update successful</h1>
            <p className="text-sm text-slate-400 font-medium max-w-sm mt-2">
              Your password has been changed. You can now log back in with your new credentials.
            </p>
            <Button
              type="button"
              className="w-full mt-6"
              onClick={() => navigate("/login")}
            >
              Sign In Now
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};
