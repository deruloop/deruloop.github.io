import CiappittiLegalLayout from "./CiappittiLegalLayout";

const CONTACT = "cristiano@calicchia.dev";
const APPLE_PCC = "https://security.apple.com/blog/private-cloud-compute/";

export default function CiappittiPrivacy() {
  return (
    <CiappittiLegalLayout
      pageTitle="Privacy Policy"
      title="Privacy Policy"
      intro={<p>Last updated: 6 November 2026</p>}
    >
      <p>
        Ciappitti is a chat assistant made by Cristiano Calicchia. This policy explains what happens
        to the information involved in using it. In short, Ciappitti collects nothing.
      </p>

      <h2>What Ciappitti collects</h2>
      <p>
        Nothing. The app has no account, no analytics, no advertising, no tracking and no server of
        its own. The developer never receives the chats or any information about the people who use
        the app.
      </p>

      <h2>Where chats are kept</h2>
      <p>
        Chats are saved on the device. When iCloud is available, they sync through the user's private
        iCloud database, which belongs to the user's Apple Account and which the developer cannot
        read. Deleting a chat in the app deletes it from iCloud too. iCloud is covered by Apple's
        privacy policy.
      </p>

      <h2>How answers are produced</h2>
      <p>Answers come from Apple's language models.</p>
      <ul>
        <li>
          The on-device model runs entirely on the device. Questions and answers do not leave the
          device.
        </li>
        <li>
          Private Cloud Compute runs on Apple's servers when the user picks it, or when the on-device
          model can't answer. Apple uses the data only to answer the request and does not store it.
          Apple describes how this works at <a href={APPLE_PCC}>security.apple.com</a>.
        </li>
      </ul>

      <h2>Preferences on the device</h2>
      <p>
        The app keeps a few settings on the device: the chosen app icon, whether the welcome screen
        was shown, and a random identifier for this installation. The identifier only tells this
        device's unfinished replies apart from those of the user's other devices. It never leaves the
        user's own iCloud database and identifies no person.
      </p>

      <h2>Children</h2>
      <p>Ciappitti collects no data from anyone, children included.</p>

      <h2>Changes</h2>
      <p>Any change to this policy will appear on this page with a new date.</p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <hr />

      <section id="italiano" lang="it" className="scroll-mt-8">
        <h2>Informativa sulla privacy</h2>
        <p>Ultimo aggiornamento: 6 novembre 2026</p>
        <p>
          Ciappitti è un assistente di chat realizzato da Cristiano Calicchia. Questa informativa
          spiega cosa succede alle informazioni coinvolte nell'uso dell'app. In breve, Ciappitti non
          raccoglie nulla.
        </p>

        <h2>Cosa raccoglie Ciappitti</h2>
        <p>
          Niente. L'app non ha account, analisi, pubblicità, tracciamento né un proprio server. Lo
          sviluppatore non riceve mai le chat né informazioni sulle persone che usano l'app.
        </p>

        <h2>Dove sono conservate le chat</h2>
        <p>
          Le chat sono salvate sul dispositivo. Quando iCloud è disponibile, si sincronizzano con il
          database iCloud privato dell'utente, che appartiene al suo Account Apple e che lo
          sviluppatore non può leggere. Eliminare una chat nell'app la elimina anche da iCloud. iCloud
          è regolato dall'informativa sulla privacy di Apple.
        </p>

        <h2>Come vengono prodotte le risposte</h2>
        <p>Le risposte arrivano dai modelli linguistici di Apple.</p>
        <ul>
          <li>
            Il modello sul dispositivo funziona interamente sul dispositivo. Domande e risposte non
            lasciano il dispositivo.
          </li>
          <li>
            Private Cloud Compute funziona sui server di Apple quando l'utente lo sceglie, o quando il
            modello sul dispositivo non può rispondere. Apple usa i dati solo per rispondere alla
            richiesta e non li conserva. Apple descrive il funzionamento su{" "}
            <a href={APPLE_PCC}>security.apple.com</a>.
          </li>
        </ul>

        <h2>Preferenze sul dispositivo</h2>
        <p>
          L'app conserva alcune impostazioni sul dispositivo: l'icona scelta, se la schermata di
          benvenuto è già stata mostrata e un identificativo casuale di questa installazione.
          L'identificativo serve solo a distinguere le risposte non terminate di questo dispositivo da
          quelle degli altri dispositivi dell'utente. Non lascia mai il database iCloud dell'utente e
          non identifica alcuna persona.
        </p>

        <h2>Minori</h2>
        <p>Ciappitti non raccoglie dati da nessuno, minori compresi.</p>

        <h2>Modifiche</h2>
        <p>Ogni modifica a questa informativa comparirà in questa pagina con una nuova data.</p>

        <h2>Contatti</h2>
        <p>
          Domande su questa informativa possono essere inviate a{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
      </section>
    </CiappittiLegalLayout>
  );
}
