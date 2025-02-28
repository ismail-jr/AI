const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-left">
        {/* Column 1: Branding */}
        <div>
          <h2 className="text-2xl font-semibold">Career Guide AI</h2>
          <p className="text-gray-400">Your AI-powered career mentor</p>
        </div>

        {/* Column 2: Contact Details */}
        <div className="space-y-2">
          <p>📍 Location: Kumasi, Ghana</p>
          <p>
            📞 Contact:{" "}
            <a href="tel:+233599329539" className="hover:underline">
              +233 599 329 539
            </a>
          </p>
          <p>
            ✉ Email:{" "}
            <a
              href="mailto:support@careerguido.com"
              className="hover:underline"
            >
              support@careerguido.com
            </a>
          </p>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="text-center text-gray-500 mt-6">
        © 2025 Career Guido AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
