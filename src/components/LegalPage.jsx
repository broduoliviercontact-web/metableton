const legalContent = {
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    updated: "Last updated: April 24, 2026",
    intro:
      "These Terms of Service govern your access to and use of METABLETON, a music technology platform for artists, creators and music professionals.",
    sections: [
      {
        title: "1. Acceptance of Terms",
        text:
          "By accessing or using METABLETON, you agree to these Terms of Service. If you do not agree, you should not use the service.",
      },
      {
        title: "2. About METABLETON",
        text:
          "METABLETON provides music-related tools, editorial resources, artist workflows and platform features that may help creators manage content, analyze performance and develop music promotion strategies.",
      },
      {
        title: "3. Accounts and Third-Party Connections",
        text:
          "Some features may allow users to connect third-party accounts, including TikTok, through secure authorization flows. You are responsible for maintaining access to your own accounts and for complying with the terms of any connected platform.",
      },
      {
        title: "4. User Content",
        text:
          "You remain responsible for any content, data, music, images, videos or materials you submit or connect to METABLETON. You must have the necessary rights and permissions for any content you use with the service.",
      },
      {
        title: "5. Acceptable Use",
        text:
          "You agree not to use METABLETON for unlawful activity, spam, unauthorized data collection, platform manipulation, infringement, abuse, or any activity that violates third-party platform policies.",
      },
      {
        title: "6. Intellectual Property",
        text:
          "METABLETON, its branding, interface, design and original content are protected by intellectual property laws. Third-party names, logos and services remain the property of their respective owners.",
      },
      {
        title: "7. No Guarantee of Results",
        text:
          "METABLETON may provide insights, tools or recommendations, but we do not guarantee audience growth, campaign results, revenue, platform approval or specific performance outcomes.",
      },
      {
        title: "8. Limitation of Liability",
        text:
          "To the maximum extent permitted by law, METABLETON is provided on an as-is and as-available basis. We are not liable for indirect, incidental, consequential or punitive damages arising from use of the service.",
      },
      {
        title: "9. Changes to the Service",
        text:
          "We may update, modify, suspend or discontinue parts of METABLETON at any time. We may also update these Terms when necessary.",
      },
      {
        title: "10. Contact",
        text:
          "For questions about these Terms, contact: broduoliviercontact@gmail.com",
      },
    ],
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    updated: "Last updated: April 24, 2026",
    intro:
      "This Privacy Policy explains how METABLETON collects, uses and protects information when you use our website, tools and connected account features.",
    sections: [
      {
        title: "1. Information We Collect",
        text:
          "We may collect basic account information, contact information you provide, website usage data, technical data such as browser and device information, and information made available through authorized third-party connections.",
      },
      {
        title: "2. TikTok Data",
        text:
          "If you choose to connect your TikTok account, METABLETON may request access to authorized TikTok data such as public profile information, account statistics and public video information, depending on the permissions you approve. We only access this data after your authorization.",
      },
      {
        title: "3. How We Use Information",
        text:
          "We use information to provide and improve METABLETON, personalize dashboards, display account and content performance, support music promotion workflows, maintain security and communicate with users when necessary.",
      },
      {
        title: "4. Data Sharing",
        text:
          "We do not sell personal data. We may share limited data with service providers needed to operate the website or application, comply with legal obligations, protect rights and security, or with your consent.",
      },
      {
        title: "5. Cookies and Analytics",
        text:
          "METABLETON may use cookies or similar technologies for essential functionality, analytics and performance improvement. You can manage cookie preferences through your browser settings.",
      },
      {
        title: "6. Data Retention",
        text:
          "We keep information only as long as reasonably necessary for the purposes described in this Policy, unless a longer retention period is required by law or needed for legitimate security or operational reasons.",
      },
      {
        title: "7. Your Rights",
        text:
          "Depending on your location, you may have rights to access, correct, delete, restrict or object to certain processing of your personal data. You may also disconnect third-party accounts from METABLETON where supported.",
      },
      {
        title: "8. Security",
        text:
          "We use reasonable technical and organizational measures to protect information. However, no internet service can guarantee absolute security.",
      },
      {
        title: "9. International Users",
        text:
          "METABLETON may be accessed from different countries. By using the service, you understand that information may be processed where our infrastructure or service providers operate.",
      },
      {
        title: "10. Contact",
        text:
          "For privacy questions or data requests, contact: broduoliviercontact@gmail.com",
      },
    ],
  },
};

function LegalPage({ type }) {
  const page = legalContent[type] ?? legalContent.privacy;

  return (
    <section className="mx-auto flex w-full max-w-[960px] flex-col gap-8 lg:gap-10" aria-labelledby="legal-page-title">
      <header className="border-b border-[color:var(--border-soft)] pb-6 lg:pb-8">
        <div className="max-w-[760px] space-y-3">
          <p className="text-2xs font-medium uppercase tracking-caps-wider text-[var(--text-muted)]">
            {page.eyebrow}
          </p>
          <h1
            className="font-[var(--font-display)] text-display-sm leading-[0.98] tracking-display-md text-[var(--text-primary)] sm:text-display lg:text-display-lg"
            id="legal-page-title"
          >
            {page.title}
          </h1>
          <p className="text-sm font-medium uppercase tracking-caps text-[var(--text-muted)]">
            {page.updated}
          </p>
          <p className="max-w-[680px] text-body leading-[1.8] text-[var(--text-secondary)] sm:text-base">
            {page.intro}
          </p>
        </div>
      </header>

      <div className="border-y border-[color:var(--border-soft)]">
        {page.sections.map((section) => (
          <article
            className="grid gap-3 border-b border-[color:var(--border-soft)] px-0 py-5 last:border-b-0 sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)] sm:gap-6 sm:py-6"
            key={section.title}
          >
            <h2 className="text-body font-medium tracking-display-2xs text-[var(--text-primary)] sm:text-[18px]">
              {section.title}
            </h2>
            <p className="max-w-[620px] text-body leading-[1.8] text-[var(--text-secondary)] sm:text-base">
              {section.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LegalPage;
