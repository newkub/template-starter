import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'

export default function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/v1/a')
      .then((res) => res.json())
      .then(({ message }) => setMessage(message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="flex gap-8 mb-8">
        <a 
          href="https://vitejs.dev" 
          target="_blank"
          className="transition-transform hover:scale-110"
        >
          <img 
            src="/vite.svg" 
            className="h-24 w-24 hover:drop-shadow-lg hover:drop-shadow-blue-500/50" 
            alt="Vite logo" 
          />
        </a>
        <a 
          href="https://reactjs.org" 
          target="_blank"
          className="transition-transform hover:scale-110"
        >
          <img 
            src={reactLogo} 
            className="h-24 w-24 animate-spin-slow hover:drop-shadow-lg hover:drop-shadow-cyan-500/50" 
            alt="React logo" 
          />
        </a>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
        Vite + React + Nitro 🤝
      </h1>

      <h2 className="text-xl md:text-2xl mb-8 text-green-400 font-semibold">
        API Response: {message}
      </h2>

      <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700 max-w-md w-full text-center">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4"
        >
          count is {count}
        </button>
        <p className="text-gray-300 text-sm">
          Edit <code className="bg-gray-700 px-2 py-1 rounded text-cyan-300 font-mono text-xs">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <p className="text-gray-400 text-sm mt-8 text-center max-w-sm">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}
