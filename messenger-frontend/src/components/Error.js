import { useEffect, useState } from "react";
import "./css/Error.css";

export default function Error({error, setError}) {
    const [boxId, setBoxId] = useState("hidden-error-box");

    useEffect(() => {
        if (error.length > 0) {
            setBoxId("error-box");
            setTimeout(() => {
                setError("");
                setBoxId("hidden-error-box");
            }, 6000);
        }
    }, [error, setError]);

    return (
        <div id={boxId}>
            {error}
        </div>
    )
}