import React, { useState } from 'react';

interface CoupleFormProps {
  onSubmit: (names: string[]) => void;
  loading?: boolean;
  error?: string | null;
}

export function CoupleForm({ onSubmit, loading = false, error = null }: CoupleFormProps) {
  const [names, setNames] = useState<string[]>(['', '', '']);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filledNames = names.filter(name => name.trim() !== '');
    if (filledNames.length < 2) {
      alert('Por favor, preencha pelo menos 2 nomes de casais para realizar o sorteio.');
      return;
    }
    onSubmit(filledNames);
  };

  const handleAddName = () => {
    if (names.length < 100) {
      setNames([...names, '']);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
        {names.map((name, index) => (
          <div key={index} className="space-y-1">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Nome do casal ${index + 1}...`}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                aria-label={`Nome ${index + 1}`}
                disabled={loading}
              />
            </div>
          </div>
        ))}
      </div>
      
      {names.length < 100 && (
        <button
          type="button"
          onClick={handleAddName}
          className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
          disabled={loading}
        >
          + Adicionar mais um casal
        </button>
      )}

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Salvando...
          </>
        ) : (
          'Continuar'
        )}
      </button>
    </form>
  );
};
