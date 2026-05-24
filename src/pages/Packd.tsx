import "../styles/packd.css";
import packd from "@/assets/packd.png?url";
import mockup from "@/assets/mockup.png?url";
import appstore from "@/assets/appstorebadge.svg?url";

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
          src={mockup}
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
            className="product-hunt-badge"
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
              src={appstore}
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
              <div className="emoji">🗺️</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Trips workspace</h3>
              <p className="feature-subtitle">
                Plan days on a timeline, check trip intelligence in Overview, keep an inbox in Vault, and execute packing in one place.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">📍</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Current Trip dashboard</h3>
              <p className="feature-subtitle">
                When a trip is active, Packd boots into a glanceable view with your context, progress through days, and what’s up next.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">✨</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Plan with AI</h3>
              <p className="feature-subtitle">
                Generate a complete multi-day itinerary from a destination, then refine results using your personal preferences.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">⏰</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">What can I do next?</h3>
              <p className="feature-subtitle">
                A smart assistant for today: based on your plan and the current time, it proposes a realistic next stop that fits your gap.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🧳</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Inventory & packing list</h3>
              <p className="feature-subtitle">
                A curated list built from real travel experience, fully editable and filterable so you can find the right items fast.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">📎</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Documents & images</h3>
              <p className="feature-subtitle">
                Attach tickets, PDFs, confirmations, and screenshots to trip stops, or collect them in Vault and assign them later.
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
                Use AI to plan trips, draft day itineraries, refine results with your preferences, and generate packing suggestions from trip context.
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
              <h3 className="feature-title">Speaking your language</h3>
              <p className="feature-subtitle">
                The app is fully localized in more than 20 languages, including the default packing list I provided
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
              <p className="feature-subtitle">Get info about the weather conditions on the days you are going.</p>
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
                To warn you about unpacked items and weather updates on incoming trips.
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
                Read reviews of travel gear I’ve personally tried and liked, and add them directly to your packing list.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🔑</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Bring your own AI key</h3>
              <p className="feature-subtitle">
                Use Packd with your personal tokens from popular AI providers, keeping AI accessible without forcing a subscription.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">📱</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">On-device AI</h3>
              <p className="feature-subtitle">
                Support for on-device models (when available), including Apple Intelligence Foundation models on supported devices.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🤝</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Share trips</h3>
              <p className="feature-subtitle">
                A social layer to exchange organized trips, curated packing lists, and ideas between travelers and professionals.
              </p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">💻</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">macOS native</h3>
              <p className="feature-subtitle">An improved macOS experience, including better windowing and icon customization.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🖼️</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">More icons</h3>
              <p className="feature-subtitle">New icons to customize your experience.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <div className="emoji">🧠</div>
            </div>
            <div className="feature-text">
              <h3 className="feature-title">Even more AI features</h3>
              <p className="feature-subtitle">
                Packd’s AI layer is expanding: smarter planning flows, better trip context, and new assistants that help before and during travel.
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
          <a href="/packd/privacy">Privacy Policy</a> | <a href="/packd/terms">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
