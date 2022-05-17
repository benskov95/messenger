
const getMsgFromPromise = (promise, setError) => {
    promise.fullError.then(function (status) {
      setError(status.message);
    });
  };

export default getMsgFromPromise;