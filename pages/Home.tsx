import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [googleAuthData, setGoogleAuthData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const { name, email } = router.query;
    if (name && email) {
      setUser({ name: String(name), email: String(email) });
    }

    // Fetch Google auth data from your backend
    fetch('http://localhost:8080/api/v1/auth/google/login')
      .then(response => response.json())
      .then(data => { console.log(data); setGoogleAuthData(data.data)})
      .catch(error => console.error('Error fetching Google auth data:', error));
  }, [router.query]);

  const handleLogin = () => {
    if (!googleAuthData) return;

    const authUrl = `${googleAuthData.loginBaseUrl}?client_id=${googleAuthData.clientId}&redirect_uri=${googleAuthData.redirectUri}&response_type=${googleAuthData.responseType}&scope=${googleAuthData.scope}`;

    window.open(authUrl, '_blank', 'width=500,height=600');
  };

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <div>
            <h1>Welcome, {user.name}</h1>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <button onClick={handleLogin} disabled={!googleAuthData}>
            Login with Google
          </button>
        )}
      </header>
    </div>
  );
}