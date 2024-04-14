// TODO: see which components or which parts could be left as server side components
"use client";

import React from 'react';
import { FeedArticleResult } from '../lib/models/feed-article';

export default function ArticleCard({ article } : { article: FeedArticleResult }) {

  const openArticle = () => {
    window.open(article.url, '_blank');
  }

  return (
    <div 
    className="bg-white shadow-md rounded-lg p-4 break-inside-avoid-column"
    onClick={openArticle}
    >
      {
      article.image ? 
        <img 
        src={article.image} 
        alt={article.title} 
        className="w-full h-2/5 object-cover rounded-lg" 
        />
      :
        null
      }
      <div className="mt-8">
        <h2 
        className="text-xl font-bold hover:text-blue-500 hover:cursor-pointer" 
        onClick={openArticle}
        >{article.title}</h2>
        <p className="mt-2">{article.paragraphs && article.paragraphs[0]}</p>
        <p className="mt-2 text-gray-600">Source: {article.source}</p>
        {
        article.author && article.author.trim().length > 0 ? 
          <p className="text-gray-600">Author: {article.author}</p>
        :
          null
        }
        <p className="text-gray-600">Published on: {article.publish_date.toLocaleString()}</p>
      </div>
    </div>
  );
}
