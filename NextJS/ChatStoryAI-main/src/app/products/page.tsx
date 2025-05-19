'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react";
import { handleVNPayPayment } from "@/lib/vnpay";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function ProductsPage() {
  const { data: session, update } = useSession();

  const products = [
    {
      name: "Gói Miễn Phí",
      price: "0đ",
      features: [
        "Truy cập tất cả tính năng cơ bản",
        "Không giới hạn thời gian sử dụng",
        "Cập nhật tính năng mới thường xuyên",
        "Hỗ trợ qua cộng đồng",
        "Không cần thanh toán"
      ],
      isPopular: false,
      showLabel: true,
      label: "Bắt đầu ngay 🚀"
    },
    {
      name: "Gói Hỗ trợ",
      price: "22.000đ",
      features: [
        "Tất cả tính năng của gói miễn phí",
        "Truy cập sớm tính năng mới",
        "Chế độ tạo truyện bằng trò chuyện AI",
        "Hỗ trợ phát triển dự án",
        "Góp phần duy trì máy chủ",
        "Nhận khung avatar ủng hộ",
      ],
      isPopular: true,
      showLabel: true,
      label: "Ủng hộ dự án ❤️"
    },
    {
      name: "Gói Ủng Hộ Miễn Phí",
      price: "0đ",
      features: [
        "Truy cập sớm tính năng mới",
        "Chế độ tạo truyện bằng trò chuyện AI", 
        "Nhận khung avatar ủng hộ",
        "Hỗ trợ phát triển dự án",
        "Không cần thanh toán"
      ],
      isPopular: false,
      showLabel: true,
      label: "Ủng hộ miễn phí 🎁"
    }
  ]

  const handlePayment = async (product: any) => {
    if (product.price === "0đ") {
      if (product.name === "Gói Ủng Hộ Miễn Phí") {
        await handleFreeSupporterUpgrade();
      }
      return;
    }

    if (!session) {
      toast.error("Vui lòng đăng nhập để ủng hộ dự án");
      return;
    }

    try {
      const amount = 22000;
      const orderInfo = `Thanh toán ${product.name}`;
      
      await handleVNPayPayment({
        amount,
        orderInfo
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleFreeSupporterUpgrade = async () => {
    if (!session) {
      toast.error("Vui lòng đăng nhập để trở thành người ủng hộ");
      return;
    }

    try {
      // Gọi API cập nhật badge
      await fetch('/api/user/update-badge', {
        method: 'POST'
      });
      
      // Cập nhật session
      await update({ hasBadge: true });
      
      toast.success('Bạn đã trở thành người ủng hộ!');
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Có lỗi xảy ra khi xử lý yêu cầu");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Sản Phẩm</h1>
            <p className="text-lg text-muted-foreground">
              Bạn có thể sử dụng miễn phí hoặc ủng hộ chúng tôi một tách cafe
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card 
                key={index} 
                className={`flex flex-col relative mt-6 ${product.isPopular ? 'border-primary shadow-lg' : ''}`}
              >
                {product.showLabel && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary/90 dark:bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm">
                      {product.label}
                    </span>
                  </div>
                )}
                <CardHeader className="space-y-2 text-center pt-8">
                  <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-primary">{product.price}</span>
                    {product.price !== "0đ" && (
                      <span className="text-sm text-muted-foreground">/một lần</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full text-lg py-6" 
                    onClick={() => handlePayment(product)}
                    variant={product.isPopular ? "default" : "outline"}
                  >
                    {product.price === "0đ" ? "Bắt đầu ngay" : "Ủng hộ ngay"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 