'use client';
import Image from 'next/image';
import styles from './Lm.module.css';

const logos = [
  '/Netflix.svg',
  '/Instagram.svg',
  '/Uber.svg',
  '/Spotify.svg',
  '/Google.svg',
  '/Microsoft.svg',
  '/Amazon.svg',
];

export default function LogoMarquee() {
  return (
    <div className={styles.logoSection}>
      <h2 className='pb-4 font-semibold '>TRUSTED BY LEADING TEAMS</h2>
      <div className={styles.logoCarousel}>
        <div className={styles.logoTrack}>
          {[...logos, ...logos].map((src, i) => (
            <Image
              key={i}
              src={src}
              alt="Company Logo"
              width={100}
              height={40}
              className={styles.logoImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
