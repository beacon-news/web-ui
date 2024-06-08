"use client";

import React, { useState } from 'react';
import { ArticleCategory, ArticleResult, ArticleTopic } from '../lib/models/article';
import Tags from './tags';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from './chevrons';

export default function ArticleCard(
{ 
  article,
  onCategoryClicked,
  onTopicClicked,
} : { 
  article: ArticleResult,
  onCategoryClicked?: (category: ArticleCategory) => void,
  onTopicClicked?: (topic: ArticleTopic) => void,
}) {

  const router = useRouter();

  const openArticle = () => {
    window.open(article.url, '_blank');
  }

  const [detailsOpen, setDetailsOpen] = useState(true);

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
        <Tags 
          texts={article.categories!.map(category => category.name)}
          selected={article.categories!.map(_ => false)}
          onToggled={onCategoryClicked ? (index, text, toggled) => onCategoryClicked(article.categories![index]) : undefined}
        />
      </div> 
    );
  }

  const renderTopics = () => {
   return ( 
    <div className="mt-2">
      <p className="text-sm text-gray-600">Topics:</p>
      <Tags 
        texts={article.topics!.map(topic => topic.topic)}
        selected={article.topics!.map(_ => false)}
        onToggled={onTopicClicked ? (index, text, toggled) => onTopicClicked(article.topics![index]) : undefined}
      />
    </div> 
   );
  }

  return (
    <div>
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
          (detailsOpen ?
          <ChevronUp
            className="h-7 w-full text-gray-400 rounded-b-md bg-gray-200 hover:bg-blue-600 hover:cursor-pointer hover:text-white" 
            onClick={() => setDetailsOpen(!detailsOpen)}
          />
          :
          <ChevronDown
            className="h-7 w-full text-gray-400 rounded-b-md bg-gray-200 hover:bg-blue-600 hover:cursor-pointer hover:text-white" 
            onClick={() => setDetailsOpen(!detailsOpen)}
          />
          )
        }
      </div>
    </div>
  );

}
