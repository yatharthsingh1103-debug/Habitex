/**
 * IMAGE UPLOAD & VALIDATION MANAGER
 * Supports multi-file selection, drag & drop, file type / size / dimension validation,
 * thumbnail previews, remove action, and cover photo assignment.
 */

class ImageUploadManager {
  constructor(options = {}) {
    this.dropzoneEl = document.getElementById(options.dropzoneId || "image-dropzone");
    this.fileInputEl = document.getElementById(options.fileInputId || "property-images-input");
    this.previewContainerEl = document.getElementById(options.previewContainerId || "image-previews-container");
    this.statusEl = document.getElementById(options.statusId || "image-upload-status");
    this.maxFiles = options.maxFiles || 10;
    this.maxSizeMB = options.maxSizeMB || 5;
    this.minWidth = options.minWidth || 800;
    this.minHeight = options.minHeight || 500;

    this.filesList = []; // Stores { id, file, url, name, size, dimensions }

    this.init();
  }

  init() {
    if (!this.dropzoneEl || !this.fileInputEl) return;

    // File input change
    this.fileInputEl.addEventListener("change", (e) => {
      this.handleFiles(e.target.files);
      this.fileInputEl.value = ""; // Reset for re-selection
    });

    // Dropzone click trigger
    this.dropzoneEl.addEventListener("click", () => {
      this.fileInputEl.click();
    });

    // Drag & drop events
    ["dragenter", "dragover"].forEach(eventName => {
      this.dropzoneEl.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropzoneEl.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(eventName => {
      this.dropzoneEl.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropzoneEl.classList.remove("dragover");
      });
    });

    this.dropzoneEl.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        this.handleFiles(dt.files);
      }
    });
  }

  async handleFiles(files) {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (this.filesList.length >= this.maxFiles) {
        if (window.showToast) {
          window.showToast(`Maximum ${this.maxFiles} photos allowed per listing.`, "warning");
        }
        break;
      }

      // Validate file with FormValidator
      const validation = await window.FormValidator.validateImageFile(file, {
        maxSizeMB: this.maxSizeMB,
        minWidth: this.minWidth,
        minHeight: this.minHeight
      });

      if (!validation.isValid) {
        if (window.showToast) {
          window.showToast(validation.message, "error", 4500);
        } else {
          alert(validation.message);
        }
        continue;
      }

      // Create data entry
      const fileId = "img_" + Math.random().toString(36).substr(2, 9);
      const url = URL.createObjectURL(file);

      this.filesList.push({
        id: fileId,
        file: file,
        url: url,
        name: file.name,
        size: (file.size / 1024).toFixed(0) + " KB",
        dimensions: `${validation.dimensions.width}×${validation.dimensions.height}px`
      });
    }

    this.renderPreviews();
    this.updateStatus();
  }

  removeFile(fileId) {
    const item = this.filesList.find(f => f.id === fileId);
    if (item && item.url) {
      URL.revokeObjectURL(item.url);
    }
    this.filesList = this.filesList.filter(f => f.id !== fileId);
    this.renderPreviews();
    this.updateStatus();
  }

  renderPreviews() {
    if (!this.previewContainerEl) return;
    this.previewContainerEl.innerHTML = "";

    this.filesList.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "image-preview-card";
      card.dataset.id = item.id;

      const isCover = index === 0;

      card.innerHTML = `
        <img src="${item.url}" alt="Property Preview ${index + 1}">
        ${isCover ? `<span class="image-preview-badge">Cover Photo</span>` : ""}
        <div class="image-preview-info">${item.dimensions}</div>
        <button type="button" class="image-remove-btn" aria-label="Remove image" title="Remove image">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;

      card.querySelector(".image-remove-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.removeFile(item.id);
      });

      this.previewContainerEl.appendChild(card);
    });
  }

  updateStatus() {
    if (this.statusEl) {
      this.statusEl.textContent = `${this.filesList.length} of ${this.maxFiles} photos uploaded`;
    }
  }

  getUploadedFiles() {
    return this.filesList;
  }

  clear() {
    this.filesList.forEach(item => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    this.filesList = [];
    this.renderPreviews();
    this.updateStatus();
  }
}

window.ImageUploadManager = ImageUploadManager;
