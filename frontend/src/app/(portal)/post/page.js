'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { KmsAPIGET } from '@/dep/kms/kmsHandler';
import { URLParamsBuilder, HandleSortParams } from '@/dep/others/HandleParams';
import TimeText from '@/components/Time/TimeText';
import { Separator } from '@/components/SmComponent';

function PostMainPage() {
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
    <section className="w-full">
      <div className=" flex flex-auto w-full h-screen">
        <div className="flex flex-col w-full">
          <h2 className="text-2xl font-semibold mb-1">Post</h2>
          <Separator className="mb-4" />
          <div className="">
            <div className="rounded-l shadow-3xl">
              <form className="flex py-2 px-2 md:px-20 mb-14">
                <input
                  type="text"
                  placeholder="Search Document here..."
                  className=" w-full text-[14px] outline-none px-4 py-2 shadow-md rounded-tl rounded-bl"
                />
                <button
                  type="submit"
                  className=" text-light text-white shadow-md rounded-tr rounded-br bg-blue-500 hover:bg-blue-600 px-2 md:px-4"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
          <h1 className="text-l font-medium">Recent Article</h1>
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

      </div>
    </section>
  );
}

export default PostMainPage;
