import { useState, useEffect } from 'react';
import api from '../api';

export default function ApiStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const healthPath = import.meta.env.PROD ? '' : '/health';
    api.get(healthPath)
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'checking') return null;

  return (
    <div
      className={`api-status api-status-${status}`}
      title={status === 'ok' ? 'Backend connected' : 'Cannot reach backend'}
    >
      API {status === 'ok' ? 'OK' : 'Offline'}
    </div>
  );
}
