/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useId, useState } from "react";
import { AuthClient } from '@/services/auth.client';
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

interface RegisterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

function Register({ open, onOpenChange, onSwitchToLogin }: RegisterProps) {
  const id = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    } as const;

    try {
      await AuthClient.register(data);
      toast.success('Đăng ký thành công!');
      onOpenChange(false);
      // Switch to login form after successful registration
      setTimeout(() => {
        onSwitchToLogin();
      }, 100);
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
      toast.error('Đã có lỗi xảy ra khi đăng ký với Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sm:text-center">Đăng ký tài khoản</DialogTitle>
          <DialogDescription className="sm:text-center">
            Vui lòng điền thông tin để tạo tài khoản mới.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-name`}>Họ và tên</Label>
              <Input
                id={`${id}-name`}
                name="name"
                placeholder="Nguyễn Văn A"
                type="text"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input id={`${id}-email`} name="email" placeholder="email@example.com" type="email" required />
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
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
          {isLoading ? 'Đang xử lý...' : 'Đăng ký với Google'}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Button variant="link" className="p-0" onClick={onSwitchToLogin}>
            Đăng nhập
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Bằng cách đăng ký, bạn đồng ý với{" "}
          <a className="underline hover:no-underline" href="#">
            Điều khoản sử dụng
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}

export { Register };
