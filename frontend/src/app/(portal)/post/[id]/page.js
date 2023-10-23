'use client';

import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { KmsAPIGET } from '@/dep/kms/kmsHandler';
import TimeText from '@/components/Time/TimeText';

function postArticle({ params }) {
  const [css, setCss] = useState('');
  const [html, setHtml] = useState('');
  const [data, setData] = useState({
    ArticleID: '',
    OwnerID: '',
    pagesHtml: {
      html: '',
      css: '',
    },
  });
  const [tag, setTag] = useState('');
  const [time, setTime] = useState('');
  const [owner, setOwner] = useState('');
  const fetchData = async () => {
    try {
      const response = await KmsAPIGET(`article?ArticleID=${params.id}`);
      if (response.body !== null) {
        setData(response.body.Data);
        const a = JSON.parse(response.body.Data.Article);
        const formattedTags = response.body.Data.Tag;
        const ownName = response.body.Data.OwnerName;
        setHtml(a.pagesHtml[0].html);
        setCss(a.pagesHtml[0].css);
        setTag(formattedTags.join(', '));
        setOwner(ownName);
        setTime(response.body.Data.LastEditedTime);
      }
    } catch (error) { console.error('Error fetching article data:', error); }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  return (
    <div className="w-full">
      <div className="flex flex-auto w-full mt-2">
        <div className="flex flex-col items-left">
          <div className="flex items-left">
            <Tag color="black" size={18} className="my-auto" />
            <p className="text-black rounded px-2 my-2 ml-2">
              {tag}
            </p>
          </div>
          <h1 className="text-4xl font-semibold mb-1">{data.Title}</h1>
          <div>
            <p className="">
              by
              {' '}
              {owner}
            </p>
            <p>
              <TimeText timestamp={time} />
            </p>
          </div>
          <div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <style>{css}</style>
          </div>
        </div>
      </div>
    </div>
  );
}

export default postArticle;
