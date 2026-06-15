import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BulkCheck = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const uploadFile = async () => {
        setError("");

        if (!file) {
            setError("Please select a CSV or Excel file");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await API.post("/bulk", formData);

            navigate("/bulk-results", {
                state: {
                    results: response.data.results,
                },
            });

        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Something went wrong"
            );
        }
    };

    return (
        <motion.div
            className="glass-card"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <h2>Bulk URL Check</h2>

            <p>Upload CSV/Excel</p>

            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={uploadFile}>
                Upload & Check
            </button>
            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}
        </motion.div>
    );
};

export default BulkCheck;