export function LogoDapurHPP({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-label="DapurHPP Logo">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="logo-title"
      >
        <title id="logo-title">DapurHPP Logo</title>
        <rect width="40" height="40" rx="12" fill="#FF8A00" />
        <path
          d="M20 8L28 18H12L20 8Z"
          fill="white"
        />
        <path
          d="M12 18V30C12 32.2091 13.7909 34 16 34H24C26.2091 34 28 32.2091 28 30V18H12Z"
          fill="white"
          opacity="0.9"
        />
        <rect x="16" y="22" width="8" height="8" rx="2" fill="#FF8A00" />
      </svg>
      <span className="ml-2 flex flex-col leading-none">
        <span className="font-[var(--font-playfair)] font-bold text-[#FF8A00] text-[1.25rem] leading-none">Dapur</span>
        <span className="font-[var(--font-playfair)] font-bold text-[#2A1711] text-[1.25rem] leading-none -mt-0.5">HPP</span>
      </span>
    </div>
  );
}