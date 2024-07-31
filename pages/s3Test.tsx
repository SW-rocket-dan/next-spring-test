import { useState } from 'react';
import axios from 'axios';

interface PresignedUrlResponse {
  presignedUrl: string;
  fileUrl: string;
}

interface SuccessResponse {
  message: string;
}

const S3Page: React.FC = () => {
  const [dirName, setDirName] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [extension, setExtension] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string>('');
  const [response, setResponse] = useState<PresignedUrlResponse | null>(null);
  const [deleteResponse, setDeleteResponse] = useState<SuccessResponse | null>(null);

  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaXNzIjoiY2FyZGNhcHR1cmUiLCJjcmVhdGVkX2F0IjoxNzIyMjQyNzk5LCJpZCI6MSwiZXhwIjoxNzIyMzI5MTk5LCJpYXQiOjE3MjIyNDI3OTl9.wOhLm3yM4Cdd0FvksJwXxpG8pZWTvYt02sJ0FzvQXoM';

  const generatePresignedUrl = async () => {
    try {
      const res = await axios.post<{ data: PresignedUrlResponse }>('https://api.cardcapture.app/api/v1/s3/generate-presigned-url', null, {
        params: {
          dirName,
          fileName,
          extension,
        },
        headers: {
          Authorization: `${token}`
        }
      });
      setResponse(res.data.data);
    } catch (error) {
      console.error('프리사인 URL 생성 오류', error);
    }
  };

  const deleteFile = async () => {
    try {
      const res = await axios.delete<SuccessResponse>('https://api.cardcapture.app/api/v1/s3/delete', {
        params: {
          fileUrl,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDeleteResponse(res.data);
    } catch (error) {
      console.error('파일 삭제 오류', error);
    }
  };

  return (
    <div>
      <h1>S3 파일 관리</h1>
      
      <h2>프리사인 URL 생성</h2>
      <input
        type="text"
        placeholder="디렉토리명"
        value={dirName}
        onChange={(e) => setDirName(e.target.value)}
      />
      <input
        type="text"
        placeholder="파일명"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <input
        type="text"
        placeholder="확장자"
        value={extension}
        onChange={(e) => setExtension(e.target.value)}
      />
      <button onClick={generatePresignedUrl}>URL 생성</button>
      {response && (
        <div>
          <h3>생성된 프리사인 URL</h3>
          <a href={response.presignedUrl} target="_blank" rel="noopener noreferrer">
            {response.presignedUrl}
          </a>
          <h3>파일 URL</h3>
          <p>{response.fileUrl}</p>
        </div>
      )}

      <h2>파일 삭제</h2>
      <input
        type="text"
        placeholder="파일 URL"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
      />
      <button onClick={deleteFile}>파일 삭제</button>
      {deleteResponse && (
        <div>
          <h3>삭제 응답</h3>
          <pre>{JSON.stringify(deleteResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default S3Page;
