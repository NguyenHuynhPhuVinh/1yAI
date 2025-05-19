'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, Loader2, Coffee } from "lucide-react";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { AuthClient } from '@/services/auth.client';
import { useLoading } from '@/providers/loading-provider';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { update } = useSession();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'failed'>('loading');
  const [message, setMessage] = useState('Đang xử lý thanh toán...');
  const hasProcessed = useRef(false);
  const { startLoading } = useLoading()
  useEffect(() => {
    const verifyPayment = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      try {
        const response = await fetch(`/api/vnpay/callback?${searchParams.toString()}`);
        const data = await response.json();
        
        if (!data.isVerified) {
          setStatus('error');
          setMessage('Xác thực tính toàn vẹn dữ liệu không thành công');
          toast.error('Xác thực thanh toán thất bại');
          return;
        }

        if (!data.isSuccess) {
          setStatus('failed');
          setMessage('Đơn hàng thanh toán không thành công');
          toast.error('Thanh toán không thành công');
          return;
        }

        // Cập nhật huy hiệu sử dụng AuthClient
        await AuthClient.updateBadge();
        
        // Cập nhật session với thông tin huy hiệu mới
        await update({ hasBadge: true });

        setStatus('success');
        setMessage('Cảm ơn bạn đã ủng hộ dự án!');
        toast.success('Thanh toán thành công!');
        
      } catch (error) {
        console.error('Lỗi xác thực thanh toán:', error);
        setStatus('error');
        setMessage('Dữ liệu không hợp lệ');
        toast.error('Có lỗi xảy ra khi xác thực thanh toán');
      }
    };

    verifyPayment();
  }, [searchParams, update]);

  const statusConfig = {
    loading: {
      icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
      title: 'Đang xử lý',
      color: 'text-primary'
    },
    success: {
      icon: <Coffee className="h-12 w-12 text-green-500" />,
      title: 'Cảm ơn bạn!',
      color: 'text-green-500'
    },
    error: {
      icon: <XCircle className="h-12 w-12 text-red-500" />,
      title: 'Lỗi',
      color: 'text-red-500'
    },
    failed: {
      icon: <XCircle className="h-12 w-12 text-orange-500" />,
      title: 'Thất bại',
      color: 'text-orange-500'
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            {statusConfig[status].icon}
          </div>
          <CardTitle className={`text-2xl font-bold ${statusConfig[status].color}`}>
            {statusConfig[status].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>
          {status === 'success' && (
            <div className="space-y-2 py-2">
              <p className="text-sm text-muted-foreground">Gói Hỗ Trợ - 22.000đ</p>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>✓ Nhận khung avatar ủng hộ</p>
                <p>✓ Truy cập sớm tính năng mới</p>
                <p>✓ Chế độ tạo truyện bằng trò chuyện AI</p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button 
              className="w-full" 
              onClick={() => {
                startLoading('/')
                router.push('/')
              }}
              variant={status === 'success' ? 'default' : 'secondary'}
            >
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Đang tải
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Đang xử lý thanh toán...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
} 