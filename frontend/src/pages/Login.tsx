import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      navigate("/", { replace: true });
    } catch (err) {
      // AuthContext handles notifications
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Simulate token generation and authentication
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
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 display-font">Welcome back</h1>
          <p className="text-sm font-semibold text-slate-400">Sign in to manage your career journey</p>
        </div>

        {/* Email & Password login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            leftIcon={<Mail className="w-4 h-4" />}
            {...register("email")}
          />

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-0.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              leftIcon={<Lock className="w-4 h-4" />}
              {...register("password")}
            />
          </div>

          <Button type="submit" className="w-full mt-2" isLoading={isSubmitting} leftIcon={<LogIn className="w-4.5 h-4.5" />}>
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800/80" />
          </div>
          <span className="relative px-3 text-xs font-semibold text-slate-400 bg-white dark:bg-slate-900">
            OR CONTINUE WITH
          </span>
        </div>

        {/* Google OAuth Login */}
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
          Sign in with Google
        </Button>

        <p className="mt-6 text-center text-sm font-semibold text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-600 dark:text-brand-400 hover:underline">
            Sign up for free
          </Link>
        </p>
      </Card>
    </motion.div>
  );
};
