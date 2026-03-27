import React, { useState, useEffect } from 'react';
import api from '../api';
import { Activity, ShieldAlert, CheckCircle } from 'lucide-react';

const HistoryLog = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/crypto/history');
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getBadgeColor = (type) => {
    if (type.includes('ENCRYPT')) return 'badge-success';
    return 'badge-error'; // using error style but we can define custom ones
  };

  const getFormattedDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>Loading activity logs...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Activity className="text-primary" />
        <h2 style={{ margin: 0 }}>Recent Access Activity</h2>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <ShieldAlert size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p>No cryptographic operations performed yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Operation</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Item Identifier</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Algorithm</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Timestamp</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((log) => (
                <tr key={log._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background-color 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${log.operationType.includes('ENCRYPT') ? 'badge-success' : 'badge-error'}`} style={{ backgroundColor: 'transparent', border: '1px solid currentColor' }}>
                      {log.operationType.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                    {log.filename || 'Text Data Snippet'}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{log.algorithm}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{getFormattedDate(log.timestamp)}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)' }}>
                      <CheckCircle size={16} /> <span style={{ fontSize: '0.875rem' }}>Success</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <style>{`
            .table-row-hover:hover {
              background-color: rgba(255, 255, 255, 0.02);
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default HistoryLog;
