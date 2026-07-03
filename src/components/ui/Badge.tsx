import styles from './Badge.module.css';

type BadgeVariant = 'accent' | 'success' | 'warning' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({ children, variant = 'accent' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[`badge--${variant}`]}`}>
      {children}
    </span>
  );
}
