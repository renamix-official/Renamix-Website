const CONTACT_EMAIL = "YOUR_EMAIL@example.com";
const DOWNLOAD_URL = "YOUR_DOWNLOAD_URL_HERE";
const YOUTUBE_URL = "https://www.youtube.com/@RenamixOfficial";

const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('img');

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('renamix-theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    const icon = themeToggle.querySelector('.theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☾' : '☼';
  }
}

setTheme(root.dataset.theme || 'light');

themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

menuToggle?.addEventListener('click', () => {
  const isOpen = siteNav?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('[data-download]').forEach((link) => {
  link.href = DOWNLOAD_URL;
  if (DOWNLOAD_URL === 'YOUR_DOWNLOAD_URL_HERE') {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.alert('The Renamix download link will be available soon.');
    });
  }
});

document.querySelectorAll('.youtube-link').forEach((link) => {
  if (link.getAttribute('href') === '#youtube') return;
  link.href = YOUTUBE_URL;
});

document.querySelectorAll('.email-link').forEach((link) => {
  const subject = link.dataset.subject || 'Renamix Contact';
  link.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = button.dataset.lightbox || '';
    lightboxImage.alt = button.dataset.alt || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close')?.focus();
  });
});

lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});
