import { useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

const SingleCheck = () => {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState("");
    const [error, setError] = useState("");


    const checkURL = async () => {
        setError("");
        setResult("");

        if (!url.trim()) {
            setError("Please enter a URL");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("url", url);

            const response = await API.post("/predict", formData);

            const { status, confidence } = response.data;

            setResult(`${status} - Confidence: ${confidence}%`);
        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Error checking URL"
            );
        }
    };

    return (
        <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h2>Single URL Check</h2>

            <input
                type="text"
                placeholder="Enter URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            <button onClick={checkURL}>
                Check URL
            </button>

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}

            {result && (
                <div className="result-box">
                    {result}
                </div>
            )}
        </motion.div>
    );
};

export default SingleCheck;