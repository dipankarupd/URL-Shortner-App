import React from 'react';
import { Header } from './components/Header';
import { URLForm } from './components/UrlForm';
import { ErrorMessage } from './components/ErrorMessage';
import { ResultDisplay } from './components/ResultDisplay';
import { useURLShortener } from './hooks/useURLShortner';

const App: React.FC = () => {
  const {
    url,
    customShort,
    loading,
    result,
    error,
    setUrl,
    setCustomShort,
    shortenURL,
  } = useURLShortener();

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'white', // Full white background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: '32px',
      }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <Header />
        </div>

        <URLForm
          url={url}
          customShort={customShort}
          
          loading={loading}
          onUrlChange={setUrl}
          onCustomShortChange={setCustomShort}
          
          onSubmit={shortenURL}
        />

        {error && <ErrorMessage error={error} />}
        {result && <ResultDisplay result={result} />}

        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b7280',
          paddingTop: '16px',
        }}>
          <p>Enter a URL above to create a shortened link</p>
        </div>
      </div>
    </div>
  );
};

export default App;
