import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useUserProfile } from "../hooks/useAuth";

export const Home: React.FC = () => {
  const { data: user } = useUserProfile();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Welcome</h1>
          <p className="text-gray-600 mb-6">
            Simple and secure authentication system
          </p>
          <div className="flex flex-col space-y-3">
            <Link to="/signup" className="w-full">
              <Button variant="primary" className="w-full">
                Register
              </Button>
            </Link>
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {user ? (
          <div className="text-center">
            <Card>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Welcome back, {user.email}
                </h2>
                <Link to="/dashboard">
                  <Button variant="primary" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
};
