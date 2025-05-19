/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";
import { Register } from "./register";
import { ForgotPassword } from "./forgot-password";
import { NavButton } from "@/components/nav/navbar";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const id = useId();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowForgotPassword(false);
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleSwitchToForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogin(false);
    setShowForgotPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    };

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        remember: rememberMe.toString(),
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('Đăng nhập thành công!');
      setShowLogin(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: window.location.origin });
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi đăng nhập với Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogTrigger asChild>
          <NavButton variant="outline">Đăng nhập</NavButton>
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col items-center gap-2">
            <DialogHeader>
              <DialogTitle className="sm:text-center">Chào mừng trở lại</DialogTitle>
              <DialogDescription className="sm:text-center">
                Vui lòng nhập thông tin để đăng nhập.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-email`}>Email</Label>
                <Input 
                  id={`${id}-email`} 
                  name="email"
                  placeholder="email@example.com" 
                  type="email" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-password`}>Mật khẩu</Label>
                <Input
                  id={`${id}-password`}
                  name="password"
                  placeholder="Nhập mật khẩu của bạn"
                  type="password"
                  required
                />
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id={`${id}-remember`}
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor={`${id}-remember`} className="font-normal text-muted-foreground">
                  Ghi nhớ đăng nhập
                </Label>
              </div>
              <Button 
                type="button"
                variant="link" 
                className="text-sm p-0" 
                onClick={handleSwitchToForgotPassword}
              >
                Quên mật khẩu?
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
            <span className="text-xs text-muted-foreground">Hoặc</span>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleSignIn} 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            <FcGoogle className="w-5 h-5" />
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập với Google'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Button variant="link" className="p-0" onClick={handleSwitchToRegister}>
              Đăng ký ngay
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Register 
        open={showRegister} 
        onOpenChange={setShowRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <ForgotPassword
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}

export { Login };
