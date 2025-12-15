import React, { useState } from 'react';
import { getAllVotes } from './firebase';

function Admin() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVotes = async () => {
    setLoading(true);
    const data = await getAllVotes();
    setVotes(data);
    setLoading(false);
  };

  const exportToCSV = () => {
    let csv = 'Vote ID,Timestamp,Category,Tier 1,Tier 2,Tier 3,Skipped\n';
    
    votes.forEach(vote => {
      Object.values(vote.votes).forEach(v => {
        csv += `${vote.voteId},${vote.timestamp},${v.categoryName},${v.tier1 || ''},${v.tier2 || ''},${v.tier3 || ''},${v.skipped || false}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glosy.csv';
    a.click();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Panel Admina - Głosy</h1>
      
      <button 
        onClick={fetchVotes} 
        disabled={loading}
        style={{ padding: '15px 30px', fontSize: '18px', marginRight: '10px' }}
      >
        {loading ? 'Ładowanie...' : 'Pobierz Głosy'}
      </button>

      {votes.length > 0 && (
        <button 
          onClick={exportToCSV}
          style={{ padding: '15px 30px', fontSize: '18px' }}
        >
          Eksportuj do CSV
        </button>
      )}

      <div style={{ marginTop: '30px' }}>
        <h2>Znaleziono głosów: {votes.length}</h2>
        {votes.map((vote, idx) => (
          <div key={idx} style={{ 
            background: '#f5f5f5', 
            padding: '20px', 
            marginBottom: '20px',
            borderRadius: '10px'
          }}>
            <h3>Kod: {vote.voteId}</h3>
            <p>Data: {new Date(vote.timestamp).toLocaleString('pl-PL')}</p>
            <pre style={{ background: 'white', padding: '10px', overflow: 'auto' }}>
              {JSON.stringify(vote.votes, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;