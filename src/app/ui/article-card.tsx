// TODO: see which components or which parts could be left as server side components
"use client";

import React, { useState } from 'react';
import { FeedArticleResult } from '../lib/models/feed-article';
import Tags from './tags';

export default function ArticleCard({ article } : { article: FeedArticleResult }) {

  const openArticle = () => {
    window.open(article.url, '_blank');
  }

  const [detailsOpen, setDetailsOpen] = useState(false);

  const detailsPresent = () => {
    return (article.categories && article.categories.length > 0) || (article.topics && article.topics.length > 0);
  }

  const renderDetails = () => {
    return (
      <div className="mt-4">
        {article.categories && article.categories.length > 0 && renderCategories()}
        {article.topics && article.topics.length > 0 && renderTopics()}
      </div>
    )
  }

  const renderCategories = () => {
   return ( 
    <div>
      <p className="text-sm text-gray-600">Categories:</p>
      <Tags texts={article.categories!.map(category => category.name)}></Tags>
    </div> 
   );
  }

  const renderTopics = () => {
   return ( 
    <div className="mt-2">
      <p className="text-sm text-gray-600">Topics:</p>
      <Tags texts={article.topics!.map(topic => topic.topic)}></Tags>
    </div> 
   );
  }

  return (
    <div
      className="bg-white shadow-md shadow-gray-300 rounded-lg break-inside-avoid-column"
    >
      <div 
      className="pt-4 px-4 pb-2"
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
          <p className="mt-2 text-sm text-gray-600">Source: {article.source}</p>
          {
          article.author && article.author.trim().length > 0 ? 
            <p className="text-sm text-gray-600">Author: {article.author}</p>
          :
            null
          }
          <p className="text-sm text-gray-600">Published on: {article.publish_date.toLocaleString()}</p>
          {detailsOpen && renderDetails()}
        </div>
      </div>
      {detailsPresent() && 
        <div className="mt-2 w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" 
          className="h-7 w-full text-gray-400 rounded-b-md bg-gray-200 hover:bg-blue-600 hover:cursor-pointer hover:text-white" 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
          onClick={() => setDetailsOpen(!detailsOpen)}
          >
            {detailsOpen ? 
            // upwards chevron
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /> 
            :
            // downwards chevron
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            }
          </svg>
        </div>
      }
    </div>
  );

}
