'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/books', label: 'Books', icon: '📚' },
    { href: '/categories', label: 'Categories', icon: '🏷️' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__inner}>
        <Link href="/books" className={styles.navbar__brand}>
          <div className={styles.navbar__logo}>📖</div>
          <span className={styles['navbar__brand-name']}>
            Book<span>Shelf</span>
          </span>
        </Link>

        <div className={styles.navbar__nav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navbar__link} ${
                pathname.startsWith(link.href) ? styles.active : ''
              }`}
            >
              <span className={styles['navbar__link-icon']}>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
