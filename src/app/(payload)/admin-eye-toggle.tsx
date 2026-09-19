"use client";

import { useEffect } from "react";

export function AdminEyeToggle() {
  useEffect(() => {
    const attachEyeToggle = () => {
      const passwordInputs = document.querySelectorAll<HTMLInputElement>('input[type="password"]');

      passwordInputs.forEach((input) => {
        // Avoid duplicate wrapping
        if (input.dataset.eyeAttached === "true") return;
        input.dataset.eyeAttached = "true";

        const parent = input.parentElement;
        if (!parent) return;

        // Create container if not already created
        let container = parent;
        if (!parent.classList.contains("dsh-password-container")) {
          container = document.createElement("div");
          container.className = "dsh-password-container";
          parent.insertBefore(container, input);
          container.appendChild(input);
        }

        // Create Toggle Button
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "dsh-eye-btn";
        btn.ariaLabel = "Hiện/Ẩn mật khẩu";
        btn.innerHTML = `
          <svg class="eye-open" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <svg class="eye-closed" style="display:none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
            <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
            <line x1="2" x2="22" y1="2" y2="22"/>
          </svg>
        `;

        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const eyeOpen = btn.querySelector<HTMLElement>(".eye-open");
          const eyeClosed = btn.querySelector<HTMLElement>(".eye-closed");

          if (input.type === "password") {
            input.type = "text";
            if (eyeOpen) eyeOpen.style.display = "none";
            if (eyeClosed) eyeClosed.style.display = "inline";
          } else {
            input.type = "password";
            if (eyeOpen) eyeOpen.style.display = "inline";
            if (eyeClosed) eyeClosed.style.display = "none";
          }
        });

        container.appendChild(btn);
      });
    };

    attachEyeToggle();
    const timer = setInterval(attachEyeToggle, 500);
    return () => clearInterval(timer);
  }, []);

  return null;
}
