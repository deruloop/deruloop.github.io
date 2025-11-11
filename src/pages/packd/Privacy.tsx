import "../../styles/packd.css";

export default function PackdPrivacy() {
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
        <h2 style={{ textAlign: "center", paddingTop: "15px" }}>Privacy Policy</h2>
        <p><strong>Effective Date:</strong> 20/12/2024</p>
        <p><strong>Last Updated:</strong> 20/12/2024</p>
        <p>
          Thank you for using <strong>Packd</strong>! This privacy policy explains how your data is
          handled when using our app. We prioritize your privacy and aim to ensure transparency in how your
          information is processed.
        </p>

        <h3>1. Data Collection and Usage</h3>
        <p>
          Packd does not collect or store your personal information on our servers. All personal data is
          securely managed through <strong>Apple’s iCloud</strong> or handled locally on your device.
        </p>

        <h4>1.1 Packing Lists and Trip Data</h4>
        <p>- All your packing lists, trip information, and customizations are stored in iCloud.</p>
        <p>
          - We do not have direct access to this data, as it is managed entirely by Apple’s iCloud services,
          which comply with their <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>

        <h4>1.2 Location Information</h4>
        <p>- Packd does not access or store your location data.</p>
        <p>
          - Weather updates and map instructions are based on generic map pin addresses manually provided by you.
          These addresses are not linked to any geolocation services and are not stored or shared by Packd.
        </p>

        <h4>1.3 Interaction with OpenAI (ChatGPT Integration)</h4>
        <p>
          - For features such as AI-powered packing recommendations, Packd uses OpenAI APIs. Your prompts and
          responses are sent directly to OpenAI servers via a shared API key.
        </p>
        <p>
          - Packd does not log or access the content of your prompts or the AI-generated responses. OpenAI handles
          these interactions in accordance with their <a href="https://openai.com/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>

        <h3>2. Data Sharing</h3>
        <p>We do not share your personal data with any third parties.</p>

        <h3>3. Security</h3>
        <p>
          We rely on Apple and OpenAI’s established security protocols to protect your data. For details see the
          respective providers' policies.
        </p>

        <h3>4. User Rights</h3>
        <p>
          As your data is not stored or processed by Packd, any requests regarding data access or deletion must be
          directed to the relevant service provider.
        </p>

        <h3>5. Cookies and Tracking Technologies</h3>
        <p>Packd does not use cookies or tracking technologies.</p>

        <h3>6. Children’s Privacy</h3>
        <p>Packd is not intended for users under 13. We do not knowingly collect or process any data from children.</p>

        <h3>7. Changes to This Privacy Policy</h3>
        <p>This Privacy Policy may be updated from time to time. Any significant changes will be communicated through the app.</p>

        <h3>8. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, feel free to contact us:</p>
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
