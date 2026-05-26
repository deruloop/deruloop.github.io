import "../../styles/packd.css";
import packdLogo from "@/assets/packd.png?url";

export default function PackdPrivacy() {
  return (
    <div className="packd-page">
      <div className="privacyContainer">
        <img
          className="logo"
          src={packdLogo}
          alt="Packd Logo"
        />
        <h2 className="legalTitle">Privacy Policy</h2>
        <p><strong>Effective Date:</strong> 26/05/2026</p>
        <p><strong>Last Updated:</strong> 26/05/2026</p>
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

        <h4>1.3 AI Features (OpenAI Integration)</h4>
        <p>
          - Packd includes optional AI features such as packing recommendations and trip planning (for example:
          itinerary generation, stop suggestions, and “what can I do next?”). When you use these features, Packd
          uses OpenAI APIs to generate AI outputs.
        </p>
        <p>
          - Your prompts (and any context you choose to provide, such as destination, trip dates, preferences, items,
          or notes) are sent directly to OpenAI servers via a shared API key to generate the response.
        </p>
        <p>
          - Packd does not log or store the content of your prompts or the AI-generated responses on our servers.
          OpenAI handles these interactions in accordance with their{" "}
          <a href="https://openai.com/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>

        <h3>2. Data Sharing</h3>
        <p>
          Packd does not sell your data. Data is only shared with third parties when required to provide core
          functionality:
        </p>
        <p>- Apple iCloud (to store and sync your trips, inventory, and packing lists).</p>
        <p>- OpenAI (only when you use AI features, to generate AI outputs from your prompts).</p>

        <h3>3. Security</h3>
        <p>
          We rely on Apple and OpenAI’s established security protocols to protect your data. For details see the
          respective providers' policies.
        </p>

        <h3>4. User Rights</h3>
        <p>
          Your Packd data is stored in iCloud. You can delete your trips, inventory, and packing lists from within
          the app, and manage iCloud data via Apple settings. If you have questions about AI request processing,
          please refer to OpenAI’s privacy policy.
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
              <strong>Email:</strong>{" "}
              <a className="privacyEmailLink" href="mailto:cristiano@calicchia.dev">cristiano@calicchia.dev</a>
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
