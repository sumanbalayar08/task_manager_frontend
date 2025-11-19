"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { ChevronLeft, CircleX, Eye, EyeClosed } from "lucide-react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Link } from 'react-router-dom';
import { loginSchema } from "../../validation_schemas/auth.schema";
import type { LoginFormValues } from "../../validation_schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useLoginMutation } from "../../api/auth/auth.mutation";
import { useNavigate } from "react-router-dom";

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
    });

  const { mutateAsync: login, isPending } = useLoginMutation();

  const onSubmit = async (data: LoginFormValues) => {
    setFormError(null);
    try {
      await login(data);
      toast.success("Login successful");
      navigate('/');
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to dashboard</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
            </div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Alert */}
          {formError && (
            <div className="mb-6">
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                <CircleX className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{formError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <CircleX className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 px-4 pr-12 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeClosed className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <CircleX className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                disabled={isSubmitting || isPending}
              >
                {isSubmitting || isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}