import { useLocation } from "react-router-dom";

const BulkResults = () => {
    const { state } = useLocation();

    const results = state?.results || [];

    return (
        <div className="results-page">

            <h1>
                Bulk URL Detection Results
            </h1>

            <table>
                <thead>
                    <tr>
                        <th>URL</th>
                        <th>Prediction</th>
                        <th>Confidence</th>
                    </tr>
                </thead>

                <tbody>
                    {results.map((item, index) => (
                        <tr key={index}>
                            <td>{item.url}</td>
                            <td>{item.result}</td>
                            <td>{item.confidence}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <a
                href="http://localhost:5000/download_results"
                className="download-btn"
            >
                Download Results
            </a>

        </div>
    );
};

export default BulkResults;