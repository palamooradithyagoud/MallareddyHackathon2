import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send } from "lucide-react";

import { useToast } from "../context/ToastContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export const ForgotPassword: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (_data: ForgotForm) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("Reset instructions sent if email exists.", "success");
      setIsSuccess(true);
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
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
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 display-font">Reset password</h1>
              <p className="text-sm font-semibold text-slate-400">
                Enter your email address and we'll send you recovery details
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                leftIcon={<Mail className="w-4 h-4" />}
                {...register("email")}
              />

              <Button type="submit" className="w-full mt-2" isLoading={loading} leftIcon={<Send className="w-4.5 h-4.5" />}>
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50 display-font">Check your inbox</h1>
            <p className="text-sm text-slate-400 font-medium max-w-sm mt-2">
              We have dispatched password recovery instructions. In this demo flow, you can jump straight to configuring your new password below.
            </p>
            <Button
              type="button"
              className="w-full mt-6"
              onClick={() => navigate("/reset-password")}
            >
              Configure New Password
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
