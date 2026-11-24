import {
  Activity,
  HeartPulse,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  Info,
  ClipboardList,
  BrainCircuit,
} from "lucide-react";

import "./ResultsDashboard.css";

function ResultsDashboard({ data, onStartAgain }) {
  const {
    symptoms = [],
    duration,
    severity,
    context,
    improving,
    additionalDetails,
    modelResult,
  } = data;

  const predictedClass = modelResult?.predicted_class;
  const modelName = modelResult?.model || "Trained ML model";
  const probabilities = modelResult?.class_probabilities || {};
  const classZeroProbability = Number(probabilities["0"] ?? 0) * 100;
  const classOneProbability = Number(probabilities["1"] ?? 0) * 100;
  const referenceTarget = modelResult?.dataset_reference_target;
  const sampleSource = modelResult?.dataset_source || "Cleaned cardiovascular dataset";

  const factors = [];

  if (context === "During physical activity" || context === "After physical activity") {
    factors.push({
      icon: Activity,
      title: "Physical activity context",
      description:
        "Physical exertion can affect heart rate and energy levels. Symptoms that persist, recur or feel unusual should be assessed by a healthcare professional.",
    });
  }

  if (context === "While resting") {
    factors.push({
      icon: HeartPulse,
      title: "Symptoms while resting",
      description:
        "Symptoms occurring at rest deserve attention, particularly when they are new, persistent or accompanied by other concerning symptoms.",
    });
  }

  if (context === "During stressful situations") {
    factors.push({
      icon: Activity,
      title: "Stress-related context",
      description:
        "Stress can be associated with physical sensations. However, symptoms should not automatically be attributed to stress.",
    });
  }

  if (context === "At different times") {
    factors.push({
      icon: Clock,
      title: "Timing of symptoms",
      description:
        "Symptoms occurring at different times may have different contexts. Keeping track of when they occur can help a healthcare professional assess them.",
    });
  }

  if (duration === "Several days" || duration === "More than a week") {
    factors.push({
      icon: Clock,
      title: "Duration of symptoms",
      description:
        "Symptoms continuing over several days or longer should be discussed with a healthcare professional.",
    });
  }

  if (improving === "No, they have not improved") {
    factors.push({
      icon: AlertTriangle,
      title: "Symptoms have not improved",
      description:
        "Continuing symptoms deserve medical attention. Consider seeking a professional assessment promptly.",
    });
  }

  if (improving === "They come and go") {
    factors.push({
      icon: Activity,
      title: "Intermittent symptoms",
      description:
        "Symptoms that come and go are still important. Note when they occur, how long they last and what you were doing.",
    });
  }

  if (factors.length === 0) {
    factors.push({
      icon: Info,
      title: "General symptom context",
      description:
        "The information provided does not establish a specific contributing factor. A healthcare professional can help evaluate the symptoms.",
    });
  }

  const assessment =
    severity === "Severe"
      ? {
          title: "Prompt medical assessment recommended",
          description:
            "You described your symptoms as severe. Please seek prompt in-person medical assessment. If you have emergency warning signs, seek emergency care immediately.",
          level: "urgent",
        }
      : severity === "Moderate"
      ? {
          title: "Professional assessment advised",
          description:
            "You described your symptoms as moderate. Consider consulting a healthcare professional, especially if symptoms persist or recur.",
          level: "moderate",
        }
      : {
          title: "Continue to monitor your symptoms",
          description:
            "You described your symptoms as mild. Monitor any changes and seek professional advice if they persist, worsen or concern you.",
          level: "normal",
        };

  return (
    <div className="results-page">
      <nav className="results-navbar">
        <a href="#" className="results-brand">
          <div className="results-brand-icon"><HeartPulse size={25} /></div>
          <span>Early<span>Alert</span></span>
        </a>
        <div className="results-nav-label">Health Assessment</div>
        <button className="results-back-button" onClick={onStartAgain}>
          <ArrowLeft size={17} /> Start Again
        </button>
      </nav>

      <main className="results-container">
        <div className="results-header">
          <div className="results-eyebrow">
            <CheckCircle2 size={16} /> INFORMATION ANALYSED
          </div>
          <h1>Your Health Assessment</h1>
          <p>
            Review your submitted symptom information and the separate
            cardiovascular dataset demonstration.
          </p>
        </div>

        <div className="results-disclaimer">
          <Info size={21} />
          <p>
            EarlyAlert is an educational prototype. Symptom observations are
            not a diagnosis. The ML output below comes from a separate
            cardiovascular dataset record and is not a prediction about you.
          </p>
        </div>

        <section className="result-card">
          <div className="result-section-heading">
            <div className="result-section-icon blue"><ClipboardList size={22} /></div>
            <div><span>SECTION 01</span><h2>Submitted Symptoms</h2></div>
          </div>
          <p className="result-description">These are the symptoms and details you submitted.</p>
          <div className="result-symptom-list">
            {symptoms.length ? symptoms.map((symptom) => (
              <div className="result-symptom-tag" key={symptom}>
                <CheckCircle2 size={15} /> {symptom}
              </div>
            )) : <p>No symptoms selected.</p>}
          </div>
          <div className="result-details-grid">
            <div className="result-detail"><span>Duration</span><strong>{duration}</strong></div>
            <div className="result-detail"><span>Self-reported severity</span><strong>{severity}</strong></div>
            <div className="result-detail"><span>Activity context</span><strong>{context}</strong></div>
            <div className="result-detail"><span>Symptom improvement</span><strong>{improving}</strong></div>
          </div>
          {additionalDetails && (
            <div className="additional-details">
              <strong>Additional information</strong>
              <p>{additionalDetails}</p>
            </div>
          )}
        </section>

        <section className="result-card">
          <div className="result-section-heading">
            <div className="result-section-icon purple"><BrainCircuit size={22} /></div>
            <div><span>SECTION 02</span><h2>Cardiovascular ML Model Demonstration</h2></div>
          </div>
          <p className="result-description">
            The trained model was run on an actual record selected from the
            cleaned cardiovascular dataset.
          </p>

          <div className="assessment-box moderate">
            <div className="assessment-status">
              <Activity size={20} />
              <strong>Dataset demonstration completed</strong>
            </div>
            <p>Model used: <strong>{modelName}</strong></p>
            <p>Dataset: <strong>{sampleSource}</strong></p>
            <p>
              Model predicted class:{" "}
              <strong>{predictedClass !== undefined ? `Class ${predictedClass}` : "Not available"}</strong>
            </p>
            {referenceTarget !== undefined && (
              <p>
                Dataset reference label: <strong>Class {referenceTarget}</strong>
              </p>
            )}
          </div>

          <h3 className="result-description">Model class probabilities</h3>
          <div className="result-details-grid">
            <div className="result-detail">
              <span>Class 0 probability</span>
              <strong>{classZeroProbability.toFixed(2)}%</strong>
            </div>
            <div className="result-detail">
              <span>Class 1 probability</span>
              <strong>{classOneProbability.toFixed(2)}%</strong>
            </div>
          </div>
          <p className="assessment-note">
            These probabilities describe the model output for the selected
            dataset record only. They are not a person's actual probability
            of having a medical condition. The dataset reference label, when
            available, is the label stored in the dataset and is not a new
            clinical assessment.
          </p>
        </section>

        <section className="result-card">
          <div className="result-section-heading">
            <div className="result-section-icon purple"><Activity size={22} /></div>
            <div><span>SECTION 03</span><h2>Possible Contributing Factors</h2></div>
          </div>
          <p className="result-description">
            These observations are generated from your symptom answers.
            They do not establish the actual cause of your symptoms.
          </p>
          <div className="factor-list">
            {factors.map((factor, index) => {
              const Icon = factor.icon;
              return (
                <div className="factor-item" key={index}>
                  <div className="factor-icon"><Icon size={21} /></div>
                  <div><h3>{factor.title}</h3><p>{factor.description}</p></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="result-card">
          <div className="result-section-heading">
            <div className="result-section-icon orange"><Stethoscope size={22} /></div>
            <div><span>SECTION 04</span><h2>Preliminary Symptom Guidance</h2></div>
          </div>
          <div className={`assessment-box ${assessment.level}`}>
            <div className="assessment-status">
              <AlertTriangle size={20} /><strong>{assessment.title}</strong>
            </div>
            <p>{assessment.description}</p>
          </div>
          <p className="assessment-note">
            This section uses simple demonstration rules based on the
            self-reported symptom severity. It is separate from the
            cardiovascular machine-learning model.
          </p>
        </section>

        <section className="result-card warning-card">
          <div className="result-section-heading">
            <div className="result-section-icon red"><AlertTriangle size={22} /></div>
            <div><span>SECTION 05</span><h2>Important Warning Signs</h2></div>
          </div>
          <p className="result-description">
            Seek emergency medical attention if you experience any of the following:
          </p>
          <div className="warning-list">
            <div><AlertTriangle size={17} /> Chest pain or pressure</div>
            <div><AlertTriangle size={17} /> Severe difficulty breathing</div>
            <div><AlertTriangle size={17} /> Fainting or loss of consciousness</div>
            <div><AlertTriangle size={17} /> Sudden severe or rapidly worsening symptoms</div>
          </div>
          <div className="emergency-message">
            <strong>Do not wait for an online assessment.</strong>
            <p>
              If you experience these warning signs, seek emergency medical
              care immediately. Call 112 in India or your local emergency number.
            </p>
          </div>
        </section>

        <section className="result-card">
          <div className="result-section-heading">
            <div className="result-section-icon green"><ShieldCheck size={22} /></div>
            <div><span>SECTION 06</span><h2>Recommended Medical Guidance</h2></div>
          </div>
          <div className="guidance-list">
            <div className="guidance-item">
              <CheckCircle2 size={20} />
              <div><strong>Pay attention to changes</strong><p>Observe whether symptoms persist, return or become more severe.</p></div>
            </div>
            <div className="guidance-item">
              <CheckCircle2 size={20} />
              <div><strong>Consult a healthcare professional</strong><p>Discuss persistent, recurring or concerning symptoms with a qualified professional.</p></div>
            </div>
            <div className="guidance-item">
              <CheckCircle2 size={20} />
              <div><strong>Share your symptom history</strong><p>Explain when symptoms started, their duration, severity and the circumstances in which they occur.</p></div>
            </div>
          </div>
        </section>

        <div className="results-bottom">
          <ShieldCheck size={27} />
          <h2>Your health deserves attention.</h2>
          <p>This platform promotes awareness and encourages timely professional medical attention.</p>
          <button className="results-restart-button" onClick={onStartAgain}>
            <ArrowLeft size={17} /> Start a New Assessment
          </button>
          <small>EarlyAlert · Educational Prototype Only</small>
        </div>
      </main>
    </div>
  );
}

export default ResultsDashboard;
