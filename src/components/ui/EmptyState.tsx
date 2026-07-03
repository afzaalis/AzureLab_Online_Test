interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        gap: '1rem',
      }}
    >
      <div style={{ fontSize: '3rem', lineHeight: 1 }}>{icon}</div>
      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '360px',
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: '0.5rem' }}>{action}</div>}
    </div>
  );
}
