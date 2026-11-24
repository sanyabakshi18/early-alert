import { useState } from "react";
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
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
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const handleSymptomChange = (symptom) => {
    setSymptoms((previous) =>
      previous.includes(symptom)
        ? previous.filter((item) => item !== symptom)
        : [...previous, symptom]
    );
  };

  const resetForm = () => {
    setSymptoms([]);
    setDuration("");
    setSeverity("");
    setContext("");
    setImproving("");
    setDetails("");
    setLoading(false);
    setApiError("");
    setSubmittedData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    if (
      symptoms.length === 0 ||
      !duration ||
      !severity ||
      !context ||
      !improving
    ) {
      setApiError("Please complete all required symptom assessment fields.");
      return;
    }

    setLoading(true);

    try {
      // This endpoint selects a real row from the cleaned dataset on the
      // backend and runs the existing trained model on that row.
      const response = await fetch("http://127.0.0.1:5000/demo-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "The cardiovascular dataset demonstration could not be completed."
        );
      }

      setSubmittedData({
        symptoms,
        duration,
        severity,
        context,
        improving,
        additionalDetails: details,
        modelResult: result,
      });
    } catch (error) {
      console.error("Dataset demonstration error:", error);
      setApiError(
        `${error.message} Check that Flask is running and the cleaned CSV is in the expected location.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (submittedData) {
    return (
      <ResultsDashboard data={submittedData} onStartAgain={resetForm} />
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a href="#" className="brand">
          <div className="brand-icon">
            <HeartPulse size={25} />
          </div>
          <span>
            Early<span className="brand-accent">Alert</span>
          </span>
        </a>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#symptom-form">Symptom Checker</a>
        </div>

        <a href="#symptom-form" className="nav-button">
          Get Started <ArrowRight size={16} />
        </a>
      </nav>

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
            Share your symptoms and receive an educational overview of the
            information you provided, alongside a separate cardiovascular
            machine-learning demonstration using a dataset record.
          </p>

          <a href="#symptom-form" className="primary-button">
            Check Your Symptoms <ArrowRight size={18} />
          </a>

          <div className="trust-points">
            <span><ShieldCheck size={16} /> Awareness-focused</span>
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

      <section className="about-section" id="about">
        <div className="section-heading">
          <span className="section-label">HOW IT WORKS</span>
          <h2>Your health awareness journey</h2>
          <p>Three simple steps to understand the information provided.</p>
        </div>

        <div className="steps">
          <div className="step-card">
            <div className="step-icon"><Activity /></div>
            <h3>01. Share Symptoms</h3>
            <p>Select the symptoms you want to include in the assessment.</p>
          </div>
          <div className="step-card">
            <div className="step-icon"><Stethoscope /></div>
            <h3>02. Provide Information</h3>
            <p>Answer a few simple questions about your symptoms.</p>
          </div>
          <div className="step-card">
            <div className="step-icon"><ShieldCheck /></div>
            <h3>03. View Results</h3>
            <p>Review symptom observations and a separate ML demonstration.</p>
          </div>
        </div>
      </section>

      <section className="form-section" id="symptom-form">
        <div className="section-heading">
          <span className="section-label">SYMPTOM ASSESSMENT</span>
          <h2>Tell us what you are experiencing</h2>
          <p>Complete the sections below. No medical test codes are required.</p>
        </div>

        <form className="symptom-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <h3>1. Select your symptoms</h3>
            <p className="field-description">
              Select all the symptoms you want to include.
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

          <div className="form-divider" />

          <div className="form-group">
            <h3>2. How long have you experienced these symptoms?</h3>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} required>
              <option value="">Select duration</option>
              <option>Less than an hour</option>
              <option>A few hours</option>
              <option>One to two days</option>
              <option>Several days</option>
              <option>More than a week</option>
            </select>
          </div>

          <div className="form-divider" />

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

          <div className="form-divider" />

          <div className="form-group">
            <h3>4. When do you experience these symptoms?</h3>
            <select value={context} onChange={(e) => setContext(e.target.value)} required>
              <option value="">Select an option</option>
              <option>During physical activity</option>
              <option>After physical activity</option>
              <option>While resting</option>
              <option>During stressful situations</option>
              <option>At different times</option>
            </select>
          </div>

          <div className="form-divider" />

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

          <div className="form-divider" />

          <div className="form-group">
            <h3>6. Additional information (optional)</h3>
            <p className="field-description">
              Add any other context you want included in the assessment.
            </p>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Additional information..."
              rows="4"
            />
          </div>

          {apiError && (
            <div className="form-notice" role="alert">
              <AlertTriangle size={20} />
              <p>{apiError}</p>
            </div>
          )}

          <div className="form-notice">
            <ShieldCheck size={20} />
            <p>
              EarlyAlert is an educational prototype. It does not diagnose
              medical conditions or estimate your personal cardiovascular
              risk. The ML result shown later is generated from a separate
              dataset record, not from your answers.
            </p>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Running demonstration..." : "Submit Information"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </section>

      <footer>
        <div className="brand footer-brand">
          <HeartPulse size={23} />
          <span>Early<span className="brand-accent">Alert</span></span>
        </div>
        <p>Promoting early health awareness through technology.</p>
        <small>
          Educational prototype only. Not a substitute for professional
          medical advice, diagnosis or treatment.
        </small>
      </footer>
    </div>
  );
}

export default App;