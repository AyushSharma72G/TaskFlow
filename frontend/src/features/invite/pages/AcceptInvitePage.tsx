import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { acceptInviteApi } from '../api/invite.api';

type State = 'idle' | 'loading' | 'success' | 'error';

const AcceptInvitePage = () => {
  const { projectId, emailId } = useParams<{
    projectId: string;
    emailId: string;
  }>();
  const navigate = useNavigate();
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const decodedEmail = emailId ? decodeURIComponent(emailId) : '';

  useEffect(() => {
    if (!projectId || !emailId) {
      setState('error');
      setErrorMsg('Invalid invitation link. Please request a new one.');
    }
  }, [projectId, emailId]);

  const handleAccept = async () => {
    if (!projectId || !decodedEmail) return;
    setState('loading');
    setErrorMsg('');

    try {
      await acceptInviteApi(projectId, decodedEmail);
      setState('success');
    } catch (err: any) {
      setState('error');
      setErrorMsg(
        err?.response?.data?.message ?? 'Something went wrong. Please try again.',
      );
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '2.5rem 2rem',
          maxWidth: 420,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '50%',
            marginBottom: '1.25rem',
            background:
              state === 'success'
                ? 'rgb(220 252 231)'
                : state === 'error'
                  ? 'rgb(254 226 226)'
                  : 'rgb(219 234 254)',
          }}
        >
          {state === 'success' ? (
            <CheckCircle size={28} style={{ color: 'var(--color-success)' }} />
          ) : state === 'error' ? (
            <XCircle size={28} style={{ color: 'var(--color-danger)' }} />
          ) : (
            <Mail size={28} style={{ color: 'var(--color-primary)' }} />
          )}
        </div>

        <h1
          style={{
            fontSize: '1.375rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '0.5rem',
            lineHeight: 1.3,
          }}
        >
          {state === 'success'
            ? "You're in!"
            : state === 'error'
              ? 'Invitation Error'
              : 'Project Invitation'}
        </h1>

        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
          }}
        >
          {state === 'success'
            ? 'You have successfully joined the project. Head to your projects to get started.'
            : state === 'error'
              ? errorMsg
              : `You've been invited to join a project. Click below to accept and start collaborating.`}
        </p>

        {(state === 'idle' || state === 'loading') && (
          <button
            onClick={handleAccept}
            disabled={state === 'loading'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '0.72rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-text-inverse)',
              background:
                state === 'loading'
                  ? 'var(--color-primary-light)'
                  : 'var(--color-primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: state === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '0.75rem',
            }}
            onMouseEnter={(e) => {
              if (state !== 'loading')
                (e.currentTarget as HTMLElement).style.background =
                  'var(--color-primary-dark)';
            }}
            onMouseLeave={(e) => {
              if (state !== 'loading')
                (e.currentTarget as HTMLElement).style.background =
                  'var(--color-primary)';
            }}
          >
            {state === 'loading' && (
              <Loader2
                size={16}
                style={{ animation: 'spin 1s linear infinite' }}
              />
            )}
            {state === 'loading' ? 'Joining project...' : 'Accept Invitation'}
          </button>
        )}

        {state === 'error' && (
          <button
            onClick={() => { setState('idle'); setErrorMsg(''); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '0.72rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              background: 'transparent',
              border: '1.5px solid var(--color-primary)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              marginBottom: '0.75rem',
            }}
          >
            Try Again
          </button>
        )}

        {(state === 'success' || state === 'error') && (
          <button
            onClick={() => navigate('/projects')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '0.72rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              background: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            Go to Projects
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AcceptInvitePage;