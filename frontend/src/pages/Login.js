import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Truck, Shield, Activity } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive'
      });
      return;
    }

    try {
      await login(email, password, role);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${role === 'admin' ? 'Admin' : 'User'}!`
      });
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in AuthContext but we catch here to prevent navigation
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl">
              <Truck className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                OkGadi
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI Transport Engine</p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <Activity className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Predictive Intelligence</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered breakdown prediction with 93% confidence</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <Shield className="h-6 w-6 text-teal-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Safety First</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Risk-aware vehicle allocation for optimal safety</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <Truck className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Fleet Optimization</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Continuous learning from real-world operations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={setRole} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="user">User</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@okgadi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
              >
                Sign In as {role === 'admin' ? 'Admin' : 'User'}
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                Demo: admin@okgadi.com / admin123 OR user@okgadi.com / user123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;