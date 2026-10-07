export const COUPLE_AVATARS = [
  {
    id: "sunset",
    name: "Sunset Romance",
    creatorSvg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="url(#sunset1)" />
        <circle cx="50" cy="38" r="20" fill="#fff" opacity="0.9" />
        <path d="M20 88C20 68 34 56 50 56C66 56 80 68 80 88" fill="#fff" opacity="0.9" />
        <defs>
          <linearGradient id="sunset1" x1="0" y1="0" x2="100" y2="100">
            <stop stopColor="#ff4f81" />
            <stop offset="1" stopColor="#ffd166" />
          </linearGradient>
        </defs>
      </svg>
    ),
    partnerSvg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="url(#sunset2)" />
        <circle cx="50" cy="38" r="20" fill="#fff" opacity="0.95" />
        <path d="M20 88C20 68 34 56 50 56C66 56 80 68 80 88" fill="#fff" opacity="0.95" />
        <defs>
          <linearGradient id="sunset2" x1="0" y1="0" x2="100" y2="100">
            <stop stopColor="#c9184a" />
            <stop offset="1" stopColor="#ff8fab" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "starry",
    name: "Starry Lovers",
    creatorSvg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="url(#starry1)" />
        <circle cx="50" cy="36" r="18" fill="#fff" />
        <path d="M22 86C22 66 35 54 50 54C65 54 78 66 78 86" fill="#fff" />
        <circle cx="25" cy="25" r="3" fill="#ffd166" />
        <circle cx="78" cy="30" r="2.5" fill="#ffd166" />
        <defs>
          <linearGradient id="starry1" x1="0" y1="0" x2="100" y2="100">
            <stop stopColor="#4a2a7a" />
            <stop offset="1" stopColor="#ff4f81" />
          </linearGradient>
        </defs>
      </svg>
    ),
    partnerSvg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="url(#starry2)" />
        <circle cx="50" cy="36" r="18" fill="#fff" />
        <path d="M22 86C22 66 35 54 50 54C65 54 78 66 78 86" fill="#fff" />
        <circle cx="75" cy="22" r="3.5" fill="#ffd166" />
        <circle cx="20" cy="35" r="2" fill="#ffd166" />
        <defs>
          <linearGradient id="starry2" x1="0" y1="0" x2="100" y2="100">
            <stop stopColor="#7a1f4a" />
            <stop offset="1" stopColor="#f4c16e" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: "royal",
    name: "Golden Hearts",
    creatorSvg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="url(#royal1)" />
        <path d="M50 25L54 36H65L56 43L59 55L50 48L41 55L44 43L35 36H46L50 25Z" fill="#fff" />
        <path d="M25 85C25 70 36 60 50 60C64 60 75 70 75 85" fill="#fff" opacity="0.9" />
        <defs>
          <linearGradient id="royal1" x1="0" y1="0" x2="100" y2="100">
            <stop stopColor="#f4c16e" />
            <stop offset="1" stopColor="#c9184a" />
          </linearGradient>
        </defs>
      </svg>
    ),
    partnerSvg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="url(#royal2)" />
        <path d="M50 25C50 25 35 15 28 25C21 35 30 45 50 60C70 45 79 35 72 25C65 15 50 25 50 25Z" fill="#fff" opacity="0.9" />
        <defs>
          <linearGradient id="royal2" x1="0" y1="0" x2="100" y2="100">
            <stop stopColor="#ff7b54" />
            <stop offset="1" stopColor="#ff4f81" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];
