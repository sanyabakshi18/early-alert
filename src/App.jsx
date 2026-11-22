
import { useState } from "react";
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
} from "lucide-react";
import "./App.css";
import ResultsDashboard from "./ResultsDashboard";

const symptomOptions = [
  "Chest discomfort",
  "Dizziness",
  "Unusual sweating",
  "Shortness of breath",
  "Headache",
  "Fatigue",
  "Fast heartbeat",
  "Nausea",
  "Weakness",
  "Blurred vision",
];

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [context, setContext] = useState("");
  const [improving, setImproving] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Add or remove a symptom
  const handleSymptomChange = (symptom) => {
    setSymptoms((previous) =>
      previous.includes(symptom)
        ? previous.filter((item) => item !== symptom)
        : [...previous, symptom]
    );
  };

  // Collect the user's answers
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      symptoms.length === 0 ||
      !duration ||
      !severity ||
      !context ||
      !improving
    ) {
      alert("Please complete all required fields.");
      return;
    }

    const userData = {
      symptoms,
      duration,
      severity,
      context,
      improving,
      additionalDetails: details,
    };

    // Display collected data in the browser console
    setSubmittedData(userData);
setSubmitted(true);
  };

  const resetForm = () => {
  setSymptoms([]);
  setDuration("");
  setSeverity("");
  setContext("");
  setImproving("");
  setDetails("");

  setSubmittedData(null);
  setSubmitted(false);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
// Show the separate Results Dashboard after submission
if (submitted && submittedData) {
  return (
    <ResultsDashboard
      data={submittedData}
      onStartAgain={resetForm}
    />
  );
}
  return (
    <div className="app">

      {/* NAVIGATION BAR */}
      <nav className="navbar">
        <a href="#" className="brand">
          <div className="brand-icon">
            <HeartPulse size={25} />
          </div>
          <span>Early<span className="brand-accent">Alert</span></span>
        </a>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#symptom-form">Symptom Checker</a>
        </div>

        <a href="#symptom-form" className="nav-button">
          Get Started <ArrowRight size={16} />
        </a>
      </nav>

      {/* LANDING PAGE */}
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <Activity size={15} />
            HEALTH AWARENESS PLATFORM
          </div>

          <h1>
            Understand your symptoms.
            <span> Take the right next step.</span>
          </h1>

          <p>
            Your health matters. Share what you are experiencing
            and get an understandable overview of your symptoms
            and guidance on when to seek professional medical care.
          </p>

          <a href="#symptom-form" className="primary-button">
            Check Your Symptoms <ArrowRight size={18} />
          </a>

          <div className="trust-points">
            <span><ShieldCheck size={16} /> Privacy-conscious</span>
            <span><CheckCircle2 size={16} /> Easy to understand</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-circle">
            <div className="heart-icon">
              <HeartPulse size={76} strokeWidth={1.4} />
            </div>
            <div className="floating-card card-one">
              <Activity size={19} />
              <div>
                <strong>Symptom Awareness</strong>
                <small>Understand your health</small>
              </div>
            </div>
            <div className="floating-card card-two">
              <ShieldCheck size={19} />
              <div>
                <strong>Early Attention</strong>
                <small>Know when to seek help</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section" id="about">
        <div className="section-heading">
          <span className="section-label">HOW IT WORKS</span>
          <h2>Your health awareness journey</h2>
          <p>Three simple steps to understand the information you provide.</p>
        </div>

        <div className="steps">
          <div className="step-card">
            <div className="step-icon"><Activity /></div>
            <h3>01. Share Symptoms</h3>
            <p>Select the symptoms you are experiencing.</p>
          </div>

          <div className="step-card">
            <div className="step-icon"><Stethoscope /></div>
            <h3>02. Provide Context</h3>
            <p>Answer questions about duration and circumstances.</p>
          </div>

          <div className="step-card">
            <div className="step-icon"><ShieldCheck /></div>
            <h3>03. Understand</h3>
            <p>Receive understandable information and appropriate guidance.</p>
          </div>
        </div>
      </section>

      {/* SYMPTOM FORM */}
      <section className="form-section" id="symptom-form">
        <div className="section-heading">
          <span className="section-label">SYMPTOM ASSESSMENT</span>
          <h2>Tell us what you are experiencing</h2>
          <p>Answer the following questions to provide relevant context.</p>
        </div>

        {submitted ? (
          <div className="success-card">
            <CheckCircle2 size={48} color="#15966c" />

            <h2>Information submitted!</h2>
            <p>
              Your responses have been collected in this prototype.
              They are not yet being analysed by a medical ML model.
            </p>

            <div className="submitted-info">
              <strong>Symptoms selected:</strong>
              <p>{symptoms.join(", ")}</p>

              <strong>Duration:</strong>
              <p>{duration}</p>

              <strong>Context:</strong>
              <p>{context}</p>
            </div>

            <div className="notice">
              <AlertTriangle size={20} />
              <p>
                This prototype does not diagnose medical conditions.
                If you experience severe or potentially emergency
                symptoms, seek immediate medical attention rather
                than waiting for an online assessment.
              </p>
            </div>

            <button className="primary-button" onClick={resetForm}>
              <RotateCcw size={17} /> Start Again
            </button>
          </div>
        ) : (
          <form className="symptom-form" onSubmit={handleSubmit}>

            {/* SYMPTOM SELECTION */}
            <div className="form-group">
              <h3>1. Select your symptoms</h3>
              <p className="field-description">
                Select all the symptoms that apply.
              </p>

              <div className="symptom-grid">
                {symptomOptions.map((symptom) => (
                  <label
                    key={symptom}
                    className={`symptom-option ${
                      symptoms.includes(symptom) ? "selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={symptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                    />
                    <span className="custom-checkbox">
                      {symptoms.includes(symptom) ? "✓" : ""}
                    </span>
                    {symptom}
                  </label>
                ))}
              </div>

              <p className="selection-count">
                {symptoms.length} symptoms selected
              </p>
            </div>

            <div className="form-divider"></div>

            {/* DURATION */}
            <div className="form-group">
              <h3>2. How long have you experienced these symptoms?</h3>

              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              >
                <option value="">Select duration</option>
                <option>Less than an hour</option>
                <option>A few hours</option>
                <option>One to two days</option>
                <option>Several days</option>
                <option>More than a week</option>
              </select>
            </div>

            <div className="form-divider"></div>

            {/* SEVERITY */}
            <div className="form-group">
              <h3>3. How would you describe the symptoms?</h3>

              <div className="radio-options">
                {["Mild", "Moderate", "Severe"].map((item) => (
                  <label key={item} className="radio-option">
                    <input
                      type="radio"
                      name="severity"
                      value={item}
                      checked={severity === item}
                      onChange={(e) => setSeverity(e.target.value)}
                      required
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-divider"></div>

            {/* CONTEXT */}
            <div className="form-group">
              <h3>4. When do you experience these symptoms?</h3>

              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                required
              >
                <option value="">Select an option</option>
                <option>During physical activity</option>
                <option>After physical activity</option>
                <option>While resting</option>
                <option>During stressful situations</option>
                <option>At different times</option>
              </select>
            </div>

            <div className="form-divider"></div>

            {/* IMPROVEMENT */}
            <div className="form-group">
              <h3>5. Have the symptoms improved?</h3>

              <div className="radio-options">
                {[
                  "Yes, they have improved",
                  "No, they have not improved",
                  "They come and go",
                ].map((item) => (
                  <label key={item} className="radio-option">
                    <input
                      type="radio"
                      name="improving"
                      value={item}
                      checked={improving === item}
                      onChange={(e) => setImproving(e.target.value)}
                      required
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-divider"></div>

            {/* ADDITIONAL INFORMATION */}
            <div className="form-group">
              <h3>6. Additional information (optional)</h3>
              <p className="field-description">
                Is there anything else you would like to mention?
              </p>

              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe any additional information..."
                rows="4"
              />
            </div>

            <div className="form-notice">
              <ShieldCheck size={20} />
              <p>
                Your information is used for this demonstration.
                This prototype does not send it to a server or provide
                a medical diagnosis.
              </p>
            </div>

            <button type="submit" className="submit-button">
              Submit Information <ArrowRight size={18} />
            </button>

          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer>
        <div className="brand footer-brand">
          <HeartPulse size={23} />
          <span>Early<span className="brand-accent">Alert</span></span>
        </div>

        <p>
          Promoting early health awareness through technology.
        </p>

        <small>
          Educational prototype only. Not a substitute for professional
          medical advice, diagnosis or treatment.
        </small>
      </footer>

    </div>
  );
}

export default App;
