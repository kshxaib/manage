import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoggingIn, user } = useAuthStore();

    if (user) {
        return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return;
        }
        await login(email, password);
    };

    return (
        <div className="min-h-screen bg-bg-app flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-bg-card border border-border rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-text-secondary">
                            Sign in to access your dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-text-primary mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg 
                                         text-text-primary placeholder:text-text-muted
                                         focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                                         transition-all duration-200"
                                placeholder="you@example.com"
                                required
                                disabled={isLoggingIn}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-text-primary mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg 
                                         text-text-primary placeholder:text-text-muted
                                         focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                                         transition-all duration-200"
                                placeholder="••••••••"
                                required
                                disabled={isLoggingIn}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full bg-primary text-white py-2.5 px-4 rounded-lg
                                     hover:bg-primary-hover transition-colors duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     font-medium shadow-sm"
                        >
                            {isLoggingIn ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-muted">
                            By4K's Manage System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
