from flask import Flask, request, send_file, jsonify
import pickle
import pandas as pd
import io

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

last_results = None  

@app.route('/')
def test():
    return jsonify({"message": "Backend Running Successfully"})



@app.route('/predict', methods=['POST'])
def predict():
    url = request.form.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400

    url_vector = vectorizer.transform([url])

    prediction = model.predict(url_vector)[0]
    confidence = model.predict_proba(url_vector)[0]

    phishing_prob = round(confidence[1] * 100, 2)
    safe_prob = round(confidence[0] * 100, 2)

    if prediction == 1:
        return jsonify({
            "status": "Phishing",
            "confidence": phishing_prob
        })
    else:
        return jsonify({
            "status": "Safe",
            "confidence": safe_prob
        })

@app.route('/bulk', methods=['POST'])
def bulk_predict():
    global last_results

    file = request.files.get('file')

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = file.filename.lower()

    if filename.endswith('.csv'):
        df = pd.read_csv(file)
    elif filename.endswith(('.xlsx', '.xls')):
        df = pd.read_excel(file)
    else:
        return jsonify({
    "error": "Unsupported file format. Please upload CSV or Excel."
}), 400

    if 'url' not in df.columns:
        return jsonify({
    "error": "File must contain a column named 'url'"
}), 400

    urls = df['url'].astype(str)
    url_vectors = vectorizer.transform(urls)
    predictions = model.predict(url_vectors)
    probabilities = model.predict_proba(url_vectors)

    results = []
    for i, url in enumerate(urls):
        label = "⚠️ Phishing" if predictions[i] == 1 else "✅ Safe"
        confidence = round(max(probabilities[i]) * 100, 2)
        results.append({"url": url, "result": label, "confidence": confidence})

    last_results = pd.DataFrame(results)

    return jsonify({
    "results": results
})

@app.route('/download_results')
def download_results():
    global last_results
    if last_results is None:
        return "No results available. Please upload a file first.", 400

    output = io.StringIO()
    last_results.to_csv(output, index=False)
    output.seek(0)

    return send_file(
        io.BytesIO(output.getvalue().encode()),
        mimetype="text/csv",
        as_attachment=True,
        download_name="bulk_results.csv"
    )

if __name__ == "__main__":
    app.run(debug=True)
