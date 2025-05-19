/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId } from "react";
import { toast } from "sonner";
import { AuthClient } from "@/services/auth.client";

interface ForgotPasswordProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

function ForgotPassword({ open, onOpenChange, onSwitchToLogin }: ForgotPasswordProps) {
  const id = useId();
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await AuthClient.forgotPassword(email);
      toast.success(result.message);
      setStep('code');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await AuthClient.verifyResetCode(email, code);
      toast.success(result.message);
      setStep('password');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('new-password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu không khớp');
      setIsLoading(false);
      return;
    }

    try {
      const result = await AuthClient.resetPassword(email, code, newPassword);
      toast.success(result.message);
      onOpenChange(false);
      onSwitchToLogin();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 'email' && 'Quên mật khẩu?'}
            {step === 'code' && 'Nhập mã xác thực'}
            {step === 'password' && 'Đặt lại mật khẩu'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 'email' && 'Nhập email của bạn để nhận mã xác thực.'}
            {step === 'code' && 'Vui lòng kiểm tra email và nhập mã xác thực.'}
            {step === 'password' && 'Nhập mật khẩu mới của bạn.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input
                id={`${id}-email`}
                placeholder="email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang gửi...' : 'Gửi mã xác thực'}
            </Button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-code`}>Mã xác thực</Label>
              <Input
                id={`${id}-code`}
                placeholder="Nhập mã 6 số"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang xác thực...' : 'Xác nhận'}
            </Button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-new-password`}>Mật khẩu mới</Label>
              <Input
                id={`${id}-new-password`}
                name="new-password"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-confirm-password`}>Xác nhận mật khẩu</Label>
              <Input
                id={`${id}-confirm-password`}
                name="confirm-password"
                type="password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
            </Button>
          </form>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Đã nhớ mật khẩu?{" "}
          <Button variant="link" className="p-0" onClick={onSwitchToLogin}>
            Đăng nhập
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { ForgotPassword }; 