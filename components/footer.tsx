import { MapPin, Phone, Mail, Copyright } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-secondary)] text-[var(--text-primary)] py-12 px-4 border-t border-[var(--border-light)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
        {/* Brand Column */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Career Guide AI
          </h2>
          <p className="text-[var(--text-secondary)]">
            Your AI-powered career mentor
          </p>
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Get in Touch
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-3 text-[var(--text-secondary)] group">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
              </div>
              <span>Kumasi, Ghana</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 text-[var(--text-secondary)] group">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-4 h-4 text-[var(--accent-primary)]" />
              </div>
              <a
                href="tel:+233599329539"
                className="hover:text-[var(--accent-primary)] transition-colors"
              >
                +233 599 329 539
              </a>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 text-[var(--text-secondary)] group">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4 text-[var(--accent-primary)]" />
              </div>
              <a
                href="mailto:support@careerguido.com"
                className="hover:text-[var(--accent-primary)] transition-colors"
              >
                support@careerguido.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 text-center mt-12 pt-6 border-t border-[var(--border-light)]">
        <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
          <Copyright className="w-4 h-4" />
          <p className="text-sm">
            {currentYear} Guido AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
