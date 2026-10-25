/**
 * PERFORMANCE BENCHMARKING & LATENCY SUITE
 * Measures real-time input latency and event processing overhead using performance.now().
 * Compares unoptimized DOM updates vs debounced updates vs batched updates.
 */

const PerformanceBenchmarker = {
  currentMode: "unoptimized", // 'unoptimized' | 'debounced' | 'batched'
  debounceTimer: null,
  batchQueue: [],
  isBatchScheduled: false,

  metrics: {
    keystrokeCount: 0,
    totalProcessingTime: 0,
    minLatency: Infinity,
    maxLatency: 0,
    domMutations: 0,
    history: []
  },

  init() {
    this.bindModes();
    this.bindInput();
    this.resetTelemetry();
  },

  bindModes() {
    document.querySelectorAll(".perf-mode-card").forEach(card => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".perf-mode-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        this.currentMode = card.dataset.mode;
        this.resetTelemetry();
        window.showToast(`Switched benchmarking strategy to: ${card.querySelector(".perf-mode-title").textContent}`, "info");
      });
    });
  },

  bindInput() {
    const input = document.getElementById("perf-test-input");
    const clearBtn = document.getElementById("perf-clear-btn");

    if (input) {
      input.addEventListener("input", (e) => this.handleInputEvent(e));
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (input) input.value = "";
        this.resetTelemetry();
      });
    }
  },

  handleInputEvent(e) {
    const startTime = performance.now();
    const textVal = e.target.value;

    if (this.currentMode === "unoptimized") {
      // Unoptimized: Synchronously performs 50 heavy dependent DOM manipulations on EVERY keystroke
      this.simulateHeavyDomWork(textVal, 40);
      const duration = performance.now() - startTime;
      this.recordMeasurement(duration, 40);
    } else if (this.currentMode === "debounced") {
      // Debounced: Postpones DOM updates until user stops typing for 250ms
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        const debounceStart = performance.now();
        this.simulateHeavyDomWork(textVal, 40);
        const duration = performance.now() - debounceStart;
        this.recordMeasurement(duration, 40);
      }, 250);

      // Keystroke itself is recorded with minimal overhead
      const instantDuration = performance.now() - startTime;
      this.recordMeasurement(instantDuration, 0, true);
    } else if (this.currentMode === "batched") {
      // Batched via requestAnimationFrame
      this.batchQueue.push(textVal);

      if (!this.isBatchScheduled) {
        this.isBatchScheduled = true;
        requestAnimationFrame(() => {
          const batchStart = performance.now();
          const latestVal = this.batchQueue[this.batchQueue.length - 1];
          this.batchQueue = [];
          this.simulateHeavyDomWork(latestVal, 40);
          this.isBatchScheduled = false;
          const duration = performance.now() - batchStart;
          this.recordMeasurement(duration, 40);
        });
      }

      const instantDuration = performance.now() - startTime;
      this.recordMeasurement(instantDuration, 0, true);
    }
  },

  simulateHeavyDomWork(text, itemCount = 40) {
    const container = document.getElementById("simulated-dependents-list");
    if (!container) return;

    // Trigger real layout calculations & DOM writes
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= itemCount; i++) {
      const item = document.createElement("div");
      item.style.padding = "2px 4px";
      item.style.borderBottom = "1px solid var(--color-border-subtle)";
      item.textContent = `Dependent field #${i} [calc: ${(text.length * i * 1.414).toFixed(1)}] -> "${text.slice(-8)}"`;
      fragment.appendChild(item);
    }

    container.appendChild(fragment);
  },

  recordMeasurement(durationMs, domMutationsCount, isIntermediate = false) {
    this.metrics.keystrokeCount++;
    this.metrics.totalProcessingTime += durationMs;
    this.metrics.domMutations += domMutationsCount;

    if (durationMs < this.metrics.minLatency) this.metrics.minLatency = durationMs;
    if (durationMs > this.metrics.maxLatency) this.metrics.maxLatency = durationMs;

    this.metrics.history.unshift({
      id: this.metrics.keystrokeCount,
      duration: durationMs.toFixed(3),
      mutations: domMutationsCount,
      mode: this.currentMode,
      timestamp: new Date().toLocaleTimeString()
    });

    if (this.metrics.history.length > 25) {
      this.metrics.history.pop();
    }

    this.updateDisplay();
  },

  updateDisplay() {
    const avg = this.metrics.keystrokeCount > 0
      ? (this.metrics.totalProcessingTime / this.metrics.keystrokeCount).toFixed(3)
      : "0.000";

    const last = this.metrics.history[0] ? this.metrics.history[0].duration : "0.000";
    const max = this.metrics.maxLatency > 0 ? this.metrics.maxLatency.toFixed(3) : "0.000";

    // Update telemetry numbers
    document.getElementById("telemetry-last-latency").textContent = last;
    document.getElementById("telemetry-avg-latency").textContent = avg;
    document.getElementById("telemetry-max-latency").textContent = max;
    document.getElementById("telemetry-dom-count").textContent = this.metrics.domMutations;

    // Render log table
    const tableBody = document.getElementById("perf-log-tbody");
    if (tableBody) {
      tableBody.innerHTML = this.metrics.history.map(item => `
        <tr>
          <td>#${item.id}</td>
          <td><strong style="color: ${Number(item.duration) > 10 ? 'var(--color-error)' : 'var(--color-success)'};">${item.duration} ms</strong></td>
          <td>${item.mutations} elements</td>
          <td><span class="badge ${item.mode === 'unoptimized' ? 'badge-error' : (item.mode === 'debounced' ? 'badge-warning' : 'badge-success')}">${item.mode}</span></td>
          <td>${item.timestamp}</td>
        </tr>
      `).join("");
    }
  },

  resetTelemetry() {
    this.metrics = {
      keystrokeCount: 0,
      totalProcessingTime: 0,
      minLatency: Infinity,
      maxLatency: 0,
      domMutations: 0,
      history: []
    };
    this.updateDisplay();
    const dependentsList = document.getElementById("simulated-dependents-list");
    if (dependentsList) dependentsList.innerHTML = "<div style='color:var(--color-text-muted); padding: 0.5rem;'>Type in the input above to begin telemetry measurements...</div>";
  }
};

window.PerformanceBenchmarker = PerformanceBenchmarker;
