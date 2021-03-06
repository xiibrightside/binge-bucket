import React, { useEffect, useState } from 'react';
import MainPageLayout from '../components/MainPageLayout';
import { useShows } from '../misc/custom-hooks';
import { apiGet } from '../misc/config';
import ShowGrid from '../components/show/ShowGrid';
import { Msgs } from './Starred.styled';

const Starred = () => {
  const [starred] = useShows();
  const [shows, setShows] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (starred && starred.length > 0) {
      const promises = starred.map(showId => apiGet(`/shows/${showId}`));
      Promise.all(promises)
        .then(apiData => apiData.map(show => ({ show })))
        .then(results => {
          setShows(results);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [starred]);
  return (
    <MainPageLayout>
      <Msgs>
        {isLoading && <div className="messages">Loading ...</div>}
        {error && <div className="messages">Whoops, {error}</div>}
        {!isLoading && !shows && (
          <div className="messages">Your Bucket is Empty Bozo</div>
        )}
        {!isLoading && !error && shows && <ShowGrid data={shows} />}
      </Msgs>
    </MainPageLayout>
  );
};

export default Starred;
