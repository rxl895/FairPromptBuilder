export async function generateCompletion(prompt) {
  const response = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.REACT_APP_HF_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        return_full_text: false
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("HF Raw Response:", error);
    throw new Error("Failed to fetch Hugging Face response");
  }

  const data = await response.json();
  return typeof data === "string" ? data : data[0]?.generated_text || "No output.";
}
