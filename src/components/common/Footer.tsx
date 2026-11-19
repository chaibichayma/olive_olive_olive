
interface FooterProps {
  companyName?: string;
  links?: {
    label: string;
    href: string;
  }[];
}

const defaultLinks = [
  { label: "À propos", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
];

export default function Footer({
  companyName = "UTSS",
  links = defaultLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#E8EDE4] ">
      <div className="flex min-h-[42px] flex-col items-center justify-between gap-2 px-5 py-2 sm:flex-row sm:px-7">

        {/* Copyright */}
        <p className="text-[13px] font-semibold text-[#89948C]">
          © {currentYear} {companyName}
        </p>

        {/* Navigation */}
        <nav aria-label="Navigation du pied de page">
          <ul className="flex items-center gap-3 sm:gap-4">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="
                    text-[13px] font-semibold text-[#89948C]
                    transition-colors duration-200
                    hover:text-[#556B2F]
                  "
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </div>
    </footer>
  );
}
