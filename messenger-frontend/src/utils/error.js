
const getMsgFromPromise = (promise, setError) => {
  try {
    promise.fullError.then(function (status) {
      setError(status.message);
    });
  } catch (e) {
    setError("Something went wrong. Please try again later.")
  }
  };

export default getMsgFromPromise;