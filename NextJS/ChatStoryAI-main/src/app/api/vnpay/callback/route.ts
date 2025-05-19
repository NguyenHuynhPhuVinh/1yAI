/* eslint-disable @typescript-eslint/no-unused-vars */
import { VNPay } from 'vnpay';

const vnpayInstance = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE!,
  secureSecret: process.env.VNP_HASH_SECRET!,
  vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  testMode: true,
  enableLog: false
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      vnp_Amount: searchParams.get('vnp_Amount') || '',
      vnp_BankCode: searchParams.get('vnp_BankCode') || '',
      vnp_BankTranNo: searchParams.get('vnp_BankTranNo') || '',
      vnp_CardType: searchParams.get('vnp_CardType') || '',
      vnp_OrderInfo: searchParams.get('vnp_OrderInfo') || '',
      vnp_PayDate: searchParams.get('vnp_PayDate') || '',
      vnp_ResponseCode: searchParams.get('vnp_ResponseCode') || '',
      vnp_TmnCode: searchParams.get('vnp_TmnCode') || '',
      vnp_TransactionNo: searchParams.get('vnp_TransactionNo') || '',
      vnp_TransactionStatus: searchParams.get('vnp_TransactionStatus') || '',
      vnp_TxnRef: searchParams.get('vnp_TxnRef') || '',
      vnp_SecureHash: searchParams.get('vnp_SecureHash') || ''
    };

    const verify = vnpayInstance.verifyReturnUrl(params);
    const isSuccess = params.vnp_ResponseCode === '00' && params.vnp_TransactionStatus === '00';
    
    return Response.json({
      isVerified: verify.isVerified,
      isSuccess: isSuccess,
      transactionData: params
    });
  } catch (error) {
    return Response.json({
      isVerified: false,
      isSuccess: false,
      error: 'Dữ liệu không hợp lệ'
    });
  }
}