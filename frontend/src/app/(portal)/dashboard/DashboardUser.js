'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { KmsAPIGET } from '@/dep/kms/kmsHandler';
import { URLParamsBuilder, HandleSortParams } from '@/dep/others/HandleParams';
import TimeText from '@/components/Time/TimeText';

function DashboardUser() {
  const [posts, setPosts] = useState([]);
  const newSortField = 'LastEditedTime';
  const newSortParams = HandleSortParams(newSortField, false);
  useEffect(() => {
    async function fetchData() {
      try {
        const article = await KmsAPIGET(URLParamsBuilder('listarticle', 1, 5, null, newSortParams));
        console.log(article);
        setPosts(article.body.Data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold">Recent Article</h1>
      <ul>
        {posts && posts.map((post) => (
          <li key={post.ArticleID} className="text-sm mt-2">
            <div className="w-fit">
              {' '}
              <Link href={`/post/${post.ArticleID}`}>
                <p className="text-blue-500 hover:underline text-xl">
                  {' '}
                  {post.Title}
                </p>
              </Link>

            </div>
            <div>
              <TimeText timestamp={post.LastEditedTime} />
            </div>
            <p className="text-sm">
              by
              {' '}
              {post.OwnerName}
            </p>

          </li>
        ))}
      </ul>

    </div>
  );
}

export default DashboardUser;
