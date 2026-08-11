import ExoreaderLegalLayout from "./LegalLayout";

export default function ExoreaderPrivacy() {
  return (
    <ExoreaderLegalLayout title="Privacy Policy" updated="August 2026">
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 not-prose dark:border-border dark:bg-card">
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-muted-foreground">
          <strong className="text-zinc-950 dark:text-foreground">In short:</strong> ExoReader is
          private by default. There are no ExoReader servers, no analytics, no ads, and no data
          sharing. Everything the app knows about you lives on your device or in your own Bluesky
          account.
        </p>
      </div>

      <h2>1. Overview</h2>
      <p>
        ExoReader is a calm, RSS-style reader for Bluesky, available on iOS, macOS, and Android. It
        is an independent, third-party application and is not affiliated with, endorsed by, or
        operated by Bluesky or the AT Protocol. This policy explains what information the app
        handles and how. In short: no servers, no analytics, no ads, and no data sharing.
      </p>

      <h2>2. Who we are</h2>
      <p>
        ExoReader is designed and developed by Cristiano Calicchia as an independent project.
        Because the app has no backend, there is no server operated by us that receives, stores, or
        processes your data. If you have any questions about this policy, you can reach us at{" "}
        <a href="mailto:cristiano@calicchia.dev">cristiano@calicchia.dev</a>.
      </p>

      <h2>3. Information the app handles</h2>
      <ul>
        <li>
          <strong>Login details.</strong> To connect to Bluesky you provide your handle and an app
          password. The app password is used only once to establish a session and is not retained
          afterwards; the resulting session is stored encrypted on your device.
        </li>
        <li>
          <strong>Reading state and preferences.</strong> Which posts you have read, items you have
          starred, and your in-app settings.
        </li>
        <li>
          <strong>Purchases.</strong> If you choose to leave a tip, the transaction is handled by
          your app store — we never see your payment details.
        </li>
      </ul>

      <h2>4. How your data is stored</h2>
      <p>
        All of the above is stored locally on your device, using the operating system's encrypted
        keystore where appropriate. There is no ExoReader account and no ExoReader server — nothing
        is uploaded to us.
      </p>

      <h2>5. What is synced, and where</h2>
      <p>
        So that your read and starred state can follow you, ExoReader can save it as a record inside
        your own Bluesky repository (your account's own data store). Please note that, by design,
        Bluesky repositories are public — anything written to your repo can be read by others.
        Local-only details such as tags and counts stay on your device and are never written to your
        repo.
      </p>

      <h2>6. Information we do NOT collect</h2>
      <p>
        We do not collect your name, email address, phone number, or contacts; we do not access your
        location; and we do not use analytics, advertising identifiers, or any form of cross-app or
        cross-site tracking.
      </p>

      <h2>7. Network and third parties</h2>
      <p>
        The app connects only to Bluesky / AT Protocol servers, over HTTPS, to do what you ask of
        it. It also communicates with your app store solely to process optional tips. ExoReader
        contains no analytics, advertising, or tracking SDKs.
      </p>

      <h2>8. Data sharing</h2>
      <p>
        None. We do not sell, rent, or share your personal data with anyone — there is no third
        party to share it with, because the app has no backend.
      </p>

      <h2>9. Data retention and deletion</h2>
      <p>
        Signing out or uninstalling the app clears the data stored locally on your device. The sync
        record kept in your own Bluesky account belongs to you and can be deleted by you at any time
        through your account. Because we hold nothing about you, there is nothing for us to delete on
        our side.
      </p>

      <h2>10. Security</h2>
      <p>
        Sensitive data such as your session is protected using your device's hardware-backed
        keystore (the Keychain on Apple platforms, the Android Keystore on Android). All network
        connections use HTTPS.
      </p>

      <h2>11. Children's privacy</h2>
      <p>
        ExoReader is not directed at children under the age of 13, and we do not knowingly collect
        any information from them.
      </p>

      <h2>12. Your rights</h2>
      <p>
        Depending on where you live, you may have rights over your personal data, such as those
        granted by the GDPR (access, rectification, erasure, portability, and more). Because your
        data lives on your own device and in your own Bluesky account, you can exercise these rights
        directly, without needing to contact us.
      </p>

      <h2>13. Changes to this policy</h2>
      <p>
        If this policy changes, we will update the "Last updated" date above and, where appropriate,
        provide notice in the app.
      </p>

      <h2>14. Contact</h2>
      <p>
        If you have any questions about this Privacy Policy, contact us at{" "}
        <a href="mailto:cristiano@calicchia.dev">cristiano@calicchia.dev</a>.
      </p>
    </ExoreaderLegalLayout>
  );
}
