interface VNPayParams {
    amount: number;
    orderInfo: string;
  }
  
  export const handleVNPayPayment = async (params: VNPayParams) => {
    try {
      const response = await fetch('/api/vnpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
  
      const { url } = await response.json();
      if (!url) throw new Error('Không thể tạo URL thanh toán');
      
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  };