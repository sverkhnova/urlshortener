import React, { useState } from 'react';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [infoResult, setInfoResult] = useState<any>(null);
  const [analyticsMessage, setAnalyticsMessage] = useState('');
  const [analyticsResult, setAnalyticsResult] = useState<any>(null);

  // Адрес бэкенда
  const BASE_URL = 'http://localhost:3000';

  // Создание короткой ссылки
  const handleShorten = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl, alias }), // alias опционально
      });
      const data = await resp.json();
      if (resp.status === 201) {
        setShortUrl(data.shortUrl); // или data.alias
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Request failed');
    }
  };

  // Получение info
  const handleGetInfo = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/info/${alias}`);
      const data = await resp.json();
      if (resp.ok) {
        setInfoMessage('');
        setInfoResult(data);
      } else {
        setInfoMessage(data.error || 'Not found');
      }
    } catch (err) {
      console.error(err);
      setInfoMessage('Request failed');
    }
  };

  // Удаление
  const handleDelete = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/delete/${alias}`, { method: 'DELETE' });
      const data = await resp.json();
      if (resp.ok) {
        alert('Deleted!');
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Получение статистики
  const handleAnalytics = async () => {
    try {
      const resp = await fetch(`${BASE_URL}/analytics/${alias}`);
      const data = await resp.json();
      if (resp.ok) {
        setAnalyticsMessage('');
        setAnalyticsResult(data);
      } else {
        setAnalyticsMessage(data.error || 'Analytics not found');
      }
    } catch (err) {
      console.error(err);
      setAnalyticsMessage('Request failed');
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h1>URL Shortener Frontend</h1>

      <div>
        <h2>Create Short Link</h2>
        <input
          type="text"
          placeholder="Original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Alias (optional)"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <button onClick={handleShorten}>Shorten</button>
        {shortUrl && <p>Short URL: {shortUrl}</p>}
      </div>

      <hr />

      <div>
        <h2>Get Info</h2>
        <input
          type="text"
          placeholder="Alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <button onClick={handleGetInfo}>Get Info</button>
        {infoMessage && <p>{infoMessage}</p>}
        {infoResult && <pre>{JSON.stringify(infoResult, null, 2)}</pre>}
      </div>

      <hr />

      <div>
        <h2>Delete Link</h2>
        <input
          type="text"
          placeholder="Alias to delete"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <button onClick={handleDelete}>Delete</button>
      </div>

      <hr />

      <div>
        <h2>Analytics</h2>
        <input
          type="text"
          placeholder="Alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <button onClick={handleAnalytics}>Get Analytics</button>
        {analyticsMessage && <p>{analyticsMessage}</p>}
        {analyticsResult && <pre>{JSON.stringify(analyticsResult, null, 2)}</pre>}
      </div>
    </div>
  );
}

export default App;
