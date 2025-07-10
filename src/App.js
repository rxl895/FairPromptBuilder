import React, { useState } from 'react';
import { detectBias } from './utils/biasDetector';
import { generateCompletion } from './utils/gpt';

const taskTypes = [
  'Summarization',
  'Question Answering',
  'Classification',
  'Creative Writing',
];

const modelOptions = {
  'FLAN T5 Small': 'google/flan-t5-small',
  'Falcon 7B Instruct': 'tiiuae/falcon-7b-instruct',
};

function App() {
  const [task, setTask] = useState(taskTypes[0]);
  const [modelName, setModelName] = useState(Object.keys(modelOptions)[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [modelResponse, setModelResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const biasResults = detectBias(customPrompt);

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

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setModelResponse('');
    try {
      const response = await generateCompletion(customPrompt, modelOptions[modelName]);
      setModelResponse(response);
    } catch (err) {
      setError('⚠️ Failed to fetch model response.');
    } finally {
      setLoading(false);
    }
  };

  const biasMap = biasResults.reduce((map, item) => {
    map[item.term.toLowerCase()] = item;
    return map;
  }, {});

  const getHighlightedText = (text) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:]$/, '');
      const biasInfo = biasMap[cleanWord];
      if (biasInfo) {
        return (
          <span key={index} className="group relative cursor-help">
            <span className="bg-yellow-400 text-black font-semibold px-1 rounded">
              {word}
            </span>
            <span className="absolute z-10 hidden group-hover:block bg-yellow-100 text-black text-sm p-2 rounded shadow-lg mt-1 w-64 left-1/2 -translate-x-1/2 whitespace-normal">
              ⚠️ <strong>{biasInfo.term}</strong> ({biasInfo.type})<br />
              Consider: <em>{biasInfo.suggestion}</em>
            </span>
          </span>
        );
      }
      return word;
    });
  };

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
        <label className="block mb-1 font-medium">Select Model:</label>
        <select
          className="p-2 rounded bg-gray-800 text-white"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        >
          {Object.keys(modelOptions).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <p className="text-sm text-red-400 mt-1">
          📌 Currently using: <code>{modelOptions[modelName]}</code>
        </p>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Custom Prompt:</label>
        <textarea
          className="w-full h-40 p-3 rounded bg-gray-800 text-white border border-gray-700"
          placeholder="Type your prompt here..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />
      </div>

      <div className="mb-4 bg-gray-800 text-white p-4 rounded border border-yellow-400">
        <p className="text-yellow-300 font-semibold mb-2">🧠 Highlighted Prompt Preview:</p>
        <div className="whitespace-pre-wrap text-white leading-relaxed">
          {getHighlightedText(customPrompt)}
        </div>
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

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
        >
          Export to JSONL
        </button>

        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-semibold"
        >
          {loading ? 'Generating...' : 'Preview Model Response'}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-red-400">
          {error}
        </div>
      )}

      {modelResponse && (
        <div className="mt-6 bg-gray-800 p-4 rounded border border-purple-400">
          <p className="text-purple-300 font-semibold mb-2">🤖 Model Output:</p>
          <pre className="whitespace-pre-wrap text-white">{modelResponse}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
