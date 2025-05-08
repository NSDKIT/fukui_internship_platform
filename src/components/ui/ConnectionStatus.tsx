import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('profiles').select('id').limit(1);
        
        if (error) {
          setStatus('error');
          setErrorMessage(error.message);
        } else {
          setStatus('connected');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : '接続エラーが発生しました');
      }
    };

    checkConnection();
  }, []);

  if (status === 'checking') {
    return (
      <div className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
        接続を確認中...
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 left-4 ${
      status === 'connected' ? 'bg-green-800' : 'bg-red-800'
    } text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2`}>
      {status === 'connected' ? (
        <>
          <CheckCircle className="h-5 w-5" />
          <span>Supabaseに接続済み</span>
        </>
      ) : (
        <>
          <XCircle className="h-5 w-5" />
          <div>
            <p>接続エラー</p>
            <p className="text-sm opacity-80">{errorMessage}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;