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
    if (!projectId || !decodedEmail) {
      setState('error');
      setErrorMsg('Invalid invitation link. Please request a new one.');
    }
  }, [projectId, decodedEmail]);

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
        err?.response?.data?.message ??
          'Something went wrong. Please try again.',
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--color-bg)]">
      <div className="w-full max-w-md text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] px-8 py-10">

        <div
          className={`mx-auto mb-5 flex items-center justify-center w-14 h-14 rounded-full
          ${
            state === 'success'
              ? 'bg-green-100'
              : state === 'error'
              ? 'bg-red-100'
              : 'bg-blue-100'
          }`}
        >
          {state === 'success' ? (
            <CheckCircle className="text-[var(--color-success)]" size={28} />
          ) : state === 'error' ? (
            <XCircle className="text-[var(--color-danger)]" size={28} />
          ) : (
            <Mail className="text-[var(--color-primary)]" size={28} />
          )}
        </div>

        <h1 className="text-[1.375rem] font-bold text-[var(--color-text-primary)] mb-2 leading-snug">
          {state === 'success'
            ? "You're in!"
            : state === 'error'
            ? 'Invitation Error'
            : 'Project Invitation'}
        </h1>

        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-7">
          {state === 'success'
            ? 'You have successfully joined the project. Head to your projects to get started.'
            : state === 'error'
            ? errorMsg
            : "You've been invited to join a project. Click below to accept and start collaborating."}
        </p>

        {(state === 'idle' || state === 'loading') && (
          <button
            onClick={handleAccept}
            disabled={state === 'loading'}
            className={`w-full flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold rounded-[var(--radius-sm)] shadow-[var(--shadow-sm)] transition
              ${
                state === 'loading'
                  ? 'bg-[var(--color-primary-light)] cursor-not-allowed'
                  : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'
              }
              text-[var(--color-text-inverse)]
            `}
          >
            {state === 'loading' && (
              <Loader2 className="animate-spin" size={16} />
            )}
            {state === 'loading'
              ? 'Joining project...'
              : 'Accept Invitation'}
          </button>
        )}

        {state === 'error' && (
          <button
            onClick={() => {
              setState('idle');
              setErrorMsg('');
            }}
            className="w-full py-3 px-5 text-sm font-semibold rounded-[var(--radius-sm)] border border-[var(--color-primary)] text-[var(--color-primary)] mb-3"
          >
            Try Again
          </button>
        )}

        {(state === 'success' || state === 'error') && (
          <button
            onClick={() => navigate('/projects')}
            className="w-full py-3 px-5 text-sm font-medium rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-text-secondary)]"
          >
            Go to Projects
          </button>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitePage;