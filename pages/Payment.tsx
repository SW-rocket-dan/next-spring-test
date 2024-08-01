import { useEffect, useState, useCallback } from 'react';
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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

  const handlePurchase = useCallback((basePaymentData: any) => {
    if (isButtonDisabled) return;

    setIsButtonDisabled(true);

    const paymentData = {
      ...basePaymentData,
      paymentId: generateUUID(),
      redirectUrl: 'https://cardcapture.app/payment',
    };
    requestPayment(paymentData);

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
  }, [isButtonDisabled, portOneLoaded]);


  const tossPaymentSingleCard = {
    storeId: process.env.NEXT_PUBLIC_STORE_ID,
    channelKey: process.env.NEXT_PUBLIC_CHANNEL_KEY,
    orderName: 'AI 포스터 생성 1장 이용권(토스페이먼츠 단건 결제) (실결제) (카드)',
    totalAmount: 500,
    currency: 'CURRENCY_KRW',
    payMethod: 'CARD',
  };

  const tossPaymentSingleCertificateCulture = {
    storeId: process.env.NEXT_PUBLIC_STORE_ID,
    channelKey: process.env.NEXT_PUBLIC_CHANNEL_KEY,
    orderName: 'AI 포스터 생성 1장 이용권(토스페이먼츠 단건 결제) (실결제) (문화상품권)',
    totalAmount: 500,
    currency: 'CURRENCY_KRW',
    payMethod: 'GIFT_CERTIFICATE',
    giftCertificate: {
      giftCertificateType: 'CULTURELAND',
    }
  };

  const tossPaymentSingleCertificateBook = {
    storeId: process.env.NEXT_PUBLIC_STORE_ID,
    channelKey: process.env.NEXT_PUBLIC_CHANNEL_KEY,
    orderName: 'AI 포스터 생성 1장 이용권(토스페이먼츠 단건 결제) (실결제) (도서문화상품권)',
    totalAmount: 500,
    currency: 'CURRENCY_KRW',
    payMethod: 'GIFT_CERTIFICATE',
    giftCertificate: {
      giftCertificateType: 'BOOKNLIFE',
    }
  };

  const tossPaymentSingleCertificateGame = {
    storeId: process.env.NEXT_PUBLIC_STORE_ID,
    channelKey: process.env.NEXT_PUBLIC_CHANNEL_KEY,
    orderName: 'AI 포스터 생성 1장 이용권(토스페이먼츠 단건 결제) (실결제) (게임문화상품권)',
    totalAmount: 500,
    currency: 'CURRENCY_KRW',
    payMethod: 'GIFT_CERTIFICATE',
    giftCertificate: {
      giftCertificateType: 'SMART_MUNSANG',
    }
  };

  const tossPaymentSingleMobile = {
    storeId: process.env.NEXT_PUBLIC_STORE_ID,
    channelKey: process.env.NEXT_PUBLIC_CHANNEL_KEY,
    orderName: 'AI 포스터 생성 1장 이용권(토스페이먼츠 단건 결제) (실결제) (휴대폰 소액결제)',
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
        <div className="payment-container bg-white rounded-lg shadow-lg w-96 p-6 text-center mt-10">
          <div className="payment-header text-2xl font-bold mb-6">AI 포스터 생성 이용권</div>
          <hr className="border-gray-300 mb-4" />
          <div className="original-price text-lg mb-2">
            <span className="line-through">기존 {totalOriginalPrice}원</span> <span className="arrow">→</span>
          </div>
          <div className="payment-price text-5xl font-bold my-2">{totalPrice}원</div>
          <div className="flex justify-center items-center mb-6">
            <button className="quantity-button text-xl bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-2" onClick={handleDecrease}>-</button>
            <span className="mx-4 text-xl"> {count} </span>
            <button className="quantity-button text-xl bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-2" onClick={handleIncrease}>+</button>
          </div>
          <div className="payment-validity mb-6">
            <span className="validity-label">유효기간</span> 구매일로부터 365일
          </div>
          <div className="payment-details text-left mb-6">
            <ul className="list-none p-0">
              <li className="mb-4 relative pl-6 flex items-center">
                <span className="text-purple-600 mr-2">&#10003;</span> AI로 포스터&nbsp;<span className="font-bold">완성본</span>을 생성할 수 있어요.
              </li>
              <li className="mb-4 relative pl-6 flex items-center">
                <span className="text-purple-600 mr-2">&#10003;</span> 생성된 포스터를 직접&nbsp;<span className="font-bold">수정</span>할 수 있어요.
              </li>
            </ul>
          </div>
          <div className="button-container">
            <button
              className={`payment-button bg-purple-600 text-white py-4 w-full rounded-lg text-lg mb-4 shadow-button ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handlePurchase(tossPaymentSingleCard)}
              disabled={isButtonDisabled}
            >
              신용·체크카드로 결제하기
            </button>
            <button
              className={`payment-button bg-purple-600 text-white py-4 w-full rounded-lg text-lg mb-4 shadow-button ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handlePurchase(tossPaymentSingleCertificateCulture)}
              disabled={isButtonDisabled}
            >
              문화상품권(컬쳐랜드)
            </button>
            <button
              className={`payment-button bg-purple-600 text-white py-4 w-full rounded-lg text-lg mb-4 shadow-button ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handlePurchase(tossPaymentSingleCertificateBook)}
              disabled={isButtonDisabled}
            >
              도서문화상품권
            </button>
            <button
              className={`payment-button bg-purple-600 text-white py-4 w-full rounded-lg text-lg mb-4 shadow-button ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handlePurchase(tossPaymentSingleCertificateGame)}
              disabled={isButtonDisabled}
            >
              스마트문상(구. 게임문화상품권)
            </button>
            <button
              className={`payment-button bg-purple-600 text-white py-4 w-full rounded-lg text-lg mb-4 shadow-button ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handlePurchase(tossPaymentSingleMobile)}
              disabled={isButtonDisabled}
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
        .payment-container {
          background-color: #fff;
          border-radius: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 400px;
          padding: 20px;
          text-align: center;
          margin-top: 50px; /* 전체 컨텐츠를 아래로 이동시킴 */
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
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .validity-label {
          display: inline-block;
          padding: 5px 10px;
          border: 2px solid #6c63ff;
          border-radius: 20px;
          color: #6c63ff;
          font-weight: bold;
          margin-right: 10px;
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
          display: flex;
          align-items: center;
        }
        .payment-button {
          background-color: #6c63ff;
          color: #fff;
          border: none;
          padding: 15px;
          width: 100%;
          border-radius: 40px;
          font-size: 18px;
          cursor: pointer;
          margin-bottom: 16px;
        }
        .flex.justify-between .payment-button {
          flex: 1;
        }
        .shadow-button {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
};

export default PaymentPage;