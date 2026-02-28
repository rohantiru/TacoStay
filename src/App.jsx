import { useState, useEffect, useRef } from "react";

const SCREENS = {
  SPLASH: "splash",
  SIGNUP: "signup",
  PET_PROFILE: "pet_profile",
  HOME: "home",
  SITTER_DETAIL: "sitter_detail",
  BOOKING: "booking",
  BOOKING_CONFIRM: "booking_confirm",
  ORIENTATION: "orientation",
  PULSE: "pulse",
  RATING: "rating",
};

// --- Design Tokens ---
const T = {
  purple: "#6C3FC5",
  purpleLight: "#8B6AD9",
  purpleDark: "#4A2A8A",
  purpleFaint: "#F3EEFF",
  purpleGlow: "#DBC8FF",
  warm: "#FF8F5C",
  warmLight: "#FFDCC8",
  warmDark: "#E86F3A",
  cream: "#FFF9F4",
  bg: "#FAFAFE",
  card: "#FFFFFF",
  text: "#1E1633",
  textSoft: "#6B6580",
  textMuted: "#A09AAE",
  border: "#EDE8F5",
  success: "#34C77B",
  danger: "#FF5A5A",
  gold: "#FFB830",
};

// --- Mock Data ---
const MOCK_SITTERS = [
  {
    id: 1,
    name: "Priya Menon",
    tier: "Elite",
    badge: "🏅",
    rating: 4.9,
    reviews: 47,
    distance: "1.2 km",
    photo: "🧑‍⚕️",
    empathyScore: 94,
    bio: "Veterinarian with 6 years of experience. Specializes in anxious dogs and senior pets.",
    social: { linkedin: true, facebook: true },
    tags: ["Vet Certified", "Senior Pet Expert", "First Aid"],
    price: 1600,
    completedGigs: 47,
    videoIntro: true,
    bgvVerified: true,
  },
  {
    id: 2,
    name: "Arjun Kapoor",
    tier: "Classic",
    badge: "⭐",
    rating: 4.7,
    reviews: 23,
    distance: "2.8 km",
    photo: "🧑",
    empathyScore: 88,
    bio: "Dog dad of 3 rescue pups. Your furry friend will feel right at home with my pack!",
    social: { linkedin: true, facebook: false },
    tags: ["Multi-Pet Home", "Dog Walker", "Rescue Advocate"],
    price: 1200,
    completedGigs: 23,
    videoIntro: true,
    bgvVerified: true,
  },
  {
    id: 3,
    name: "Sneha Iyer",
    tier: "Elite",
    badge: "🏅",
    rating: 5.0,
    reviews: 12,
    distance: "0.8 km",
    photo: "👩",
    empathyScore: 97,
    bio: "Certified animal behaviorist. I create personalized care plans for every pet I host.",
    social: { linkedin: true, facebook: true },
    tags: ["Behaviorist", "Cat Friendly", "Anxiety Specialist"],
    price: 1600,
    completedGigs: 12,
    videoIntro: true,
    bgvVerified: true,
  },
];

const PULSE_EVENTS = [
  { time: "8:15 AM", type: "checkin", text: "Good morning! Taco woke up happy and energetic 🌞", emoji: "🐕", hasPhoto: true },
  { time: "8:45 AM", type: "feed", text: "Breakfast served — 1 cup Royal Canin + warm water, eaten fully ✅", emoji: "🍽️", hasPhoto: true },
  { time: "9:30 AM", type: "walk", text: "Morning walk completed — 2.1 km around Powai Lake", emoji: "🚶", hasGps: true, distance: "2.1 km", duration: "35 min" },
  { time: "11:00 AM", type: "play", text: "Playtime with the squeaky ball in the garden. He's loving it!", emoji: "🎾", hasPhoto: true },
  { time: "12:30 PM", type: "rest", text: "Nap time 💤 Taco is curled up on his favorite blanket", emoji: "😴", hasPhoto: true },
  { time: "2:00 PM", type: "feed", text: "Afternoon snack — chicken treats as scheduled in the handbook", emoji: "🍗" },
  { time: "3:30 PM", type: "walk", text: "Evening walk — explored Hiranandani Gardens area", emoji: "🌳", hasGps: true, distance: "1.8 km", duration: "28 min" },
  { time: "5:00 PM", type: "update", text: "All good here! Taco is happy, healthy, and well-fed. See you tomorrow! 🐾", emoji: "💜" },
];

// --- Utility Components ---
const Paw = ({ size = 16, color = T.purpleLight, style = {} }) => (
  <span style={{ fontSize: size, opacity: 0.5, ...style }}>🐾</span>
);

const Badge = ({ children, color = T.purple, bg = T.purpleFaint, style = {} }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      color,
      background: bg,
      letterSpacing: 0.3,
      ...style,
    }}
  >
    {children}
  </span>
);

const Button = ({ children, variant = "primary", onClick, style = {}, disabled = false, size = "md" }) => {
  const base = {
    border: "none",
    borderRadius: 14,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    fontFamily: "'Nunito', sans-serif",
    letterSpacing: 0.3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { padding: "10px 18px", fontSize: 13 },
    md: { padding: "14px 24px", fontSize: 15 },
    lg: { padding: "18px 28px", fontSize: 17 },
  };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${T.purple}, ${T.purpleLight})`, color: "#fff", boxShadow: `0 4px 20px ${T.purpleGlow}` },
    secondary: { background: T.purpleFaint, color: T.purple, boxShadow: "none" },
    warm: { background: `linear-gradient(135deg, ${T.warm}, ${T.warmDark})`, color: "#fff", boxShadow: `0 4px 20px ${T.warmLight}` },
    outline: { background: "transparent", color: T.purple, border: `2px solid ${T.border}`, boxShadow: "none" },
    ghost: { background: "transparent", color: T.textSoft, boxShadow: "none" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
};

const Input = ({ label, placeholder, value, onChange, type = "text", icon, style = {} }) => (
  <div style={{ marginBottom: 16, ...style }}>
    {label && (
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textSoft, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
        {label}
      </label>
    )}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: icon ? "14px 14px 14px 44px" : "14px",
          borderRadius: 12,
          border: `2px solid ${T.border}`,
          fontSize: 15,
          fontFamily: "'Nunito', sans-serif",
          color: T.text,
          background: "#fff",
          outline: "none",
          transition: "border 0.2s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = T.purpleLight)}
        onBlur={(e) => (e.target.style.borderColor = T.border)}
      />
    </div>
  </div>
);

const Card = ({ children, style = {}, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: T.card,
      borderRadius: 20,
      padding: 20,
      boxShadow: "0 2px 12px rgba(108,63,197,0.06)",
      border: `1px solid ${T.border}`,
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.2s ease",
      ...style,
    }}
  >
    {children}
  </div>
);

const PhoneFrame = ({ children }) => (
  <div style={{
    maxWidth: 420,
    margin: "0 auto",
    minHeight: "100vh",
    background: T.bg,
    fontFamily: "'Nunito', sans-serif",
    color: T.text,
    position: "relative",
    overflow: "hidden",
  }}>
    {children}
  </div>
);

const Header = ({ title, onBack, right }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    background: "rgba(250,250,254,0.95)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 10,
    borderBottom: `1px solid ${T.border}`,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {onBack && (
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 4, color: T.purple }}>
          ←
        </button>
      )}
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: T.text }}>{title}</h2>
    </div>
    {right && <div>{right}</div>}
  </div>
);

const TrustBadge = ({ icon, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, background: "#F0FFF4", border: "1px solid #C6F6D5" }}>
    <span style={{ fontSize: 14 }}>{icon}</span>
    <span style={{ fontSize: 11, fontWeight: 700, color: "#2F855A" }}>{label}</span>
  </div>
);

const StarRating = ({ rating, size = 14 }) => (
  <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} style={{ fontSize: size, color: i <= Math.floor(rating) ? T.gold : T.border }}>★</span>
    ))}
    <span style={{ marginLeft: 4, fontSize: size - 1, fontWeight: 700, color: T.text }}>{rating}</span>
  </div>
);

// --- Screen Components ---

function SplashScreen({ onNext }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  return (
    <PhoneFrame>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(145deg, #2D1854 0%, ${T.purpleDark} 40%, ${T.purple} 70%, ${T.purpleLight} 100%)`,
        padding: 40,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Floating paws background */}
        {[...Array(8)].map((_, i) => (
          <span key={i} style={{
            position: "absolute",
            fontSize: 20 + (i * 4),
            opacity: 0.08,
            top: `${10 + (i * 11)}%`,
            left: `${5 + (i * 12) % 80}%`,
            transform: `rotate(${i * 37}deg)`,
          }}>🐾</span>
        ))}

        <div style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
          transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          <div style={{ fontSize: 72, marginBottom: 12 }}>🐾</div>
          <h1 style={{
            fontSize: 42,
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 8px",
            letterSpacing: -1,
            fontFamily: "'Nunito', sans-serif",
          }}>
            TacoStay
          </h1>
          <p style={{ color: T.purpleGlow, fontSize: 16, fontWeight: 600, margin: "0 0 8px", letterSpacing: 1 }}>
            EASE OF MIND, ALWAYS
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "0 0 48px", lineHeight: 1.6, maxWidth: 260 }}>
            India's trust-first pet boarding platform. Because your furry family deserves verified love.
          </p>
        </div>

        <div style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease 0.4s",
          width: "100%",
          maxWidth: 300,
        }}>
          <Button onClick={onNext} style={{ background: "linear-gradient(135deg, #FF8F5C, #E86F3A)", boxShadow: "0 4px 24px rgba(255,143,92,0.4)" }} size="lg">
            🐕 Get Started
          </Button>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 20 }}>
            Available in Mumbai & Bangalore
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function SignupScreen({ onNext, onBack }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  return (
    <PhoneFrame>
      <Header title="Create Account" onBack={onBack} />
      <div style={{ padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>👋</div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>Welcome, Pawrent!</h2>
          <p style={{ margin: 0, color: T.textSoft, fontSize: 14 }}>Let's set up your account in 30 seconds</p>
        </div>

        {step === 1 ? (
          <>
            <Input label="Your Name" placeholder="e.g. Rohan" value={name} onChange={setName} icon="👤" />
            <Input label="Phone Number" placeholder="+91 98765 43210" value={phone} onChange={setPhone} icon="📱" type="tel" />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textSoft, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
                City
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {["Mumbai", "Bangalore"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: 12,
                      border: `2px solid ${city === c ? T.purple : T.border}`,
                      background: city === c ? T.purpleFaint : "#fff",
                      color: city === c ? T.purple : T.textSoft,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                      fontFamily: "'Nunito', sans-serif",
                      transition: "all 0.2s",
                    }}
                  >
                    {c === "Mumbai" ? "🏙️" : "🌳"} {c}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <Button onClick={() => setStep(2)} disabled={!name || !phone}>
                Send OTP →
              </Button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ color: T.textMuted, fontSize: 12, fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>

            <Button variant="outline" style={{ marginBottom: 10 }}>
              <span>🔵</span> Continue with Google
            </Button>
            <Button variant="outline">
              <span>🔷</span> Continue with Facebook
            </Button>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <p style={{ color: T.textSoft, fontSize: 14 }}>
                We sent a 4-digit code to <strong>{phone || "+91 98765 43210"}</strong>
              </p>
            </div>
            <Input label="Enter OTP" placeholder="● ● ● ●" value={otp} onChange={setOtp} icon="🔐" style={{ textAlign: "center", letterSpacing: 12 }} />
            <Button onClick={onNext} disabled={otp.length < 4}>
              Verify & Continue 🐾
            </Button>
            <button onClick={() => setStep(1)} style={{ width: "100%", textAlign: "center", marginTop: 16, background: "none", border: "none", color: T.purple, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'Nunito', sans-serif" }}>
              ← Change number
            </button>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}

function PetProfileScreen({ onNext, onBack }) {
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [temperament, setTemperament] = useState("Friendly");
  const [flightRisk, setFlightRisk] = useState(null);

  const temperaments = ["Friendly", "Shy", "Energetic", "Anxious", "Calm"];

  return (
    <PhoneFrame>
      <Header title="Pet Profile" onBack={onBack} />
      <div style={{ padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.purpleFaint}, ${T.warmLight})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
            margin: "0 auto 12px",
            border: `3px solid ${T.purpleGlow}`,
          }}>
            {species === "dog" ? "🐕" : "🐈"}
          </div>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>Tell us about your fur baby</h2>
          <p style={{ margin: 0, color: T.textSoft, fontSize: 13 }}>This creates their Pet Vault profile</p>
        </div>

        <Input label="Pet's Name" placeholder="e.g. Taco" value={petName} onChange={setPetName} icon="💛" />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textSoft, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Species
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            {[["dog", "🐕 Dog"], ["cat", "🐈 Cat"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSpecies(val)}
                style={{
                  flex: 1, padding: 14, borderRadius: 12,
                  border: `2px solid ${species === val ? T.purple : T.border}`,
                  background: species === val ? T.purpleFaint : "#fff",
                  color: species === val ? T.purple : T.textSoft,
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif", transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Input label="Breed" placeholder="e.g. Golden Labrador" value={breed} onChange={setBreed} icon="🦴" />

        <div style={{ display: "flex", gap: 12 }}>
          <Input label="Age" placeholder="2 yrs" value={age} onChange={setAge} style={{ flex: 1 }} />
          <Input label="Weight" placeholder="25 kg" value={weight} onChange={setWeight} style={{ flex: 1 }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textSoft, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Temperament
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {temperaments.map((t) => (
              <button
                key={t}
                onClick={() => setTemperament(t)}
                style={{
                  padding: "8px 16px", borderRadius: 20,
                  border: `2px solid ${temperament === t ? T.purple : T.border}`,
                  background: temperament === t ? T.purpleFaint : "#fff",
                  color: temperament === t ? T.purple : T.textSoft,
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif", transition: "all 0.2s",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Flight Risk - Critical Question */}
        <Card style={{
          background: `linear-gradient(135deg, #FFF5F0, #FFF0E8)`,
          border: `2px solid #FFD4BC`,
          marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span style={{ fontWeight: 800, fontSize: 14, color: T.warmDark }}>IMPORTANT SAFETY QUESTION</span>
          </div>
          <p style={{ margin: "0 0 14px", fontSize: 14, color: T.text, lineHeight: 1.5 }}>
            Is {petName || "your pet"} a <strong>flight risk</strong>? (tends to bolt through open doors, escapes leashes, etc.)
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              [true, "Yes, flight risk 🏃"],
              [false, "No, stays put ✅"],
            ].map(([val, label]) => (
              <button
                key={String(val)}
                onClick={() => setFlightRisk(val)}
                style={{
                  flex: 1, padding: 12, borderRadius: 12,
                  border: `2px solid ${flightRisk === val ? (val ? T.warmDark : T.success) : T.border}`,
                  background: flightRisk === val ? (val ? "#FFF0E8" : "#F0FFF4") : "#fff",
                  color: flightRisk === val ? (val ? T.warmDark : "#2F855A") : T.textSoft,
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif", transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {flightRisk === true && (
            <p style={{ margin: "12px 0 0", fontSize: 12, color: T.warmDark, fontWeight: 600, lineHeight: 1.5, background: "#FFE8D9", padding: "8px 12px", borderRadius: 8 }}>
              🏷️ Active Care Package with JioTag tracker will be automatically recommended during booking for extra safety.
            </p>
          )}
        </Card>

        <Button onClick={onNext} disabled={!petName || flightRisk === null}>
          Save Pet Profile →
        </Button>
      </div>
    </PhoneFrame>
  );
}

function HomeScreen({ onSelectSitter, onBack }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = MOCK_SITTERS.filter((s) =>
    filter === "all" ? true : s.tier.toLowerCase() === filter
  );

  return (
    <PhoneFrame>
      <div style={{
        padding: "20px 20px 12px",
        background: `linear-gradient(145deg, ${T.purpleDark}, ${T.purple})`,
        borderRadius: "0 0 28px 28px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ margin: 0, color: T.purpleGlow, fontSize: 12, fontWeight: 600 }}>Welcome back 👋</p>
            <h2 style={{ margin: "2px 0 0", color: "#fff", fontSize: 22, fontWeight: 800 }}>Find a Sitter</h2>
          </div>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>
            🐾
          </div>
        </div>

        <div style={{ position: "relative", marginBottom: 14 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input
            placeholder="Search by area, sitter name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "14px 14px 14px 44px", borderRadius: 14, border: "none",
              fontSize: 14, fontFamily: "'Nunito', sans-serif", background: "rgba(255,255,255,0.15)",
              color: "#fff", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {[["all", "🌟 All"], ["elite", "🏅 Elite"], ["classic", "⭐ Classic"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: "8px 16px", borderRadius: 20, border: "none",
                background: filter === val ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer",
                fontFamily: "'Nunito', sans-serif", transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>
            {filtered.length} verified sitters near Powai
          </p>
          <span style={{ fontSize: 12, color: T.textMuted }}>Sorted by distance</span>
        </div>

        {filtered.map((sitter) => (
          <Card
            key={sitter.id}
            onClick={() => onSelectSitter(sitter)}
            style={{ marginBottom: 14, cursor: "pointer" }}
          >
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, fontSize: 32,
                background: `linear-gradient(135deg, ${T.purpleFaint}, ${T.warmLight})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `2px solid ${sitter.tier === "Elite" ? T.gold : T.border}`,
                flexShrink: 0,
              }}>
                {sitter.photo}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{sitter.name}</h3>
                  <span style={{ fontSize: 14 }}>{sitter.badge}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <StarRating rating={sitter.rating} size={12} />
                  <span style={{ fontSize: 11, color: T.textMuted }}>({sitter.reviews})</span>
                  <span style={{ fontSize: 11, color: T.textMuted }}>• {sitter.distance}</span>
                </div>

                <p style={{ margin: "0 0 8px", fontSize: 12, color: T.textSoft, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {sitter.bio}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {sitter.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} style={{ fontSize: 10, padding: "3px 8px" }}>{tag}</Badge>
                    ))}
                  </div>
                  <span style={{ fontWeight: 800, color: T.purple, fontSize: 15 }}>
                    ₹{sitter.price}<span style={{ fontWeight: 600, fontSize: 11, color: T.textMuted }}>/night</span>
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PhoneFrame>
  );
}

function SitterDetailScreen({ sitter, onBook, onBack }) {
  return (
    <PhoneFrame>
      <Header title="Sitter Profile" onBack={onBack} />
      <div style={{ padding: 20 }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%", fontSize: 50,
            background: `linear-gradient(135deg, ${T.purpleFaint}, ${T.warmLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px", border: `3px solid ${sitter.tier === "Elite" ? T.gold : T.purpleGlow}`,
          }}>
            {sitter.photo}
          </div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>{sitter.name}</h2>
          <Badge color={sitter.tier === "Elite" ? "#B8860B" : T.purple} bg={sitter.tier === "Elite" ? "#FFFBEB" : T.purpleFaint}>
            {sitter.badge} {sitter.tier} Sitter
          </Badge>
        </div>

        {/* Trust Badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
          {sitter.bgvVerified && <TrustBadge icon="✅" label="BGV Verified" />}
          {sitter.videoIntro && <TrustBadge icon="📹" label="Video Intro" />}
          {sitter.social.linkedin && <TrustBadge icon="🔗" label="LinkedIn" />}
          {sitter.social.facebook && <TrustBadge icon="👤" label="Facebook" />}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Rating", value: sitter.rating, icon: "⭐" },
            { label: "Gigs", value: sitter.completedGigs, icon: "🏠" },
            { label: "Empathy", value: `${sitter.empathyScore}%`, icon: "💜" },
          ].map((stat) => (
            <Card key={stat.label} style={{ flex: 1, textAlign: "center", padding: 14 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: T.purple }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600 }}>{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Bio */}
        <Card style={{ marginBottom: 16 }}>
          <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: T.purple }}>About</h4>
          <p style={{ margin: 0, fontSize: 14, color: T.textSoft, lineHeight: 1.6 }}>{sitter.bio}</p>
        </Card>

        {/* Tags */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {sitter.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        {/* Video Intro Placeholder */}
        <Card style={{ marginBottom: 24, background: T.purpleFaint, textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>▶️</div>
          <p style={{ margin: 0, fontWeight: 700, color: T.purple, fontSize: 14 }}>Watch Video Introduction</p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: T.textSoft }}>30-second vibe check from {sitter.name.split(" ")[0]}</p>
        </Card>

        <Button onClick={onBook} size="lg">
          Book {sitter.name.split(" ")[0]} — ₹{sitter.price}/night
        </Button>
      </div>
    </PhoneFrame>
  );
}

function BookingScreen({ sitter, onConfirm, onBack }) {
  const [tier, setTier] = useState("classic");
  const [dates, setDates] = useState({ start: "2026-03-15", end: "2026-03-18" });
  const [activeCare, setActiveCare] = useState(false);

  const tiers = [
    { id: "daycare", name: "Day Care", emoji: "☀️", price: 500, desc: "4-hour flex slot", perDay: false },
    { id: "classic", name: "Classic Stay", emoji: "🏠", price: 1200, desc: "₹1,200/night • Medical cover included", perDay: true },
    { id: "elite", name: "Elite Stay", emoji: "👑", price: 1600, desc: "₹1,600/night • Premium care", perDay: true },
  ];

  const nights = 3;
  const selectedTier = tiers.find((t) => t.id === tier);
  const basePrice = selectedTier.perDay ? selectedTier.price * nights : selectedTier.price;
  const platformFee = 99;
  const activeCarePrice = activeCare ? (75 * nights + 200) : 0;
  const total = basePrice + platformFee + activeCarePrice;

  return (
    <PhoneFrame>
      <Header title="Book a Stay" onBack={onBack} />
      <div style={{ padding: 20 }}>
        {/* Sitter Mini Card */}
        <Card style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, fontSize: 26,
            background: `linear-gradient(135deg, ${T.purpleFaint}, ${T.warmLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {sitter.photo}
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>{sitter.name}</h4>
            <p style={{ margin: 0, fontSize: 12, color: T.textSoft }}>{sitter.badge} {sitter.tier} • {sitter.distance}</p>
          </div>
        </Card>

        {/* Tier Selection */}
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textSoft, marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>
          Select Service Tier
        </label>
        {tiers.map((t) => (
          <Card
            key={t.id}
            onClick={() => setTier(t.id)}
            style={{
              marginBottom: 10,
              padding: 16,
              border: `2px solid ${tier === t.id ? T.purple : T.border}`,
              background: tier === t.id ? T.purpleFaint : T.card,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{t.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: tier === t.id ? T.purple : T.text }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: T.textSoft }}>{t.desc}</div>
                </div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                border: `2px solid ${tier === t.id ? T.purple : T.border}`,
                background: tier === t.id ? T.purple : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {tier === t.id && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
              </div>
            </div>
          </Card>
        ))}

        {/* Dates */}
        {tier !== "daycare" && (
          <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textSoft, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>Check-in</label>
              <Card style={{ textAlign: "center", padding: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: T.purple }}>Mar 15</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>Saturday</div>
              </Card>
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingTop: 20, fontSize: 18, color: T.textMuted }}>→</div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: T.textSoft, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>Check-out</label>
              <Card style={{ textAlign: "center", padding: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: T.purple }}>Mar 18</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>Tuesday</div>
              </Card>
            </div>
          </div>
        )}

        {/* Active Care Upsell */}
        <Card
          onClick={() => setActiveCare(!activeCare)}
          style={{
            marginBottom: 20,
            border: `2px solid ${activeCare ? T.warm : T.border}`,
            background: activeCare ? "#FFF8F4" : T.card,
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>🏷️</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: activeCare ? T.warmDark : T.text }}>Active Care Package</div>
                <div style={{ fontSize: 12, color: T.textSoft }}>Extra daily walk + JioTag GPS tracker</div>
              </div>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              border: `2px solid ${activeCare ? T.warm : T.border}`,
              background: activeCare ? T.warm : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {activeCare && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: T.warm }}>
            +₹{75 * nights + 200} for {nights} nights
          </div>
        </Card>

        {/* Price Breakdown */}
        <Card style={{ background: T.purpleFaint, marginBottom: 24 }}>
          <h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 800, color: T.purple }}>Price Breakdown</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ color: T.textSoft }}>{selectedTier.name} × {tier === "daycare" ? "1 slot" : `${nights} nights`}</span>
              <span style={{ fontWeight: 700 }}>₹{basePrice}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ color: T.textSoft }}>Platform fee</span>
              <span style={{ fontWeight: 700 }}>₹{platformFee}</span>
            </div>
            {activeCare && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: T.textSoft }}>Active Care Package</span>
                <span style={{ fontWeight: 700 }}>₹{activeCarePrice}</span>
              </div>
            )}
            <div style={{ borderTop: `2px solid ${T.purpleGlow}`, paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 17 }}>
              <span style={{ fontWeight: 800, color: T.purple }}>Total</span>
              <span style={{ fontWeight: 900, color: T.purple }}>₹{total}</span>
            </div>
          </div>
        </Card>

        {tier !== "daycare" && (
          <p style={{ fontSize: 11, color: T.success, fontWeight: 600, textAlign: "center", marginBottom: 16 }}>
            ✅ Includes ₹25,000 medical insurance for your pet
          </p>
        )}

        <Button onClick={onConfirm} size="lg" variant="warm">
          Pay ₹{total} → Escrow Vault 🔒
        </Button>
      </div>
    </PhoneFrame>
  );
}

function BookingConfirmScreen({ sitter, onNext }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  return (
    <PhoneFrame>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        textAlign: "center",
      }}>
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.5)",
          transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: `linear-gradient(135deg, #E8FFE8, #C6F6D5)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 48, margin: "0 auto 20px",
            boxShadow: "0 8px 32px rgba(52,199,123,0.2)",
          }}>
            ✅
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 900, color: T.text }}>Booking Confirmed!</h2>
          <p style={{ color: T.textSoft, fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
            Your payment is secured in TacoStay Escrow Vault. {sitter.name.split(" ")[0]} has been notified.
          </p>

          <Card style={{ margin: "24px 0", textAlign: "left" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: T.textSoft, fontSize: 13 }}>Sitter</span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{sitter.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: T.textSoft, fontSize: 13 }}>Dates</span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>Mar 15 — Mar 18</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: T.textSoft, fontSize: 13 }}>Pet</span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>Taco 🐕</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: T.textSoft, fontSize: 13 }}>Status</span>
                <Badge color="#2F855A" bg="#F0FFF4">Escrow Locked 🔒</Badge>
              </div>
            </div>
          </Card>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: T.textSoft, marginBottom: 4 }}>📋 Next step</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: T.purple }}>Complete the Pet Handbook & Orientation</p>
          </div>
        </div>

        <Button onClick={onNext} size="lg">
          Complete Handbook & Orientation →
        </Button>
      </div>
    </PhoneFrame>
  );
}

function OrientationScreen({ sitter, onNext, onBack }) {
  const [checks, setChecks] = useState({ feeding: false, walking: false, behavioral: false });
  const allChecked = Object.values(checks).every(Boolean);

  return (
    <PhoneFrame>
      <Header title="Orientation & Handbook" onBack={onBack} />
      <div style={{ padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📋</div>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>Pet Handbook</h2>
          <p style={{ margin: 0, color: T.textSoft, fontSize: 13 }}>Taco's care instructions for {sitter.name.split(" ")[0]}</p>
        </div>

        {/* Handbook Sections */}
        {[
          { key: "feeding", emoji: "🍽️", title: "Feeding Routine", items: ["Royal Canin Medium Adult — 1 cup, twice daily", "Warm water mixed in", "No table food — sensitive stomach", "Treats: max 3 chicken strips/day"] },
          { key: "walking", emoji: "🚶", title: "Walking Preferences", items: ["Morning walk: 7-8 AM, 30 min minimum", "Evening walk: 5-6 PM, 20 min", "Uses blue retractable leash (in hallway)", "Pulls on leash near other dogs — use gentle redirect"] },
          { key: "behavioral", emoji: "🧠", title: "Behavioral Notes", items: ["Anxious during thunderstorms — use ThunderShirt", "Loves belly rubs after meals", "Barks at delivery people — redirect with treat", "Sleeps on the couch, not the bed"] },
        ].map(({ key, emoji, title, items }) => (
          <Card key={key} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>{emoji}</span>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>{title}</h4>
              </div>
              <button
                onClick={() => setChecks((c) => ({ ...c, [key]: !c[key] }))}
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  border: `2px solid ${checks[key] ? T.success : T.border}`,
                  background: checks[key] ? T.success : "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {checks[key] && <span style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>✓</span>}
              </button>
            </div>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: T.textSoft, lineHeight: 1.5 }}>
                <span style={{ color: T.purpleLight }}>•</span>
                {item}
              </div>
            ))}
          </Card>
        ))}

        {/* Digital Handshake */}
        <Card style={{
          background: allChecked ? `linear-gradient(135deg, #F0FFF4, #E8FFE8)` : T.card,
          border: `2px solid ${allChecked ? T.success : T.border}`,
          marginBottom: 24,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{allChecked ? "🤝" : "✍️"}</div>
          <h4 style={{ margin: "0 0 4px", fontWeight: 800, color: allChecked ? "#2F855A" : T.text }}>
            {allChecked ? "Digital Handshake Ready!" : "The Digital Handshake"}
          </h4>
          <p style={{ margin: 0, fontSize: 12, color: T.textSoft, lineHeight: 1.5 }}>
            {allChecked
              ? `${sitter.name.split(" ")[0]} has acknowledged all care notes. Both parties are aligned.`
              : "The sitter must acknowledge each section above before the stay begins."
            }
          </p>
        </Card>

        <Button onClick={onNext} disabled={!allChecked} size="lg">
          {allChecked ? "Start the Stay — View Pulse 🐾" : "Complete all checks to continue"}
        </Button>
      </div>
    </PhoneFrame>
  );
}

function PulseScreen({ sitter, onComplete, onBack }) {
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    if (visibleCount < PULSE_EVENTS.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 1500);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  return (
    <PhoneFrame>
      <Header
        title="The Pulse"
        onBack={onBack}
        right={
          <Badge color="#2F855A" bg="#F0FFF4" style={{ fontSize: 10 }}>
            🟢 LIVE
          </Badge>
        }
      />
      <div style={{ padding: 20 }}>
        {/* Sitter Status */}
        <Card style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
          background: `linear-gradient(135deg, ${T.purpleFaint}, #fff)`,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%", fontSize: 26,
            background: T.warmLight,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {sitter.photo}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14 }}>{sitter.name}</div>
            <div style={{ fontSize: 12, color: T.textSoft }}>Caring for Taco 🐕 • Day 1 of 3</div>
          </div>
          <div style={{
            padding: "6px 12px", borderRadius: 10, background: "#F0FFF4",
            fontSize: 11, fontWeight: 700, color: "#2F855A",
          }}>
            Active
          </div>
        </Card>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: 19, top: 0, bottom: 0, width: 2,
            background: `linear-gradient(to bottom, ${T.purpleLight}, ${T.border})`,
          }} />

          {PULSE_EVENTS.slice(0, visibleCount).map((event, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 20,
                opacity: 1,
                animation: index === visibleCount - 1 ? "fadeSlideIn 0.5s ease" : "none",
              }}
            >
              {/* Dot */}
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: index === 0 ? `linear-gradient(135deg, ${T.purple}, ${T.purpleLight})` : T.card,
                border: `2px solid ${index === 0 ? T.purple : T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, zIndex: 1,
                boxShadow: index === 0 ? `0 2px 12px ${T.purpleGlow}` : "none",
              }}>
                {event.emoji}
              </div>

              <Card style={{ flex: 1, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.purple }}>{event.time}</span>
                  {event.hasGps && (
                    <Badge color="#2F855A" bg="#F0FFF4" style={{ fontSize: 10 }}>
                      📍 GPS Tracked
                    </Badge>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 14, color: T.text, lineHeight: 1.5 }}>{event.text}</p>
                {event.hasGps && (
                  <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 12, color: T.textSoft }}>
                    <span>🏃 {event.distance}</span>
                    <span>⏱️ {event.duration}</span>
                  </div>
                )}
                {event.hasPhoto && (
                  <div style={{
                    marginTop: 10, height: 120, borderRadius: 12,
                    background: `linear-gradient(135deg, ${T.purpleFaint}, ${T.warmLight})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: T.textSoft, fontWeight: 600,
                  }}>
                    📸 Photo attached
                  </div>
                )}
              </Card>
            </div>
          ))}

          {visibleCount < PULSE_EVENTS.length && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: 20, background: T.purpleFaint,
                fontSize: 12, fontWeight: 700, color: T.purple,
              }}>
                <span style={{ animation: "pulse 1.5s ease infinite" }}>●</span>
                Live updates incoming...
              </div>
            </div>
          )}
        </div>

        {visibleCount >= PULSE_EVENTS.length && (
          <div style={{ marginTop: 20 }}>
            <Button onClick={onComplete} size="lg" variant="warm">
              Enter End OTP & Close Stay
            </Button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </PhoneFrame>
  );
}

function RatingScreen({ sitter, onFinish }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [favorite, setFavorite] = useState(false);

  if (submitted) {
    return (
      <PhoneFrame>
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center",
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 900 }}>Thank you!</h2>
          <p style={{ color: T.textSoft, fontSize: 14, marginBottom: 8, lineHeight: 1.6 }}>
            Your review helps build trust in the TacoStay community.
          </p>
          {favorite && (
            <Badge color={T.warmDark} bg={T.warmLight} style={{ marginBottom: 20, fontSize: 13, padding: "8px 16px" }}>
              💛 {sitter.name.split(" ")[0]} added to favorites
            </Badge>
          )}
          <Card style={{ width: "100%", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: T.textSoft }}>Payment released to sitter</span>
              <Badge color="#2F855A" bg="#F0FFF4">✅ Complete</Badge>
            </div>
          </Card>
          <Button onClick={onFinish} size="lg">
            Back to Home 🏠
          </Button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <Header title="Rate Your Stay" />
      <div style={{ padding: 24, textAlign: "center" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", fontSize: 38,
          background: `linear-gradient(135deg, ${T.purpleFaint}, ${T.warmLight})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          {sitter.photo}
        </div>
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800 }}>How was your stay with {sitter.name.split(" ")[0]}?</h3>
        <p style={{ color: T.textSoft, fontSize: 13, marginBottom: 24 }}>Your feedback helps other pawrents</p>

        {/* Stars */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onClick={() => setRating(i)}
              style={{
                fontSize: 36, background: "none", border: "none", cursor: "pointer",
                transform: rating >= i ? "scale(1.1)" : "scale(1)",
                transition: "all 0.2s",
                filter: rating >= i ? "none" : "grayscale(1) opacity(0.3)",
              }}
            >
              ⭐
            </button>
          ))}
        </div>

        <textarea
          placeholder="Tell other pawrents about your experience..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          style={{
            width: "100%", minHeight: 100, padding: 14, borderRadius: 14,
            border: `2px solid ${T.border}`, fontSize: 14, fontFamily: "'Nunito', sans-serif",
            color: T.text, resize: "vertical", outline: "none", boxSizing: "border-box",
          }}
        />

        {/* Favorite Toggle */}
        <Card
          onClick={() => setFavorite(!favorite)}
          style={{
            marginTop: 16, marginBottom: 24, cursor: "pointer",
            border: `2px solid ${favorite ? T.warm : T.border}`,
            background: favorite ? "#FFF8F4" : T.card,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>{favorite ? "💛" : "🤍"}</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: favorite ? T.warmDark : T.textSoft }}>
              {favorite ? `${sitter.name.split(" ")[0]} is a favorite!` : `Add ${sitter.name.split(" ")[0]} to favorites?`}
            </span>
          </div>
        </Card>

        <Button onClick={() => setSubmitted(true)} disabled={rating === 0} size="lg">
          Submit Review & Release Payment
        </Button>
      </div>
    </PhoneFrame>
  );
}

// --- Main App ---
export default function TacoStayApp() {
  const [screen, setScreen] = useState(SCREENS.SPLASH);
  const [selectedSitter, setSelectedSitter] = useState(null);

  const go = (s) => setScreen(s);

  return (
    <div style={{ background: "#1E1633", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        input::placeholder, textarea::placeholder { color: #A09AAE; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #DBC8FF; border-radius: 4px; }
      `}</style>

      {screen === SCREENS.SPLASH && (
        <SplashScreen onNext={() => go(SCREENS.SIGNUP)} />
      )}
      {screen === SCREENS.SIGNUP && (
        <SignupScreen onNext={() => go(SCREENS.PET_PROFILE)} onBack={() => go(SCREENS.SPLASH)} />
      )}
      {screen === SCREENS.PET_PROFILE && (
        <PetProfileScreen onNext={() => go(SCREENS.HOME)} onBack={() => go(SCREENS.SIGNUP)} />
      )}
      {screen === SCREENS.HOME && (
        <HomeScreen
          onSelectSitter={(s) => { setSelectedSitter(s); go(SCREENS.SITTER_DETAIL); }}
          onBack={() => go(SCREENS.PET_PROFILE)}
        />
      )}
      {screen === SCREENS.SITTER_DETAIL && selectedSitter && (
        <SitterDetailScreen
          sitter={selectedSitter}
          onBook={() => go(SCREENS.BOOKING)}
          onBack={() => go(SCREENS.HOME)}
        />
      )}
      {screen === SCREENS.BOOKING && selectedSitter && (
        <BookingScreen
          sitter={selectedSitter}
          onConfirm={() => go(SCREENS.BOOKING_CONFIRM)}
          onBack={() => go(SCREENS.SITTER_DETAIL)}
        />
      )}
      {screen === SCREENS.BOOKING_CONFIRM && selectedSitter && (
        <BookingConfirmScreen
          sitter={selectedSitter}
          onNext={() => go(SCREENS.ORIENTATION)}
        />
      )}
      {screen === SCREENS.ORIENTATION && selectedSitter && (
        <OrientationScreen
          sitter={selectedSitter}
          onNext={() => go(SCREENS.PULSE)}
          onBack={() => go(SCREENS.BOOKING_CONFIRM)}
        />
      )}
      {screen === SCREENS.PULSE && selectedSitter && (
        <PulseScreen
          sitter={selectedSitter}
          onComplete={() => go(SCREENS.RATING)}
          onBack={() => go(SCREENS.ORIENTATION)}
        />
      )}
      {screen === SCREENS.RATING && selectedSitter && (
        <RatingScreen
          sitter={selectedSitter}
          onFinish={() => go(SCREENS.HOME)}
        />
      )}
    </div>
  );
}
