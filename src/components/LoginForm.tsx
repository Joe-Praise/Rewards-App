'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { LogIn, Mail, Lock, Chrome, Check, Eye, EyeOff } from "lucide-react";
import { useUser } from "@/app/_hooks";
import { useMemo, useState } from "react";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        email,
        password,
        isLoginLoading,
        isGoogleLoading,
        handleLogin,
        handleGoogleLogin,
        handleSignup,
        setEmail,
        setPassword,
        error,
        isSignUpMode,
        setIsSignUpMode,
        clearError,
    } = useUser();

    const toggleMode = () => {
        setIsSignUpMode(!isSignUpMode);
        clearError();
    };

    // Password validation
    const passwordValidation = useMemo(() => {
        return {
            minLength: password.length >= 6,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasDigit: /\d/.test(password),
            hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
    }, [password]);

    return (
        <section aria-label={isSignUpMode ? "Sign Up Form" : "Login Form"}>
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    {isSignUpMode ? "Create Account" : "Welcome Back"}
                </h1>
                <div className="space-y-4">
                    <Button
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading || isLoginLoading}
                    >
                        <Chrome className="mr-2 h-4 w-4" />
                        {isGoogleLoading ? "Signing in..." : "Login with Google"}
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <form
                        onSubmit={
                            isSignUpMode
                                ? (e) => {
                                    e.preventDefault();
                                    handleSignup();
                                }
                                : handleLogin
                        }
                        className="space-y-4"
                    >
                        <div className="relative">
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="username email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {isSignUpMode && (
                            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
                                <p className="font-medium mb-2">Password requirements:</p>
                                <ul className="space-y-1">
                                    <li className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-600'}`}>
                                        {passwordValidation.minLength ? (
                                            <Check className="w-3 h-3 text-green-600" />
                                        ) : (
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        )}
                                        Minimum 6 characters
                                    </li>
                                    <li className={`flex items-center gap-2 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-600'}`}>
                                        {passwordValidation.hasLowercase ? (
                                            <Check className="w-3 h-3 text-green-600" />
                                        ) : (
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        )}
                                        At least one lowercase letter
                                    </li>
                                    <li className={`flex items-center gap-2 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-600'}`}>
                                        {passwordValidation.hasUppercase ? (
                                            <Check className="w-3 h-3 text-green-600" />
                                        ) : (
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        )}
                                        At least one uppercase letter
                                    </li>
                                    <li className={`flex items-center gap-2 ${passwordValidation.hasDigit ? 'text-green-600' : 'text-gray-600'}`}>
                                        {passwordValidation.hasDigit ? (
                                            <Check className="w-3 h-3 text-green-600" />
                                        ) : (
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        )}
                                        At least one digit (0-9)
                                    </li>
                                    <li className={`flex items-center gap-2 ${passwordValidation.hasSymbol ? 'text-green-600' : 'text-gray-600'}`}>
                                        {passwordValidation.hasSymbol ? (
                                            <Check className="w-3 h-3 text-green-600" />
                                        ) : (
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        )}
                                        At least one symbol (!@#$%^&*)
                                    </li>
                                </ul>
                            </div>
                        )}
                        {error && (
                            <div className="text-gray-700 text-sm text-center">{error}</div>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoginLoading || isGoogleLoading}
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            {isLoginLoading
                                ? "Signing in..."
                                : isSignUpMode
                                    ? "Sign Up"
                                    : "Login"
                            }
                        </Button>
                    </form>
                    <p className="text-center text-sm">
                        {isSignUpMode ? "Already have an account?" : "New account?"}{" "}
                        <Link href="#" className="underline" onClick={toggleMode}>
                            {isSignUpMode ? "Login" : "Sign up"}
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LoginForm;
