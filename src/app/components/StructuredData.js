export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Nexus Learn",
    "url": "https://www.nexuslearn.app",
    "logo": "https://www.nexuslearn.app/Logo.png",
    "description": "Master O Levels, IGCSE, A Levels, and SAT with Nexus Learn. Access past papers, track your progress, and achieve academic excellence.",
    "sameAs": [
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.nexuslearn.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "areaServed": "Worldwide",
    "educationalCredentialAwarded": [
      "O Level",
      "A Level",
      "IGCSE",
      "SAT"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
