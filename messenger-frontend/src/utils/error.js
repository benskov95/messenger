
const displayError = (err, setError) => {
  if (typeof err === "string") {
    setError(err);
  } else {
    try {
      err.fullError.then((status) => {
        setError(status.message);
      });
    } catch (e) {
      setError("Something went wrong. Please try again later.")
    }
  }
  };

export default displayError;