import RavioloLegalLayout from "./RavioloLegalLayout";

export default function RavioloPrivacy() {
  return (
    <RavioloLegalLayout title="Privacy Policy" updated="August 2026">
      <div className="rounded-2xl border border-[color:var(--rv-border)] bg-[color:var(--rv-muted)] p-5 not-prose">
        <p className="text-sm leading-relaxed text-[color:var(--rv-ink)]/80">
          <strong className="text-[color:var(--rv-ink)]">In short:</strong> Raviolo keeps your data
          on your device by default. No account is required, there are no ads, and no analytics.
          When you use the AI features, the text of your prompt is sent to a third-party AI provider
          to generate a recipe — nothing else leaves your device.
        </p>
      </div>

      <h2>1. Overview</h2>
      <p>
        Raviolo is an AI-first meal companion for iPhone (with an Android version on the way). It is
        an independent app developed by Cristiano Calicchia and is currently in beta. This policy
        explains what information the app handles and how. In short: your content stays on your
        device, and the only data that leaves it is what you send to the AI to get a recipe.
      </p>

      <h2>2. Who we are</h2>
      <p>
        Raviolo is designed and developed by Cristiano Calicchia as an independent project. If you
        have any questions about this policy, you can reach us at{" "}
        <a href="mailto:cristiano@calicchia.dev">cristiano@calicchia.dev</a>.
      </p>

      <h2>3. Information the app handles</h2>
      <ul>
        <li>
          <strong>Your content.</strong> The shopping-list items, saved recipes, and notes you
          create in the app.
        </li>
        <li>
          <strong>AI prompts.</strong> When you use the Inspire / AI features, the text you provide
          (such as ingredients, a mood, or a cuisine) is sent to a third-party AI provider so it can
          generate a recipe for you.
        </li>
        <li>
          <strong>Purchases.</strong> If you subscribe once paid features launch, the transaction is
          handled by your app store — we never see your payment details.
        </li>
      </ul>

      <h2>4. How your data is stored</h2>
      <p>
        By default, your content is stored locally on your device. There is currently no Raviolo
        account and no Raviolo server that holds your data. Optional sign-in for syncing across
        devices is planned; if and when it arrives, this policy will be updated to describe it before
        it is enabled.
      </p>

      <h2>5. AI features</h2>
      <p>
        When you ask Raviolo for inspiration, your prompt is sent over an encrypted (HTTPS)
        connection to a third-party AI provider, which returns a generated recipe. The Inspire chat
        is ephemeral: it resets when you close the app, so nothing from that conversation is kept by
        Raviolo unless you choose to save the recipe. We do not use your prompts to build advertising
        profiles or to track you.
      </p>

      <h2>6. Information we do NOT collect</h2>
      <p>
        We do not collect your name, email address, phone number, or contacts; we do not access your
        location; and we do not use analytics, advertising identifiers, or any form of cross-app or
        cross-site tracking.
      </p>

      <h2>7. Network and third parties</h2>
      <p>
        The app connects to the AI provider (only when you use the AI features) and to your app store
        (only for purchases), always over HTTPS. Raviolo contains no analytics, advertising, or
        tracking SDKs.
      </p>

      <h2>8. Data sharing</h2>
      <p>
        We do not sell, rent, or share your personal data. The only information that leaves your
        device is the prompt content you send to the AI provider when you use the AI features, and
        that is used solely to generate your response.
      </p>

      <h2>9. Data retention and deletion</h2>
      <p>
        Your content stays on your device: you can delete individual items in the app, or remove
        everything by uninstalling it. AI prompts are processed to generate a response and are not
        stored by us.
      </p>

      <h2>10. Security</h2>
      <p>
        Your data is protected using your device's built-in protections, and all network connections
        use HTTPS.
      </p>

      <h2>11. Children's privacy</h2>
      <p>
        Raviolo is not directed at children under the age of 13, and we do not knowingly collect any
        information from them.
      </p>

      <h2>12. Your rights</h2>
      <p>
        Depending on where you live, you may have rights over your personal data, such as those
        granted by the GDPR (access, rectification, erasure, portability, and more). Because your
        data lives on your own device, you can exercise these rights directly, without needing to
        contact us.
      </p>

      <h2>13. Changes to this policy</h2>
      <p>
        Raviolo is evolving, and features such as accounts, sync, or paid tiers will require this
        policy to be revisited. If it changes, we will update the "Last updated" date above and,
        where appropriate, provide notice in the app.
      </p>

      <h2>14. Contact</h2>
      <p>
        If you have any questions about this Privacy Policy, contact us at{" "}
        <a href="mailto:cristiano@calicchia.dev">cristiano@calicchia.dev</a>.
      </p>
    </RavioloLegalLayout>
  );
}
