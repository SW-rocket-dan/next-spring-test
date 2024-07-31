import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function GoogleRedirect() {
  const router = useRouter();
  const [authCode, setAuthCode] = useState<string | null>(null);

  useEffect(() => {
    const { code } = router.query;
    if (code) {
      setAuthCode(String(code));
    }
  }, [router.query]);

  return (
    <div className="App">
      <header className="App-header">
        {authCode ? (
          <div>
            <h1>완료되었습니다! auth code: {authCode}</h1>
          </div>
        ) : (
          <div>
            <h1>Loading...</h1>
          </div>
        )}
      </header>
    </div>
  );
}