import LegalPage from '../components/LegalPage'

export default function TermsAndConditions() {
  const content = (
    <>
      <p>Please read these terms and conditions carefully before using Our Service.</p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Interpretation and Definitions</h2>
      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Interpretation</h3>
      <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Definitions</h3>
      <p>For the purposes of these Terms and Conditions:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <p><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p>
        </li>
        <li>
          <p><strong>Country</strong> refers to: Israel</p>
        </li>
        <li>
          <p><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to AudieLens.</p>
        </li>
        <li>
          <p><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</p>
        </li>
        <li>
          <p><strong>Service</strong> refers to the Website.</p>
        </li>
        <li>
          <p><strong>Terms and Conditions</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service. This Terms and Conditions agreement has been created with the help of the <a href="https://www.freeprivacypolicy.com/free-terms-and-conditions-generator/" target="_blank" className="text-blue-600 hover:text-blue-800">Free Terms and Conditions Generator</a>.</p>
        </li>
        <li>
          <p><strong>Third-party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</p>
        </li>
        <li>
          <p><strong>Website</strong> refers to AudieLens, accessible from <a href="https://smfront-yoav0gals-projects.vercel.app" rel="external nofollow noopener" target="_blank" className="text-blue-600 hover:text-blue-800">https://smfront-yoav0gals-projects.vercel.app</a></p>
        </li>
        <li>
          <p><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Acknowledgment</h2>
      <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
      <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
      <p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
      <p>You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.</p>
      <p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p>

      {/* Add more sections here, following the same structure */}

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Us</h2>
      <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
      <ul className="list-disc pl-5">
        <li>By email: yoav0gal@gmail.com</li>
      </ul>
    </>
  )

  return (
    <LegalPage
      title="Terms and Conditions"
      lastUpdated="December 19, 2024"
      content={content}
    />
  )
}

