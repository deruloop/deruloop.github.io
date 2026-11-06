import CiappittiLegalLayout from "./CiappittiLegalLayout";

const CONTACT = "cristiano@calicchia.dev";

export default function CiappittiSupport() {
  return (
    <CiappittiLegalLayout
      pageTitle="Support"
      title="Support"
      intro={
        <p>
          Ciappitti is made by Cristiano Calicchia. Questions, problems and ideas are all welcome at{" "}
          <a
            href={`mailto:${CONTACT}`}
            className="text-[color:var(--ciappitti-accent)] underline underline-offset-2"
          >
            {CONTACT}
          </a>
          .
        </p>
      }
    >
      <h2>The app says no model is available</h2>
      <p>
        Ciappitti needs an iPhone or iPad on iOS 27 with Apple Intelligence turned on. The setting is
        in Settings &gt; Apple Intelligence &amp; Siri.
      </p>

      <h2>Private Cloud Compute doesn't answer</h2>
      <p>
        Private Cloud Compute needs an internet connection and has a daily limit set by Apple. When
        it can't answer, the on-device model does, and the chat says why.
      </p>

      <h2>Chats don't appear on another device</h2>
      <p>
        Chats sync through iCloud, so both devices need to use the same iCloud account. The app's
        Settings show the current iCloud status.
      </p>

      <h2>Changing the language</h2>
      <p>
        Ciappitti speaks English, Italian, Spanish, German and French. It follows the system language
        unless another one is picked in the app's Settings.
      </p>

      <h2>Deleting chats</h2>
      <p>
        Deleting a chat from the chat list also deletes it from iCloud. The{" "}
        <a href="/ciappitti/privacy">privacy policy</a> explains where chats are kept.
      </p>

      <hr />

      <section id="italiano" lang="it" className="scroll-mt-8">
        <h2>Supporto</h2>
        <p>
          Ciappitti è realizzato da Cristiano Calicchia. Domande, problemi e idee sono tutti benvenuti
          a <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>

        <h2>L'app dice che nessun modello è disponibile</h2>
        <p>
          Ciappitti richiede un iPhone o iPad con iOS 27 e Apple Intelligence attivo. L'opzione si
          trova in Impostazioni &gt; Apple Intelligence e Siri.
        </p>

        <h2>Private Cloud Compute non risponde</h2>
        <p>
          Private Cloud Compute richiede una connessione a internet e ha un limite giornaliero
          stabilito da Apple. Quando non può rispondere, risponde il modello sul dispositivo e la chat
          spiega il motivo.
        </p>

        <h2>Le chat non compaiono su un altro dispositivo</h2>
        <p>
          Le chat si sincronizzano con iCloud, quindi i due dispositivi devono usare lo stesso account
          iCloud. Le Impostazioni dell'app mostrano lo stato di iCloud.
        </p>

        <h2>Cambiare la lingua</h2>
        <p>
          Ciappitti parla italiano, inglese, spagnolo, tedesco e francese. Segue la lingua del sistema,
          a meno che non ne venga scelta un'altra nelle Impostazioni dell'app.
        </p>

        <h2>Eliminare le chat</h2>
        <p>
          Eliminare una chat dall'elenco la elimina anche da iCloud. L'
          <a href="/ciappitti/privacy#italiano">informativa sulla privacy</a> spiega dove sono
          conservate le chat.
        </p>
      </section>
    </CiappittiLegalLayout>
  );
}
