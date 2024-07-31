"use client";
import { useState } from 'react';
import axios from 'axios';

interface TagDto {
  korean: string;
  english: string;
}

interface StickerResponseDto {
  id: number;
  fileUrl: string;
  tags: TagDto[];
}

interface SuccessResponseDto<T> {
  status: string;
  data: T;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stickers, setStickers] = useState<StickerResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get<SuccessResponseDto<StickerResponseDto[]>>('https://api.cardcapture.app/api/v1/sticker/search', {
        headers: {
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaXNzIjoiY2FyZGNhcHR1cmUiLCJpZCI6MSwiZXhwIjoxNzIxODczNjI3LCJpYXQiOjE3MjE3ODcyMjd9.Ry_xJSQ4T_HOdhhcZjYNNEkvm-Nv8ZxCITvIWx2svHI'
        },
        params: {
          searchTerm: searchTerm,
        },
      });
      setStickers(response.data.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error searching stickers:', err);
      setError('Failed to fetch stickers. Please try again.');
      setStickers([]);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Sticker Search</h1>
      </header>
      <main>
        <div className="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search term"
          />
          <button onClick={handleSearch}>Search Stickers</button>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="sticker-results">
          {stickers.length > 0 ? (
            <ul>
              {stickers.map((sticker) => (
                <li key={sticker.id}>
                  <img src={sticker.fileUrl} alt={sticker.id.toString()} />
                  <p>ID: {sticker.id}</p>
                  <p>Tags: {sticker.tags.map(tag => `${tag.korean} (${tag.english})`).join(', ')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No stickers found</p>
          )}
        </div>
      </main>
      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        .search-bar {
          display: flex;
          margin-bottom: 20px;
        }
        .search-bar input {
          flex: 1;
          padding: 8px;
          font-size: 16px;
        }
        .search-bar button {
          padding: 8px 16px;
          font-size: 16px;
        }
        .error {
          color: red;
        }
        .sticker-results ul {
          list-style: none;
          padding: 0;
        }
        .sticker-results li {
          display: flex;
          flex-direction: column;
          align-items: start;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 5px;
        }
        .sticker-results img {
          max-width: 100px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}