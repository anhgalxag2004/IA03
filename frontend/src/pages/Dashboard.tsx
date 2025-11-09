import React from "react";
import { useUserProfile, useLogout } from "../hooks/useAuth";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUserProfile();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Authentication Successful
          </h1>
          <p className="text-sm text-gray-600">You are now logged in.</p>
        </div>

        <Card>
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-700">You have successfully signed in.</p>
            <Button
              onClick={handleLogout}
              variant="secondary"
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
