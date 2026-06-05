// frontend/components/PaymentIcons.jsx

export function CardIcons() {
  return (
    <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {/* Visa */}
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
        <rect width="32" height="20" rx="3" fill="#1A1F71"/>
        <text x="4" y="14" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="Arial">VISA</text>
      </svg>
      {/* Mastercard */}
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
        <rect width="28" height="20" rx="3" fill="#252525"/>
        <circle cx="11" cy="10" r="6" fill="#EB001B"/>
        <circle cx="17" cy="10" r="6" fill="#F79E1B"/>
        <path d="M14 5.3a6 6 0 0 1 0 9.4A6 6 0 0 1 14 5.3z" fill="#FF5F00"/>
      </svg>
      {/* Elo */}
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
        <rect width="28" height="20" rx="3" fill="#FFD700"/>
        <text x="4" y="14" fill="#000" fontSize="8" fontWeight="bold" fontFamily="Arial">elo</text>
      </svg>
    </span>
  )
}

export function PixIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 512 512" fill="none">
      <path d="M370 302l-88 88c-14 14-37 14-51 0l-88-88c-14-14-14-37 0-51l88-88c14-14 37-14 51 0l88 88c14 14 14 37 0 51z" fill="#32BCAD"/>
      <path d="M416 210l-44-44-88 88c-26 26-68 26-94 0l-88-88-44 44c-26 26-26 68 0 94l88 88c26 26 68 26 94 0l88-88 44-44" fill="#32BCAD" opacity=".6"/>
    </svg>
  )
}

export function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.11-1.34A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#25D366"/>
      <path d="M17.47 14.93c-.27-.13-1.58-.78-1.82-.87-.24-.09-.42-.13-.6.13-.18.27-.68.87-.84 1.05-.15.18-.31.2-.58.07-.27-.13-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.49-1.86-.15-.27-.02-.41.12-.54.12-.12.27-.31.4-.46.13-.15.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.44-.82-1.97-.22-.52-.44-.45-.6-.46H8.7c-.18 0-.47.07-.71.33-.24.27-.93.91-.93 2.21s.95 2.57 1.08 2.74c.13.18 1.87 2.85 4.52 4 .63.27 1.12.43 1.5.55.63.2 1.2.17 1.65.1.5-.07 1.55-.63 1.77-1.24.22-.61.22-1.13.15-1.24-.06-.1-.24-.16-.5-.29z" fill="#fff"/>
    </svg>
  )
}