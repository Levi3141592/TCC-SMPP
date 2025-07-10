export async function sendToOpenAI(messages) {
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen/qwen3-4b:free',
        max_tokens: 1000,
        messages,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro da API: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
