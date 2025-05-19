/* eslint-disable @typescript-eslint/no-unused-vars */
import { dateFormat, ProductCode, VNPay, VnpLocale } from 'vnpay';

const vnpayInstance = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE!,
  secureSecret: process.env.VNP_HASH_SECRET!,
  vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  testMode: true, // Sử dụng môi trường sandbox
});

export async function POST(request: Request) {
  try {
    const { amount, orderInfo } = await request.json();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Tạo mã giao dịch ngẫu nhiên: yyyyMMddHHmmss + 6 số ngẫu nhiên
    const date = new Date();
    const txnRef = date.getFullYear().toString() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2) +
      Math.floor(Math.random() * 999999).toString().padStart(6, '0');

    const paymentUrl = await vnpayInstance.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: '13.160.92.202',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.NEXT_PUBLIC_URL + '/payment/callback',
      vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
      vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
      vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
    });
    
    return Response.json({ url: paymentUrl });
  } catch (error) {
    console.error('Payment error:', error);
    return Response.json({ error: 'Không thể tạo URL thanh toán' }, { status: 500 });
  }
} 