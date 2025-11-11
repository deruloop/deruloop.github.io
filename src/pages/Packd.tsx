import "../styles/packd.css";
import packd from "@/assets/packd.png";

export default function Packd() {
  return (
    <div className="packd-page">
      <div className="container">
        <img
          className="logo"
          src={packd}
          alt="Packd Logo"
        />
        <div className="title">Packd</div>
        <div className="subtitle">
          Trip organizer, packing list manager<br />
          and more!
        </div>
        <img
          className="mockup"
          src="https://deruloop.github.io/images/mockup.png"
          alt="Packd Mockup"
        />
        <a
          href="https://www.producthunt.com/posts/packd?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-packd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=684500&theme=light"
            alt="Packd - Trip organizer, packing list manager and more! | Product Hunt"
            style={{ width: "150px", height: "54px" }}
            width={150}
            height={54}
          />
        </a>
        <div className="info">
          <a
            href="https://apps.apple.com/it/app/packd/id6593688485"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://deruloop.github.io/images/appstorebadge.svg"
              alt="Download on the App Store"
              className="app-store-badge"
            />
          </a>
          <br />
          Available for iOS, iPadOS, macOS and VisionOS
        </div>
        <br />
        <h3>Features</h3>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🧳</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Packing list</h3>
              <p className="feature-subtitle">
                A curated packing list already made by me based on my travel experience, that you can edit however you want
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">📍</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Placemarks</h3>
              <p className="feature-subtitle">
                Add points of interest to your trip so you can automatically get map instructions on how to get there
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">👓</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">VisionOS support</h3>
              <p className="feature-subtitle">
                View your list in augmented reality while you are packing, to make sure you don't forget anything
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🤖</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">ChatGPT Integration</h3>
              <p className="feature-subtitle">
                Let the power of AI automatically decide what you should bring based on where you are going, in which period, how much are you staying and weather conditions
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">☁️</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">iCloud integration</h3>
              <p className="feature-subtitle">
                Your lists and trips are safely stored inside iCloud and available on any supported device the moment you download the app
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🎨</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Add your touch</h3>
              <p className="feature-subtitle">Choose the icon you want from a growing gallery of icons made by me</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🌍</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Speaking your languange</h3>
              <p className="feature-subtitle">
                The app is fully localized in more than 20 languages, including the default packing list i provided
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">♿</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Accessibility</h3>
              <p className="feature-subtitle">
                The app accessibility has been enhanced to ensure everyone can use it to its full potential
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">☔</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Bring an umbrella</h3>
              <p className="feature-subtitle">Get infos about the weather conditions on the days you are going.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🔌</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Need to charge?</h3>
              <p className="feature-subtitle">Know which travel adapter you should bring with you for your trip.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🔔</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Notifications</h3>
              <p className="feature-subtitle">
                To warn you about unpacked item and weather updates on incoming trips.
              </p>
            </div>
          </div>
        </div>
        <br />
        <br />
        <h3>Upcoming Features</h3>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">⭐</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Reviews</h3>
              <p className="feature-subtitle">
                Read reviews of cool products i've personally tried and liked, adding them directly to your packing list
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">📄</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Documents</h3>
              <p className="feature-subtitle">
                Attach documents to your trip such as reservations, tickets or ids, personally stored and safely encrypted in iCloud
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">💻</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">MacOS native</h3>
              <p className="feature-subtitle">Improved macos version with chance to change the icon</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🖼️</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">More icons</h3>
              <p className="feature-subtitle">New icons to customize your experience</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🧠</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">More AI features</h3>
              <p className="feature-subtitle">
                Use AI to add items to your inventory given a specific category, get infos for your trip and more
              </p>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />

      <footer>
        <p>© 2024 Packd. All rights reserved.</p>
        <p>
          <a href="/packd/privacy/">Privacy Policy</a> | <a href="/packd/terms/">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
