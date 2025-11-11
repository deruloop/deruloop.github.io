import "../../styles/packd.css";

export default function PackdTerms() {
  const sendEmail = () => {
    window.location.href = "mailto:cristiano@calicchia.dev";
  };

  return (
    <div className="packd-page">
      <div className="privacyContainer">
        <img
          className="logo"
          src="https://deruloop.github.io/images/packd.png"
          alt="Packd Logo"
        />
        <h2 style={{ textAlign: "center", paddingTop: "15px" }}>Terms of service</h2>
        <p><strong>Effective Date:</strong> 20/12/2024</p>
        <p><strong>Last Updated:</strong> 20/12/2024</p>
        <p>
          Welcome to <strong>Packd</strong>. By using our app, you agree to the following terms and conditions.
          Please read them carefully.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>By downloading, accessing, or using Packd, you agree to be bound by these Terms of Service. If you do not
          agree, please do not use our app.
        </p>

        <h2>2. Description of Service</h2>
        <p>Packd is a trip organizer and packing list manager designed to help users plan and manage their travels
          effectively. The app offers features such as:</p>
        <ul>
          <li>Customizable packing lists.</li>
          <li>Map-based points of interest (placemarks).</li>
          <li>Augmented reality features via VisionOS.</li>
          <li>AI-powered suggestions using OpenAI.</li>
          <li>Weather insights based on user-provided locations.</li>
          <li>iCloud integration for secure data storage and synchronization.</li>
        </ul>

        <h2>3. User Responsibilities</h2>
        <p>As a user of Packd, you agree to the following:</p>
        <ul>
          <li>You are responsible for the accuracy of the information you provide (e.g., map pins, trip details).</li>
          <li>You will not use Packd for any unlawful or prohibited activities.</li>
          <li>You are solely responsible for managing your Apple iCloud account for data storage and
            synchronization.</li>
        </ul>

        <h2>4. Privacy and Data</h2>
        <p>
          Our Privacy Policy explains how your data is handled when using Packd. By using the app, you consent to
          the data practices described in the <a href="/packd/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>

        <h1>5. Use of OpenAI</h1>
        <p>
          Packd integrates OpenAI's APIs for AI-powered suggestions. Prompts and responses are processed directly
          by OpenAI. Packd does not log or store these interactions, and they are handled in accordance with
          OpenAI's <a href="https://openai.com/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>All content, features, and functionality provided by Packd, including but not limited to text, graphics,
          logos, and software, are the intellectual property of Packd or its licensors. You may not use, copy, or
          distribute this content without explicit permission.
        </p>

        <h2>7. Disclaimer of Warranties</h2>
        <p>Packd is provided "as is" and "as available." We make no warranties or representations, either express or
          implied, regarding the app's operation, reliability, or fitness for a particular purpose.</p>

        <h2>8. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Packd is not liable for any direct, indirect, incidental, or
          consequential damages resulting from the use or inability to use the app, including but not limited to
          data loss, device damage, or missed travel plans.</p>

        <h2>9. Modifications to Terms</h2>
        <p>We reserve the right to modify these Terms of Service at any time. If changes are made, we will update
          the effective date and notify you of significant updates.</p>

        <h2>10. Termination</h2>
        <p>We reserve the right to terminate or restrict your access to Packd at our discretion, without notice, for
          conduct that violates these terms or is otherwise harmful to other users, third parties, or the app
          itself.</p>

        <h2>11. Governing Law</h2>
        <p>These Terms of Service are governed by and construed in accordance with the laws of the European Union. Any disputes arising from these terms will be resolved in the courts of European Union.</p>

        <h2>12. Contact Information</h2>
        <p>If you have any questions about these Terms of Service, you can contact us:</p>
        <ul>
          <li>
            <div className="privacyEmail">
              <strong>Email:</strong> <button onClick={sendEmail}>cristiano@calicchia.dev</button>
            </div>
          </li>
        </ul>

        <p style={{ marginTop: 20 }}>
          <a href="/packd">← Back to Packd</a>
        </p>
      </div>
    </div>
  );
}
