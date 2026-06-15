import SingleCheck from "../components/SingleCheck";
import BulkCheck from "../components/BulkCheck";

const Home = () => {
    return (
        <div className="container">
            <h1 className="main-title">
                🔒 URL Phishing Detection
            </h1>

            <div className="cards-container">
                <SingleCheck />
                <BulkCheck />
            </div>
        </div>
    );
};

export default Home;