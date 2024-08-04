// pages/editor.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Template } from '../interfaces/template';

const Editor = () => {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (router.query.template) {
      setTemplate(JSON.parse(router.query.template as string));
    }
  }, [router.query.template]);

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">에디터 페이지</h1>
      <h2 className="text-xl mb-2">제목: {template.title}</h2>
      <p className="text-gray-700 mb-4">설명: {template.description}</p>
      <div className="bg-gray-300 h-48 mb-4 rounded-lg"></div>
      {/* 템플릿 편집 UI를 여기에 추가 */}
    </div>
  );
};

export default Editor;