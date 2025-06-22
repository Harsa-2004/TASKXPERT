from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

openai.api_key = "f52b7461626ceccf24692344f6b6feeef7d979ecdbb09f1de5bd9871aaa4ec2a"  # Replace with your real key

@app.route('/generate-email', methods=['POST'])
def generate_email():
    prompt = request.json.get("prompt")

    response = openai.ChatCompletion.create(
        model="mistralai/Mistral-7B-Instruct-v0.1",  # or "gpt-4" if you have access
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    message = response['choices'][0]['message']['content']
    return jsonify({"email_content": message})

if __name__ == '__main__':
    app.run(debug=True)
