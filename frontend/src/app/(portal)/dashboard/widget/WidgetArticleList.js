'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { KmsAPIGET } from '@/dep/kms/kmsHandler';
import { URLParamsBuilder, HandleSortParams } from '@/dep/others/HandleParams';

function WidgetArticleList() {
  const [articleData, setArticleData] = useState([]);
  const newSortField = 'LastEditedTime';
  const newSortParams = HandleSortParams(newSortField, false);
  useEffect(() => {
    async function fetchData() {
      try {
        const article = await KmsAPIGET(URLParamsBuilder('listarticle', 1, 4, null, newSortParams));
        console.log(article);
        setArticleData(article.body.Data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <Table>
      {articleData === null || articleData.length === 0 ? (
        <TableCaption className="my-14">A list of recent Articles.</TableCaption>
      ) : null}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px] hidden lg:table-cell">Active</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Last Edited</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articleData && articleData.map((article) => (
          <TableRow key={article.ArticleID}>
            <TableCell className="text-right hidden lg:table-cell">
              {article.IsActive ? (
                <Check size={16} color="green" />
              ) : (
                <X size={16} color="red" />
              )}
            </TableCell>
            <TableCell className="font-medium hidden lg:hidden md:flex">{article.Title.length <= 20 ? article.Title : `${article.Title.substring(0, 20)}...`}</TableCell>
            <TableCell className="font-medium md:hidden lg:hidden flex">{article.Title.length <= 12 ? article.Title : `${article.Title.substring(0, 12)}...`}</TableCell>
            <TableCell className="font-medium hidden lg:flex">{article.Title}</TableCell>
            <TableCell>{article.CategoryName}</TableCell>
            <TableCell>{new Date(article.LastEditedTime).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default WidgetArticleList;
