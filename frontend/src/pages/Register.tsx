import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, UserPlus } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: authRegister, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authRegister(data.email, data.password);
      navigate("/", { replace: true });
    } catch (err) {
      // Notified in context
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const mockGoogleToken = `mock_google_${Math.random().toString(36).substring(2, 9)}`;
      await googleLogin(mockGoogleToken);
      navigate("/", { replace: true });
    } catch (err) {
      // Handled in context
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass-panel w-full" animate={false}>
        <div className="flex flex-col gap-1 mb-6 text-center">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 display-font">Create your account</h1>
          <p className="text-sm font-semibold text-slate-400">Join HireMate to step up your career tracking</p>
        </div>

        {/* Email registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            leftIcon={<Mail className="w-4 h-4" />}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            leftIcon={<Lock className="w-4 h-4" />}
            {...register("password")}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            leftIcon={<Lock className="w-4 h-4" />}
            {...register("confirmPassword")}
          />

          <Button type="submit" className="w-full mt-2" isLoading={isSubmitting} leftIcon={<UserPlus className="w-4.5 h-4.5" />}>
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800/80" />
          </div>
          <span className="relative px-3 text-xs font-semibold text-slate-400 bg-white dark:bg-slate-900">
            OR SIGN UP WITH
          </span>
        </div>

        {/* Google sign up option */}
        <Button
          type="button"
          variant="outline"
          className="w-full hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={handleGoogleSignIn}
          isLoading={isGoogleLoading}
          leftIcon={
            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
          }
        >
          Sign up with Google
        </Button>

        <p className="mt-6 text-center text-sm font-semibold text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline">
            Sign in instead
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};
