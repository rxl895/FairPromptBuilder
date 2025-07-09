import React, { useState } from 'react';
import { detectBias } from './utils/biasDetector';

const taskTypes = [
  'Summarization',
  'Question Answering',
  'Classification',
  'Creative Writing',
];

function App() {
  const [task, setTask] = useState(taskTypes[0]);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleExport = () => {
    const jsonl = JSON.stringify({ task, prompt: customPrompt }) + '\n';
    const blob = new Blob([jsonl], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt.jsonl';
    a.click();
    URL.revokeObjectURL(url);
  };

  const biasResults = detectBias(customPrompt);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🚀 FairPromptBuilder</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Task Type:</label>
        <select
          className="p-2 rounded bg-gray-800 text-white"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        >
          {taskTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Custom Prompt:</label>
        <textarea
          className="w-full h-40 p-3 rounded bg-gray-800 text-white"
          placeholder="Type your prompt here..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />
      </div>

      {biasResults.length > 0 ? (
        <div className="mb-4">
          <p className="text-yellow-400 font-semibold">⚠️ Potential Bias Detected:</p>
          <ul className="list-disc list-inside text-yellow-300">
            {biasResults.map((item, idx) => (
              <li key={idx}>
                <strong>{item.term}</strong> ({item.type}) → consider <em>{item.suggestion}</em>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-green-400">✅ No bias indicators detected.</p>
        </div>
      )}

      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
      >
        Export to JSONL
      </button>
    </div>
  );
}

export default App;
