import { useState, useCallback } from 'react';

const useFetch = () => {
  const [errorOccured, setErrorOccured] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const httpRequest = useCallback(async (configObj, applyDataFn = null) => {
    try {
      setIsLoading(true);
      setErrorOccured(null);

      const response = await fetch(configObj.url, {
        method: configObj.method ? configObj.method : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: configObj.body ? JSON.stringify(configObj.body) : null,
      });

      if (!response.ok)
        throw new Error(
          'There was a problem with the server... Please try again!'
        );

      const data = await response.json();

      applyDataFn && applyDataFn(data);
    } catch (err) {
      setErrorOccured(err.message);
    } finally {
      setIsLoading(false);
      setDidSubmit(true);
    }
  }, []);

  return {
    errorOccured,
    isLoading,
    httpRequest,
    didSubmit,
  };
};

export default useFetch;
