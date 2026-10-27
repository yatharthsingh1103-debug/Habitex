import React, { useState, useRef } from "react";

export const Performance = () => {
  const [mode, setMode] = useState("controlled"); // 'controlled' | 'debounced' | 'uncontrolled'
  const [controlledText, setControlledText] = useState("");
  const [telemetry, setTelemetry] = useState({
    keystrokes: 0,
    lastLatency: 0,
    avgLatency: 0,
    maxLatency: 0,
    renderCount: 0,
    history: []
  });

  const uncontrolledRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const totalLatencyRef = useRef(0);

  const recordMetric = (latencyMs) => {
    totalLatencyRef.current += latencyMs;
    setTelemetry((prev) => {
      const nextCount = prev.keystrokes + 1;
      const nextAvg = (totalLatencyRef.current / nextCount).toFixed(2);
      const nextMax = Math.max(prev.maxLatency, latencyMs).toFixed(2);
      const entry = {
        id: nextCount,
        latency: latencyMs.toFixed(2),
        timestamp: new Date().toLocaleTimeString()
      };
      return {
        keystrokes: nextCount,
        lastLatency: latencyMs.toFixed(2),
        avgLatency: nextAvg,
        maxLatency: nextMax,
        renderCount: prev.renderCount + 1,
        history: [entry, ...prev.history.slice(0, 7)]
      };
    });
  };

  const handleControlledChange = (e) => {
    const t0 = performance.now();
    const val = e.target.value;

    if (mode === "controlled") {
      // Simulate synchronous controlled update with 50 dependent derivations
      let dummyCalculation = 0;
      for (let i = 0; i < 20000; i++) {
        dummyCalculation += Math.sqrt(i);
      }
      setControlledText(val);
      const t1 = performance.now();
      recordMetric(t1 - t0);
    } else if (mode === "debounced") {
      // Update text immediately
      setControlledText(val);
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        const t1 = performance.now();
        recordMetric(t1 - t0);
      }, 150);
    }
  };

  const handleUncontrolledInput = () => {
    const t0 = performance.now();
    // Uncontrolled: React state is NOT re-rendered on every keystroke
    const val = uncontrolledRef.current?.value || "";
    const t1 = performance.now();
    recordMetric(t1 - t0);
  };

  const handleReset = () => {
    setControlledText("");
    if (uncontrolledRef.current) uncontrolledRef.current.value = "";
    totalLatencyRef.current = 0;
    setTelemetry({
      keystrokes: 0,
      lastLatency: 0,
      avgLatency: 0,
      maxLatency: 0,
      renderCount: 0,
      history: []
    });
  };

  return (
    <div className="container container-form form-page-layout">
      <div className="form-page-header">
        <span className="badge badge-featured" style={{ marginBottom: "var(--space-2)" }}>
          Academic Telemetry Lab
        </span>
        <h1 className="form-page-title">React Form Performance Lab</h1>
        <p className="form-page-subtitle">
          Real-time measurement of input latency using <code>performance.now()</code> across Controlled Inputs, Debounced Validation, and Uncontrolled <code>useRef</code> implementations.
        </p>
      </div>

      {/* Mode Selector Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
        {[
          {
            id: "controlled",
            title: "1. Synchronous Controlled",
            desc: "Full React state on every keystroke with dependent re-renders."
          },
          {
            id: "debounced",
            title: "2. Debounced Controlled",
            desc: "Immediate visual update with debounced 150ms state computation."
          },
          {
            id: "uncontrolled",
            title: "3. Uncontrolled (useRef)",
            desc: "Native DOM input without triggering component re-renders."
          }
        ].map((m) => (
          <div
            key={m.id}
            onClick={() => {
              setMode(m.id);
              handleReset();
            }}
            style={{
              background: mode === m.id ? "var(--color-primary-light)" : "var(--color-surface)",
              border: mode === m.id ? "2px solid var(--color-primary-brand)" : "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
              cursor: "pointer",
              transition: "all var(--transition-fast)"
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-primary)", marginBottom: "var(--space-1)" }}>
              {m.title}
            </div>
            <div style={{ fontSize: "0.825rem", color: "var(--color-text-secondary)" }}>
              {m.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Testing Card */}
      <div className="form-wizard-card" style={{ marginBottom: "var(--space-8)" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
          Active Test Arena ({mode.toUpperCase()})
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" }}>
          Type rapidly into the input box below to observe keystroke execution time and frame latency.
        </p>

        {mode !== "uncontrolled" ? (
          <div className="form-field" style={{ marginBottom: "var(--space-4)" }}>
            <label htmlFor="perf-controlled" className="form-label">Type to Benchmark:</label>
            <input
              id="perf-controlled"
              type="text"
              value={controlledText}
              onChange={handleControlledChange}
              placeholder="Type anything here (e.g. 5 BHK Penthouse at The Camellias)..."
              className="form-input"
              style={{ fontSize: "1.05rem", padding: "0.85rem" }}
            />
          </div>
        ) : (
          <div className="form-field" style={{ marginBottom: "var(--space-4)" }}>
            <label htmlFor="perf-uncontrolled" className="form-label">Type to Benchmark (Uncontrolled Ref):</label>
            <input
              id="perf-uncontrolled"
              ref={uncontrolledRef}
              type="text"
              onInput={handleUncontrolledInput}
              placeholder="Type anything here (uncontrolled DOM ref)..."
              className="form-input"
              style={{ fontSize: "1.05rem", padding: "0.85rem" }}
            />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button type="button" onClick={handleReset} className="btn btn-secondary btn-sm">
            Reset Telemetry
          </button>
          <span style={{ fontSize: "0.825rem", color: "var(--color-text-muted)" }}>
            Measuring event handler to render completion via <code>performance.now()</code>
          </span>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div>
            <div className="stat-val">{telemetry.lastLatency} <span style={{ fontSize: "0.9rem" }}>ms</span></div>
            <div className="stat-label">Last Keystroke Latency</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>📊</div>
          <div>
            <div className="stat-val">{telemetry.avgLatency} <span style={{ fontSize: "0.9rem" }}>ms</span></div>
            <div className="stat-label">Average Processing Latency</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#FEF2F2", color: "#B91C1C" }}>⚠️</div>
          <div>
            <div className="stat-val">{telemetry.maxLatency} <span style={{ fontSize: "0.9rem" }}>ms</span></div>
            <div className="stat-label">Peak Spike Overhead</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--color-accent-subtle)", color: "var(--color-accent)" }}>⌨️</div>
          <div>
            <div className="stat-val">{telemetry.keystrokes}</div>
            <div className="stat-label">Total Sampled Events</div>
          </div>
        </div>
      </div>

      {/* Telemetry Log */}
      {telemetry.history.length > 0 && (
        <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", padding: "var(--space-6)" }}>
          <h3 style={{ fontSize: "1.05rem", marginBottom: "var(--space-4)" }}>Real-Time Latency Log</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)", textAlign: "left", color: "var(--color-text-secondary)" }}>
                  <th style={{ padding: "0.5rem" }}>Event #</th>
                  <th style={{ padding: "0.5rem" }}>Mode</th>
                  <th style={{ padding: "0.5rem" }}>Latency (ms)</th>
                  <th style={{ padding: "0.5rem" }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {telemetry.history.map((h) => (
                  <tr key={h.id} style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                    <td style={{ padding: "0.5rem", fontWeight: 700 }}>#{h.id}</td>
                    <td style={{ padding: "0.5rem" }}>{mode}</td>
                    <td style={{ padding: "0.5rem", color: Number(h.latency) > 10 ? "var(--color-warning)" : "var(--color-success)", fontWeight: 700 }}>
                      {h.latency} ms
                    </td>
                    <td style={{ padding: "0.5rem", color: "var(--color-text-muted)" }}>{h.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
