import { React, useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import EverythingCard from './EverythingCard'
import Loader from "./Loader";


function TopHeadlines() {
  const params = useParams();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false); 

  

  function handlePrev() {
    setPage(page - 1)
  }
  function handleNext() {
    setPage(page + 1)
  }
  let pageSize = 6;
  useEffect(() => {
    setIsLoading(true); 
    fetch(`http://localhost:3000/top-headlines?language=en&category=${category}&page=${page}&pageSize=${pageSize}`)
      .then((response) => {
        if (response.ok) {
          // console.log(response.clone().json());
          return response.clone().json();
        }
      })
      .then((json) => {
        // console.log(json)
        setTotalResults(json.data.totalResults)
        setData(json.data.articles);
        setIsLoading(false); 
      });
  }, [page, params.category]);

  return (
    <>
      <div className='my-10 cards grid lg:place-content-center md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3 '>
        {!isLoading ? data.map((element, index) => {
          return <EverythingCard
            title={element.title} description={element.description} imgUrl={element.urlToImage}
            publishedAt={element.publishedAt} url={element.url} author={element.author}
            source={element.source.name} key={index}
          />
        }): <Loader />}
      </div>
      {!isLoading && <div className="pagination flex justify-center gap-14 my-10 items-center">
        <button disabled={page <= 1} className='pagination-btn' onClick={() => handlePrev()}>Prev</button>
        <p className='font-semibold opacity-80'>{page} of {Math.ceil(totalResults / 15)}</p>
        <button className='pagination-btn' disabled={page > Math.ceil(totalResults / 15)} onClick={() => handleNext()}>Next</button>
      </div>}
    </>
  );
}

export default TopHeadlines;
