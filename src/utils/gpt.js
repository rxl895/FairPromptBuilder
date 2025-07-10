export async function generateCompletion(prompt, model = "google/flan-t5-small") {
  const token = process.env.REACT_APP_HF_API_TOKEN;

  if (!token) {
    console.error("❌ Missing Hugging Face token in environment variables.");
    throw new Error("Hugging Face token is not set.");
  }

  console.log("🔐 Using model:", model);
  console.log("🧪 Prompt:", prompt);

  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        return_full_text: false
      }
    })
  });

  if (!response.ok) {
    const errMsg = await response.text();
    console.error("❌ HF API Error:", errMsg);
    throw new Error("Failed to fetch Hugging Face response");
  }

  const data = await response.json();
  console.log("✅ Response Data:", data);

  // Safely access generated_text
  return typeof data === "string"
    ? data
    : Array.isArray(data) && data[0]?.generated_text
    ? data[0].generated_text
    : "No output.";
}
