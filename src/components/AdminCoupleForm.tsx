import React, { useState } from 'react';

interface AdminCouple {
  name: string;
  numberOfCouples: number;
}

interface AdminCoupleFormProps {
  onSubmit: (adminCouples: AdminCouple[]) => void;
  onBack: () => void;
  totalEngagedCouples: number;
  loading?: boolean;
  error?: string | null;
}

export function AdminCoupleForm({ onSubmit, onBack, totalEngagedCouples, loading = false, error = null }: AdminCoupleFormProps) {
  const [adminCouples, setAdminCouples] = useState<AdminCouple[]>([
    { name: '', numberOfCouples: 1 }
  ]);

  const handleNameChange = (index: number, value: string) => {
    const newAdminCouples = [...adminCouples];
    newAdminCouples[index].name = value;
    setAdminCouples(newAdminCouples);
  };

  const handleNumberChange = (index: number, value: number) => {
    const newAdminCouples = [...adminCouples];
    newAdminCouples[index].numberOfCouples = value;
    setAdminCouples(newAdminCouples);
  };

  const getTotalRequestedCouples = () => {
    return adminCouples.reduce((sum, admin) => sum + (admin.numberOfCouples || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filledAdminCouples = adminCouples.filter(couple => couple.name.trim() !== '');
    
    if (filledAdminCouples.length < 1) {
      alert('Por favor, adicione pelo menos 1 casal administrador.');
      return;
    }

    const totalRequestedCouples = getTotalRequestedCouples();
    
    if (totalRequestedCouples < totalEngagedCouples) {
      alert(`Erro: Os casais administradores solicitaram ${totalRequestedCouples} casais, mas há ${totalEngagedCouples} casais de noivos para serem distribuídos. Todos os casais de noivos precisam ser sorteados.`);
      return;
    }

    if (totalRequestedCouples > totalEngagedCouples) {
      alert(`Erro: Os casais administradores solicitaram ${totalRequestedCouples} casais, mas só há ${totalEngagedCouples} casais de noivos disponíveis.`);
      return;
    }

    onSubmit(filledAdminCouples);
  };

  const handleAddCouple = () => {
    if (adminCouples.length < 10) {
      setAdminCouples([...adminCouples, { name: '', numberOfCouples: 1 }]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md lg:max-w-2xl xl:max-w-3xl mx-auto p-4 sm:p-6  rounded-lg shadow-lg space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
        {adminCouples.map((couple, index) => (
          <div key={index} className="space-y-2 p-4 border border-gray-200 rounded-lg">
            <div>
              <input
                type="text"
                value={couple.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="Nome do casal administrador..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Número de casais:</label>
              <input
                type="number"
                min="1"
                max={totalEngagedCouples}
                value={couple.numberOfCouples}
                onChange={(e) => handleNumberChange(index, parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1  bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>
        ))}
      </div>

      {adminCouples.length < 10 && (
        <button
          type="button"
          onClick={handleAddCouple}
          className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
          disabled={loading}
        >
          + Adicionar mais um casal administrador
        </button>
      )}

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all disabled:opacity-50"
          disabled={loading}
        >
          Voltar
        </button>

        <button
          type="submit"
          className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 flex items-center justify-center"
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
            'Realizar Sorteio'
          )}
        </button>
      </div>
    </form>
  );
};
