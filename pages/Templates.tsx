// pages/templates.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Template } from '../interfaces/template';
import '../styles/globals.css';

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/template/all', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_JWT}`
          }
        });
        setTemplates(response.data.data);
      } catch (error) {
        console.error('Error fetching templates', error);
      }
    };

    fetchTemplates();
  }, []);

  const handleEdit = (template: Template) => {
    router.push({
      pathname: '/editor',
      query: { template: JSON.stringify(template) }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template, index) => (
          <div key={template.id} className="bg-white shadow-lg rounded-lg p-6">
            <div className="bg-gray-300 h-48 mb-4 rounded-lg"></div>
            <h3 className="text-xl font-bold mb-2">{index + 1}. 제목: {template.title}</h3>
            <p className="text-gray-700 mb-2">설명: {template.description}</p>
            <div className="flex flex-wrap mt-2">
              {template.templateTags.map((tag, tagIndex) => (
                <span key={tagIndex} className="text-sm text-gray-600 mr-2">한국어 태그: #{tag.korean} / 영어 태그: #{tag.english}</span>
              ))}
            </div>
            <div className="mt-2">
              <span className="text-gray-700">좋아요 수: {template.likes}</span>
            </div>
            <div className="mt-2">
              <span className="text-gray-700">구매 횟수: {template.purchaseCount}</span>
            </div>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => handleEdit(template)}
            >
              에디터로 이동
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;