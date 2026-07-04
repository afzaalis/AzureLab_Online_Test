'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Tag, Library } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/books', label: 'Books', icon: BookOpen },
    { href: '/categories', label: 'Categories', icon: Tag },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__inner}>
        <Link href="/books" className={styles.navbar__brand}>
          <div className={styles.navbar__logo}>
            <Library size={20} strokeWidth={2} color="white" />
          </div>
          <span className={styles['navbar__brand-name']}>
            Book<span>Shelf</span>
          </span>
        </Link>

        <div className={styles.navbar__nav}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navbar__link} ${
                  pathname.startsWith(link.href) ? styles.active : ''
                }`}
              >
                <span className={styles['navbar__link-icon']}>
                  <Icon size={16} strokeWidth={2} />
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
