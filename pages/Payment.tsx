import { useEffect, useState } from 'react';
import '../styles/globals.css';

declare global {
  interface Window {
    PortOne: any;
  }
}

const generateUUID = () => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const PaymentPage = () => {
  const [portOneLoaded, setPortOneLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.portone.io/v2/browser-sdk.js';
    script.async = true;
    script.onload = () => {
      if (window.PortOne) {
        setPortOneLoaded(true);
        console.log('PortOne SDK loaded');
      } else {
        console.error('PortOne SDK failed to load');
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const requestPayment = async (data: any) => {
    if (!portOneLoaded) {
      console.error('PortOne SDK is not loaded yet');
      return;
    }

    try {
      const response = await window.PortOne.requestPayment(data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePurchase = (basePaymentData: any) => {
    const paymentData = {
      ...basePaymentData,
      paymentId: generateUUID(),
      redirectUrl: 'https://cardcapture.app/payment',
    };
    requestPayment(paymentData);
  };

  const tossPaymentSingleCard = {
    storeId: process.env.NEXT_PUBLIC_STORE_ID,
    channelKey: process.env.NEXT_PUBLIC_CHANNEL_KEY,
    orderName: 'AI 포스터 생성 1장 이용권(토스페이먼츠 단건 결제) (실결제)',
    totalAmount: 500,
    currency: 'CURRENCY_KRW',
    payMethod: 'CARD',
  };

  const tossPaymentSingleCertificate = {
    storeId: process.env.NEXT_PUBLIC_STORE_ID,
    channelKey: process.env.NEXT_PUBLIC_CHANNEL_KEY,
    orderName: 'AI 포스터 생성 1장 이용권(토스페이먼츠 단건 결제) (실결제)',
    totalAmount: 500,
    currency: 'CURRENCY_KRW',
    payMethod: 'CARD',
  };

  const tossPaymentSingleMobile = {
    storeId: process.env.NEXT_PUBLIC_STORE_ID,
    channelKey: process.env.NEXT_PUBLIC_CHANNEL_KEY,
    orderName: 'AI 포스터 생성 1장 이용권(토스페이먼츠 단건 결제) (실결제)',
    totalAmount: 500,
    currency: 'CURRENCY_KRW',
    payMethod: 'MOBILE',
  };


  const [count, setCount] = useState(1);
  const originalPrice = 5000;
  const discountedPrice = 500;

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const handleDecrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const totalPrice = count * discountedPrice;
  const totalOriginalPrice = count * originalPrice;

  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div className="payment-container bg-white rounded-lg shadow-lg w-96 p-6 text-center">
          <div className="payment-header text-2xl font-bold mb-6">AI 포스터 생성 이용권</div>
          <div className="original-price text-lg line-through mb-2">
            기존 {totalOriginalPrice}원 <span className="arrow">→</span>
          </div>
          <div className="payment-price text-5xl font-bold my-2">{totalPrice}원</div>
          <div className="flex justify-center items-center mb-6">
            <button className="quantity-button text-xl" onClick={handleDecrease}>-</button>
            <span className="mx-4 text-xl">  {count}  </span>
            <button className="quantity-button text-xl" onClick={handleIncrease}>+</button>
          </div>
          <div className="payment-validity text-purple-600 mb-6">유효기간: 구매일로부터 365일</div>
          <div className="payment-details text-left mb-6">
            <ul className="list-none p-0">
              <li className="mb-4 relative pl-6">
                <span className="absolute left-0 text-purple-600"></span> AI로 포스터 완성본을 생성할 수 있어요.
              </li>
              <li className="mb-4 relative pl-6">
                <span className="absolute left-0 text-purple-600"></span> 포스터 완성본을 직접 수정할 수 있어요.
              </li>
            </ul>
          </div>
          <div className="button-container">
            <button
              className="payment-button bg-purple-600 text-white py-4 w-full rounded-lg text-lg mb-4"
              onClick={() => handlePurchase(tossPaymentSingleCard)}
            >
              신용·체크카드로 결제하기
            </button>
            <button
              className="payment-button bg-purple-600 text-white py-4 w-full rounded-lg text-lg mb-4"
              onClick={() => handlePurchase(tossPaymentSingleCertificate)}
            >
              문화상품권으로 결제하기
            </button>
            <button
              className="payment-button bg-purple-600 text-white py-4 w-full rounded-lg text-lg mb-4"
              onClick={() => handlePurchase(tossPaymentSingleMobile)}
            >
              휴대폰 소액결제
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .button-container {
          margin-top: 20px; /* 버튼들 상단에 여백 추가 */
        }
        .payment-button {
          margin-bottom: 16px; /* 버튼들 사이에 여백 추가 */
        }
        .payment-container {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 400px;
          padding: 20px;
          text-align: center;
        }
        .payment-header {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .original-price {
          font-size: 18px;
          color: #999;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .arrow {
          font-size: 24px;
          margin-left: 10px;
          margin-right: 10px;
          color: #6c63ff;
        }
        .payment-price {
          font-size: 40px;
          font-weight: bold;
          margin: 10px 0;
        }
        .payment-validity {
          color: #6c63ff;
          margin: 10px 0;
        }
        .payment-details {
          text-align: left;
          margin: 20px 0;
        }
        .payment-details ul {
          list-style: none;
          padding: 0;
        }
        .payment-details ul li {
          margin: 10px 0;
          position: relative;
        }
        .payment-details ul li::before {
          content: '✔';
          position: absolute;
          left: -20px;
          color: #6c63ff;
        }
        .payment-button {
          background-color: #6c63ff;
          color: #fff;
          border: none;
          padding: 15px;
          width: 100%;
          border-radius: 8px;
          font-size: 18px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default PaymentPage;