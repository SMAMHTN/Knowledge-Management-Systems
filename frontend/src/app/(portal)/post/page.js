'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { KmsAPIGET } from '@/dep/kms/kmsHandler';
import { URLParamsBuilder, HandleSortParams } from '@/dep/others/HandleParams';
import TimeText from '@/components/Time/TimeText';
import { Separator } from '@/components/SmComponent';
import { Button } from '@/components/ui/button';

function PostMainPage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const router = useRouter();
  const newSortField = 'LastEditedTime';
  const newSortParams = HandleSortParams(newSortField, false);
  const fetchData = async (srch = searchParams.get('search')) => {
    try {
      const searchparamsforapi = encodeURIComponent(srch);
      const apiEndpoint = `queryarticle?search=${searchparamsforapi}&show=ArticleID,OwnerName,Title,LastEditedTime,Article`;
      const article = await KmsAPIGET(apiEndpoint);
      const a = JSON.parse(article.body.Data);
      setPosts(a.response.docs);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const searchencoded = encodeURIComponent(search);
    fetchData(searchencoded);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchencoded = encodeURIComponent(searchQuery);
    router.push(
      `/post?search=${searchencoded}`,
      { scroll: false },
    );
    fetchData();
  };

  return (
    <section className="w-full">
      <div className=" flex flex-auto w-full h-screen">
        <div className="flex flex-col w-full">
          <h2 className="text-2xl font-semibold mb-1">Article Post</h2>
          <Separator className="mb-2" />
          <div className=" mb-6 grid grid-cols-5 justify-between">
            <div className="rounded-l col-span-4 shadow-3xl">
              <form onSubmit={handleSearch} className="flex py-2 mr-2 md:px-4">
                <input
                  type="text"
                  placeholder="Search Document here..."
                  className=" w-full text-[14px] outline-none px-4 py-2 shadow-md rounded-tl rounded-bl"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  defaultValue={search}
                />
                <button
                  type="submit"
                  className=" text-light text-white shadow-md rounded-tr rounded-br bg-blue-500 hover:bg-blue-600 px-2 w-14  md:w-auto md:px-4"
                >
                  <p className="hidden lg:flex">Search</p>
                  <Search className=" lg:hidden items-center" />
                </button>
              </form>

            </div>
            <Button
              className="rounded bg-blue-500 text-white my-auto w-14 ml-auto lg:w-36 hover:bg-blue-600 mr-2"
            >
              <Link href="/article/edit/">
                <p className="hidden lg:flex">Add New Article</p>
                <p className=" lg:hidden text-xl">+</p>
              </Link>
            </Button>
          </div>
          <div className="bg-white rounded-md p-4 h-fit w-full">
            {search ? (
              <h1 className="text-l font-medium py-4">
                Search Results for:
                {' '}
                {search}
              </h1>
            ) : (
              <h1 className="text-l font-medium py-4">Recent article post</h1>
            )}
            {' '}
            <ul>
              {Array.isArray(posts) && posts.map((post) => (
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
                    {' '}
                    by
                    {' '}
                    {post.OwnerName}
                  </div>
                  <div className=" mt-1 overflow-hidden">
                    <p className="text-sm w-5/6 h-10 text-gray-700">
                      {post.Article}

                    </p>
                    <p />
                  </div>
                </li>
              ))}
            </ul>

          </div>

        </div>

      </div>
    </section>
  );
}

export default PostMainPage;
