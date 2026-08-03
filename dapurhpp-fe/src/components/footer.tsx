export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-[#FFF8F6] border-t border-[#DDC1AE] mt-auto">
      <div className="mx-auto max-w-[1200px] px-6 py-6">
        <p className="text-center text-sm font-[var(--font-be-vietnam)] text-[#8A7362]">
          &copy; {currentYear} DapurHPP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}