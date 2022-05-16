const printError = (promise, setError) => {
    promise.fullError.then(function (status) {
      setError(`${status.message}`);
    });
  };

export default printError;