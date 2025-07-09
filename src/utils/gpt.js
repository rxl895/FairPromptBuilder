export async function generateCompletion(prompt) {
  const formattedPrompt = `<s>[INST] ${prompt} [/INST]`;

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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Hugging Face response: ${errorText}`);
  }

  const data = await response.json();
  return typeof data === "string" ? data : data[0]?.generated_text || "No output.";
}
