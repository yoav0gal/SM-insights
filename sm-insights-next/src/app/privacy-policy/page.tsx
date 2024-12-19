import LegalPage from "../components/LegalPage";

export default function PrivacyPolicy() {
  const content = (
    <>
      <p>
        This Privacy Policy describes Our policies and procedures on the
        collection, use and disclosure of Your information when You use the
        Service and tells You about Your privacy rights and how the law protects
        You.
      </p>
      <p>
        We use Your Personal data to provide and improve the Service. By using
        the Service, You agree to the collection and use of information in
        accordance with this Privacy Policy. This Privacy Policy has been
        created with the help of the
        <a
          href="https://www.freeprivacypolicy.com/free-privacy-policy-generator/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          Free Privacy Policy Generator
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
        Interpretation and Definitions
      </h2>
      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
        Interpretation
      </h3>
      <p>
        The words of which the initial letter is capitalized have meanings
        defined under the following conditions. The following definitions shall
        have the same meaning regardless of whether they appear in singular or
        in plural.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
        Definitions
      </h3>
      <p>For the purposes of this Privacy Policy:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Account</strong> means a unique account created for You to
          access our Service or parts of our Service.
        </li>
        <li>
          <strong>Affiliate</strong> means an entity that controls, is
          controlled by or is under common control with a party, where
          &quot;control&quot; means ownership of 50% or more of the shares,
          equity interest or other securities entitled to vote for election of
          directors or other managing authority.
        </li>
        <li>
          <strong>Company</strong> (referred to as either &quot;the
          Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in
          this Agreement) refers to AudieLens.
        </li>
        {/* Add more list items for other definitions */}
      </ul>

      {/* Add more sections here, following the same structure */}

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
        Contact Us
      </h2>
      <p>
        If you have any questions about this Privacy Policy, You can contact us:
      </p>
      <ul className="list-disc pl-5">
        <li>By email: yoav0gal@gmail.com</li>
      </ul>
    </>
  );

  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="December 19, 2024"
      content={content}
    />
  );
}
