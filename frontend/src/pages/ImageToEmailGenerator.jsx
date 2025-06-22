import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ImageToEmailGenerator = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/generate-from-image", formData);
      setExtractedText(res.data.extracted_text);
      setGeneratedEmail(res.data.generated_email);
    } catch (err) {
      alert("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">📸 Image-to-Email Generator</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="formFile" className="form-label">Upload Image (e.g. whiteboard, handwritten notes)</label>
            <input className="form-control" type="file" id="formFile" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="text-center">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Generate Email"}
            </button>
          </div>
        </form>

        {extractedText && (
          <div className="mt-4">
            <h5>📝 Extracted Text:</h5>
            <pre className="bg-light p-3">{extractedText}</pre>
          </div>
        )}

        {generatedEmail && (
          <div className="mt-4">
            <h5>✉️ Generated Email:</h5>
            <div className="bg-white border rounded p-3">{generatedEmail}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToEmailGenerator;
