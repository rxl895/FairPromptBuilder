export async function generateCompletion(prompt) {
  const formattedPrompt = `<s>[INST] ${prompt} [/INST]`;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: formattedPrompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    const raw = await response.text();
    console.log("🧾 HF Raw Response:", raw); // Debug log

    if (!response.ok) {
      throw new Error(`HF API Error: ${response.status} — ${raw}`);
    }

    const data = JSON.parse(raw);
    return typeof data === "string" ? data : data[0]?.generated_text || "No output.";
  } catch (err) {
    console.error("❌ Model API Error:", err.message); // Key log
    throw err;
  }
}
