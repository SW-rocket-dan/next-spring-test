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
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 

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
      if (response.transactionType === 'PAYMENT' && response.txId) {
        // 결제 완료 후 백엔드 서버에 확인 요청
        pollPaymentStatus(response.paymentId);
      } else {
        setErrorMessage('결제에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('결제 요청 중 오류가 발생했습니다.');
    }
  };

  const pollPaymentStatus = async (paymentId: string) => {
    let attempts = 0;
    const maxAttempts = 3;
    const interval = 300; // 0.3초 간격
  
    const checkStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/payment/single/endCheck`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_JWT}` // 인증 토큰 추가
          },
          body: JSON.stringify({ paymentId }),
        });
  
        const result = await response.json();
  
        if (response.ok && result.data && result.data.status === 'PAID') {
          // 결제 성공 시 화면에 메시지 표시
          setSuccessMessage('구매 완료입니다');
        } else {
          throw new Error('결제 상태 확인 실패');
        }
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, interval);
        } else {
          setErrorMessage('결제 상태 확인에 실패했습니다. 마이페이지에서 이용권을 확인할 수 없으면 고객센터에 문의하세요.');
        }
      }
    };
  
    checkStatus();
  };
  
  const handlePurchase = useCallback(async (basePaymentData: any) => {
    if (isButtonDisabled) return;
  
    setIsButtonDisabled(true);
    setErrorMessage('');
  
    try {
      const checkResponse = await fetch('http://localhost:8080/api/v1/payment/single/startCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_JWT}`
        },
        body: JSON.stringify({
          products: [
            {
              productId: "AIP001",
              quantity: count, // Here `count` is used for quantity, based on user interaction.
              price: basePaymentData.totalAmount
            }
          ],
          totalPrice: count * basePaymentData.totalAmount, // Calculated total price based on the count and totalAmount.
          requestTime: new Date().toISOString() // Current date-time in ISO string format.
        }),
      });
  
      if (checkResponse.status === 200) {
        const responseJson = await checkResponse.json(); // Added to handle response correctly.
        const paymentData = {
          ...basePaymentData,
          paymentId: responseJson.data.paymentId, // Using paymentId from server response.
          redirectUrl: 'https://cardcapture.app/payment',
        };
        requestPayment(paymentData);
      } else if (checkResponse.status === 400) {
        setErrorMessage('프론트 요청한 데이터의 정합성 오류');
      } else if (checkResponse.status === 402) {
        setErrorMessage('결제 가능 금액을 초과했습니다.');
      } else if (checkResponse.status === 409) {
        setErrorMessage('재고가 부족합니다.');
      } else if (checkResponse.status === 429) {
        setErrorMessage('너무 빠르게 중복 요청되었습니다.');
      } else {
        setErrorMessage('결제 요청 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setErrorMessage('결제 요청 중 오류가 발생했습니다.');
    }
  
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);
  }, [isButtonDisabled, portOneLoaded, count]);
  
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
          {successMessage && <div className="success-message text-green-500 mt-4">{successMessage}</div>}
          {errorMessage && <div className="error-message text-red-500 mt-4">{errorMessage}</div>}
          <div className="new-payment-method mt-6 text-gray-600 text-sm">
            고객님의 편리한 구매를 위해,<br />
            곧 카카오페이가 추가될 예정이에요!
          </div>
        </div>
      </div>

      <style jsx>{`
        .error-message {
          color: #f44336;
          font-size: 16px;
          margin-top: 20px;
        }
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
        .new-payment-method {
          color: #666;
          font-size: 14px;
          text-align: center;
          margin-top: 20px;
          animation: bounce 2s infinite;
        }
        .success-message {
          color: #4caf50;
          font-size: 16px;
          margin-top: 20px;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }

      `}</style>
    </>
  );
};

export default PaymentPage;