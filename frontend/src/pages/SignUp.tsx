import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { authApi } from "../services/api";
import type { RegisterRequest } from "../types/api";
import { AxiosError } from "axios";
import type { ApiError } from "../types/api";

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const password = watch("password");

  const passwordRequirements: PasswordRequirement[] = useMemo(
    () => [
      {
        label: "At least 8 characters long",
        test: (pwd: string) => pwd?.length >= 8,
      },
      {
        label: "Contains uppercase letter (A-Z)",
        test: (pwd: string) => /[A-Z]/.test(pwd),
      },
      {
        label: "Contains lowercase letter (a-z)",
        test: (pwd: string) => /[a-z]/.test(pwd),
      },
      {
        label: "Contains at least one number (0-9)",
        test: (pwd: string) => /\d/.test(pwd),
      },
      {
        label: "Contains special character (@$!%*?&#)",
        test: (pwd: string) => /[@$!%*?&#]/.test(pwd),
      },
    ],
    []
  );

  const passwordChecks = useMemo(() => {
    return passwordRequirements.map((req) => ({
      ...req,
      passed: password ? req.test(password) : false,
    }));
  }, [password, passwordRequirements]);

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      // Redirect to login page after successful registration
      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    const { email, password } = data;
    registerMutation.mutate({ email, password });
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiError;
      if (Array.isArray(apiError?.message)) {
        return apiError.message.join(", ");
      }
      return apiError?.message || error.message;
    }
    return "An unexpected error occurred";
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Create an account
          </h1>
          <p className="text-sm text-gray-600">Sign up to get started</p>
        </div>

        <Card>
          {registerMutation.isError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm text-red-800 font-medium">
                    Registration failed
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    {getErrorMessage(registerMutation.error)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
                  message:
                    "Password must contain uppercase, lowercase, number, and special character",
                },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />

            <div className="sr-only">
              <p className="font-medium text-gray-700 mb-3">
                Password requirements:
              </p>
              <ul className="space-y-2">
                {passwordChecks.map((req, index) => (
                  <li key={index} className="flex items-start">
                    {password ? (
                      req.passed ? (
                        <svg
                          className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      </svg>
                    )}
                    <span
                      className={
                        password
                          ? req.passed
                            ? "text-green-700"
                            : "text-red-700"
                          : "text-gray-600"
                      }
                    >
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
