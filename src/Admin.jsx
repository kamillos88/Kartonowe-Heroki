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
    let csv = 'Vote ID,Timestamp,Category ID,Category Name,Tier 1,Tier 2,Tier 3,Skipped\n';
    
    votes.forEach(vote => {
      // Sortuj kategorie po ID żeby była stała kolejność
      const sortedVotes = Object.values(vote.votes).sort((a, b) => a.categoryId - b.categoryId);
      
      sortedVotes.forEach(v => {
        csv += `"${vote.voteId}","${vote.timestamp}",${v.categoryId},"${v.categoryName}","${v.tier1 || ''}","${v.tier2 || ''}","${v.tier3 || ''}",${v.skipped || false}\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glosy_kartonowe_heroki.csv';
    a.click();
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ marginBottom: '30px' }}>🏆 Panel Admina - Głosy</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={fetchVotes} 
          disabled={loading}
          style={{ 
            padding: '15px 30px', 
            fontSize: '18px', 
            marginRight: '10px',
            background: '#296DC7',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Ładowanie...' : '🔄 Pobierz Głosy'}
        </button>

        {votes.length > 0 && (
          <button 
            onClick={exportToCSV}
            style={{ 
              padding: '15px 30px', 
              fontSize: '18px',
              background: '#4ade80',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📥 Eksportuj do CSV
          </button>
        )}
      </div>

      <div>
        <h2 style={{ marginBottom: '20px' }}>Znaleziono głosów: {votes.length}</h2>
        
        {votes.map((vote, idx) => (
          <div key={idx} style={{ 
            background: '#f5f5f5', 
            padding: '25px', 
            marginBottom: '25px',
            borderRadius: '12px',
            border: '2px solid #ddd'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              borderBottom: '2px solid #ccc',
              paddingBottom: '10px'
            }}>
              <h3 style={{ margin: 0 }}>📝 Kod: {vote.voteId}</h3>
              <p style={{ margin: 0, color: '#666' }}>
                📅 {new Date(vote.timestamp).toLocaleString('pl-PL')}
              </p>
            </div>
            
            {/* Tabela głosów */}
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              background: 'white'
            }}>
              <thead>
                <tr style={{ background: '#296DC7', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Kategoria</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>🥇 Tier 1</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>🥈 Tier 2</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>🥉 Tier 3</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(vote.votes)
                  .sort((a, b) => a.categoryId - b.categoryId)
                  .map((v, vIdx) => (
                    <tr key={vIdx} style={{ 
                      background: vIdx % 2 === 0 ? 'white' : '#f9f9f9' 
                    }}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{v.categoryId}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                        {v.categoryName}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {v.tier1 || '-'}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {v.tier2 || '-'}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                        {v.tier3 || '-'}
                      </td>
                      <td style={{ 
                        padding: '10px', 
                        border: '1px solid #ddd', 
                        textAlign: 'center',
                        color: v.skipped ? '#FE2525' : '#4ade80',
                        fontWeight: 'bold'
                      }}>
                        {v.skipped ? '⏭️ Pominięte' : '✅ Zagłosowano'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;