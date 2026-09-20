"use client";

import { useEffect } from "react";

export function AdminEyeToggle() {
  useEffect(() => {
    const attachEyeToggle = () => {
      const passwordInputs = document.querySelectorAll<HTMLInputElement>(
        'input[type="password"], input[data-is-password="true"]'
      );

      passwordInputs.forEach((input) => {
        if (input.dataset.eyeAttached === "true") return;
        input.dataset.eyeAttached = "true";

        const parent = input.parentElement;
        if (!parent) return;

        // Ensure container is created
        let container = parent;
        if (!parent.classList.contains("dsh-password-container")) {
          container = document.createElement("div");
          container.className = "dsh-password-container";
          parent.insertBefore(container, input);
          container.appendChild(input);
        }

        // Create Eye Button
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "dsh-eye-btn";
        btn.setAttribute("aria-label", "Hiện/Ẩn mật khẩu");
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
          e.stopPropagation();
          const eyeOpen = btn.querySelector<HTMLElement>(".eye-open");
          const eyeClosed = btn.querySelector<HTMLElement>(".eye-closed");

          if (input.type === "password") {
            input.type = "text";
            input.dataset.isPassword = "true";
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

    const attachChangePwMenu = () => {
      if (document.querySelector(".dsh-change-pw-link")) return;

      const navContainer =
        document.querySelector(".nav__scroll") ||
        document.querySelector("aside.nav") ||
        document.querySelector("nav.nav") ||
        document.querySelector("aside[class*='nav']") ||
        document.querySelector("aside.sidebar nav") ||
        document.querySelector("aside.sidebar") ||
        document.querySelector(".nav-group")?.parentElement ||
        document.querySelector("nav");

      if (!navContainer) return;

      const group = document.createElement("div");
      group.className = "nav-group dsh-account-nav-group";
      group.style.marginTop = "1.25rem";
      group.style.paddingTop = "0.75rem";
      group.style.borderTop = "1px solid #e2e8f0";

      group.innerHTML = `
        <div class="nav-group__title" style="font-size:0.75rem; font-weight:700; color:#087443; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.4rem; padding:0 0.5rem;">Tài khoản</div>
        <a href="/admin/change-password" class="nav__link dsh-change-pw-link" style="display:flex; align-items:center; gap:8px; padding:0.55rem 0.85rem; color:#087443; font-weight:600; text-decoration:none; border-radius:8px; background-color:#eaf6ef; transition:all 0.2s ease;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>Đổi mật khẩu</span>
        </a>
      `;

      navContainer.appendChild(group);
    };

    const attachViewWebsiteBtn = () => {
      if (document.querySelector(".dsh-view-website-btn")) return;

      const navHeader =
        document.querySelector(".nav__header") ||
        document.querySelector("aside.nav") ||
        document.querySelector(".nav__scroll") ||
        document.querySelector("aside") ||
        document.querySelector("nav");

      if (!navHeader) return;

      const btnContainer = document.createElement("div");
      btnContainer.className = "dsh-view-website-wrapper";
      btnContainer.style.padding = "0.75rem 0.85rem 0.5rem 0.85rem";
      btnContainer.style.marginBottom = "0.5rem";

      btnContainer.innerHTML = `
        <a href="/" target="_blank" rel="noopener noreferrer" class="dsh-view-website-btn" style="display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:0.65rem 1rem; color:#ffffff; background-color:#087443; font-weight:600; font-size:0.85rem; text-decoration:none; border-radius:10px; box-shadow:0 2px 8px rgba(8,116,67,0.25); transition:all 0.2s ease;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Quay lại Trang Web</span>
        </a>
      `;

      if (navHeader.firstChild) {
        navHeader.insertBefore(btnContainer, navHeader.firstChild);
      } else {
        navHeader.appendChild(btnContainer);
      }
    };

    attachEyeToggle();
    attachChangePwMenu();
    attachViewWebsiteBtn();

    const timer = setInterval(() => {
      attachEyeToggle();
      attachChangePwMenu();
      attachViewWebsiteBtn();
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return null;
}
