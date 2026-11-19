/**
 * COCO 手搖飲 - 官方網站共用腳本 (site.js)
 * 功能包含：
 * 1. 手機版導覽選單開關與無障礙控制 (ARIA)
 * 2. 常見問題 (FAQ) 手風琴展開/收合
 * 3. 錨點平滑滾動與目前頁面導覽標示強化
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordion();
  highlightCurrentPage();
});

/**
 * 1. 手機版選單互動控制
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  let backdrop = document.querySelector('.nav-backdrop');

  if (!toggleBtn || !navMenu) return;

  // 若尚未有遮罩層，動態生成以確保點擊外部可關閉
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  function openMenu() {
    toggleBtn.classList.add('open');
    navMenu.classList.add('open');
    backdrop.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // 防止背景滾動
  }

  function closeMenu() {
    toggleBtn.classList.remove('open');
    navMenu.classList.remove('open');
    backdrop.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // 點擊遮罩關閉
  backdrop.addEventListener('click', closeMenu);

  // 點擊選單內部連結後自動關閉（支援單頁錨點跳轉）
  const menuLinks = navMenu.querySelectorAll('.nav-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // 按下 ESC 鍵關閉選單
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * 2. FAQ 手風琴互動展開/收合
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (!faqQuestions.length) return;

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentItem = btn.closest('.faq-item');
      if (!parentItem) return;

      const isCurrentlyActive = parentItem.classList.contains('active');

      // 可選：關閉其他同層展開的項目
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parentItem) {
          item.classList.remove('active');
          const otherBtn = item.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isCurrentlyActive) {
        parentItem.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        parentItem.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * 3. 強化當前頁面連結高亮
 */
function highlightCurrentPage() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.site-nav .nav-link');

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (!linkHref) return;

    const linkFile = linkHref.split('#')[0].split('/').pop();
    
    // 如果檔案名稱匹配，確保具有 active 類別與 aria-current
    if (linkFile === currentPath || (currentPath === '' && linkFile === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}
