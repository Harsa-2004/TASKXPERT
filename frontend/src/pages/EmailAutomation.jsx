// // src/pages/EmailAutomation.jsx
// import { useState } from "react";
// import "../styles/email.css";

// const EmailAutomation = () => {
//   const [prompt, setPrompt] = useState("");
//   const [generatedEmail, setGeneratedEmail] = useState("");
//   const [to, setTo] = useState("");
//   const [subject, setSubject] = useState("");
//   const [editable, setEditable] = useState(false);

//   const handleGenerate = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/generate-email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt }),
//       });
  
//       const data = await res.json();
  
//       if (!res.ok) {
//         throw new Error(data.error || "Email generation failed");
//       }
  
//       setGeneratedEmail(data.email); // Assuming backend sends { email: "...text..." }
//       setSubject("Generated Email"); // You can modify this dynamically if needed
//       setEditable(false);
//     } catch (err) {
//       console.error("Email generation error:", err.message);
//       alert("Failed to generate email. Please try again.");
//     }
//   };
  

//   const handleSend = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/send-email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           to,
//           subject,
//           body: generatedEmail,
//         }),
//       });
  
//       const data = await res.json();
  
//       if (!res.ok) {
//         throw new Error(data.error || "Failed to send email");
//       }
  
//       alert("✅ Email sent successfully!");
//     } catch (err) {
//       console.error("Send email error:", err.message);
//       alert("❌ Failed to send email.");
//     }
//   };
  

//   return (
//     <div className="email-container">
//       <h1>Email Automation</h1>

//       <div className="form-section">
//         <label>Recipient Email</label>
//         <input
//           type="email"
//           placeholder="example@gmail.com"
//           value={to}
//           onChange={(e) => setTo(e.target.value)}
//         />

//         <label>Enter your prompt or bullet points</label>
//         <textarea
//           placeholder="Write what you want to include..."
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//         ></textarea>

//         <button onClick={handleGenerate}>Generate Email</button>
//       </div>

//       {generatedEmail && (
//         <div className="output-section">
//           <h2>Generated Email</h2>
//           <input
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             className="subject-input"
//             placeholder="Subject"
//           />

//           <textarea
//             className="generated-email"
//             value={generatedEmail}
//             onChange={(e) => setGeneratedEmail(e.target.value)}
//             disabled={!editable}
//           ></textarea>

//           <div className="actions">
//             <button onClick={() => setEditable(!editable)}>
//               {editable ? "Lock Edit" : "Edit"}
//             </button>
//             <button onClick={handleSend}>Send Email</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmailAutomation;



import { useState } from "react";
import "../styles/email.css";

const EmailAutomation = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [editable, setEditable] = useState(false);
  const [attachment, setAttachment] = useState(null); // ✅ File state

  const handleGenerate = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Email generation failed");
      }

      setGeneratedEmail(data.email);
      setSubject("Generated Email");
      setEditable(false);
    } catch (err) {
      console.error("Email generation error:", err.message);
      alert("Failed to generate email. Please try again.");
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
  
      const res = await fetch("http://localhost:5000/api/image-to-email", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Image processing failed");
      }
  
      setPrompt(data.extractedText || ""); // Optional: Set extracted prompt
      setGeneratedEmail(data.generatedEmail || "");
      setSubject("Generated Email from Image");
      setEditable(false);
    } catch (err) {
      console.error("Image-to-Email error:", err.message);
      alert("❌ Failed to process image. Try again.");
    }
  };
  

  const handleSend = async () => {
    try {
      const formData = new FormData();
      formData.append("to", to);
      formData.append("subject", subject);
      formData.append("body", generatedEmail);
      if (attachment) {
        formData.append("attachment", attachment); // ✅ Append file
      }

      const res = await fetch("http://localhost:5000/api/send-email", {
        method: "POST",
        body: formData, // ✅ Send FormData, no headers!
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      alert("✅ Email sent successfully!");
    } catch (err) {
      console.error("Send email error:", err.message);
      alert("❌ Failed to send email.");
    }
  };

  return (
    <div className="email-container">
      <h1>Email Generation</h1>

      <div className="form-section">
        <label>Recipient Email</label>
        <input
          type="email"
          placeholder="example@gmail.com"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <label>Enter your prompt or bullet points</label>
        <textarea
          placeholder="Write what you want to include..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>

        {/* <label>Or Upload an Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          className="file-input"
        /> */}
        <div style={{ marginTop: "10px" }}>
        <label htmlFor="imageUpload" style={{ display: "block", marginBottom: "8px" }}>
          Upload Image for Email Content
        </label>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => setAttachment(e.target.files[0])}
          />
          <button
            type="button"
            onClick={async () => {
              if (!attachment) {
                alert("Please upload an image first.");
                return;
              }

              try {
                const formData = new FormData();
                formData.append("image", attachment);

                const res = await fetch("http://localhost:5000/api/extract-text", {
                  method: "POST",
                  body: formData,
                });

                const data = await res.json();

                if (!res.ok) {
                  throw new Error(data.error || "Failed to extract text from image");
                }

                const combinedPrompt =
                  prompt.trim() + "\n\nExtracted from image:\n" + data.text.trim();

                setPrompt(combinedPrompt);
                alert("✅ Text extracted and added to prompt!");
              } catch (err) {
                console.error("Image OCR error:", err.message);
                alert("❌ Failed to extract text from image.");
              }
            }}
          >
            Extract
          </button>
        </div>
      </div>


        <button onClick={handleGenerate}>Generate Email</button>
      </div>

      {generatedEmail && (
        <div className="output-section">
          <h2>Generated Email</h2>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="subject-input"
            placeholder="Subject"
          />

          <textarea
            className="generated-email"
            value={generatedEmail}
            onChange={(e) => setGeneratedEmail(e.target.value)}
            disabled={!editable}
          ></textarea>

          <label>Attach File</label>
          <input
            type="file"
            onChange={(e) => setAttachment(e.target.files[0])}
            className="file-input"
          />

          <div className="actions">
            <button onClick={() => setEditable(!editable)}>
              {editable ? "Lock Edit" : "Edit"}
            </button>
            <button onClick={handleSend}>Send Email</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAutomation;
