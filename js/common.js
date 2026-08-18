// ===== 公共导航与页脚（统一管理，支持动态路径） =====

// 获取当前页面的路径深度（用于生成相对路径）
function getBasePath() {
    const path = window.location.pathname;
    // 如果当前页面在 html/ 子目录下，返回 '../'
    if (path.includes('/html/')) {
        return '../';
    }
    // 如果在根目录，返回 './'
    return './';
}

const basePath = getBasePath();
// 获取当前页面文件名（用于高亮菜单）
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ===== 生成导航 HTML =====
function getNavbarHTML() {
    return `
    <nav class="navbar">
        <a href="${basePath}index.html" class="nav-logo">🧩 项目集</a>
        <button class="nav-toggle" id="navToggle">☰</button>
        <ul class="nav-links" id="navLinks">
            <li><a href="${basePath}index.html" id="navIndex">首页</a></li>
            <li><a href="${basePath}html/tools.html" id="navTools">🔧 实用工具</a></li>
            <li><a href="${basePath}html/contact.html" id="navContact">联系我们</a></li>
        </ul>
    </nav>`;
}

// ===== 生成页脚 HTML =====
function getFooterHTML() {
    return `
    <div class="footer">
        <div class="footer-links">
            <a href="#">服务条款</a>
            <a href="#">隐私政策</a>
        </div>
        Built with ❤️ &nbsp;|&nbsp; © 2026 Nulllis
    </div>`;
}

// ===== 注入导航和页脚 =====
function initLayout() {
    const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
        navContainer.innerHTML = getNavbarHTML();
        // 高亮当前菜单
        const map = {
            'index.html': 'navIndex',
            'tools.html': 'navTools',
            'contact.html': 'navContact'
        };
        const id = map[currentPage] || 'navIndex';
        const activeLink = document.getElementById(id);
        if (activeLink) activeLink.classList.add('active');
    }

    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = getFooterHTML();
    }

    initNavigation();
}

// ===== 移动端导航切换 =====
function initNavigation() {
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// ===== 随机主题色生成 =====
function applyRandomTheme() {
    const h = Math.floor(Math.random() * 360);
    const s = 60 + Math.floor(Math.random() * 30);
    const l = 45;

    const accent = `hsl(${h}, ${s}%, ${l}%)`;
    const accentDark = `hsl(${h}, ${s + 10}%, ${l - 15}%)`;
    const gradientFrom = `hsl(${h}, 70%, 90%)`;
    const gradientMid1 = `hsl(${h}, 60%, 80%)`;
    const gradientMid2 = `hsl(${h}, 50%, 70%)`;
    const gradientTo = `hsl(${h}, 60%, 60%)`;

    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--accent-dark', accentDark);
    document.documentElement.style.setProperty('--gradient-from', gradientFrom);
    document.documentElement.style.setProperty('--gradient-mid1', gradientMid1);
    document.documentElement.style.setProperty('--gradient-mid2', gradientMid2);
    document.documentElement.style.setProperty('--gradient-to', gradientTo);
}

// ===== 加载项目数据并渲染（仅首页） =====
async function loadProjects() {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;

    try {
        const response = await fetch('games.json');
        if (!response.ok) throw new Error('无法加载项目数据');
        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        grid.innerHTML = '<div class="empty-tip">⚠️ 加载项目数据失败，请稍后重试。</div>';
        console.error('加载 games.json 出错:', error);
    }
}

function renderProjects(projects) {
    const grid = document.getElementById('projectGrid');
    if (!Array.isArray(projects) || projects.length === 0) {
        grid.innerHTML = '<div class="empty-tip">暂无项目，敬请期待 🚧</div>';
        return;
    }

    let html = '';
    projects.forEach(p => {
        html += `
            <div class="card">
                <div class="icon-big">${p.icon}</div>
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <a href="${p.link}" target="_blank" class="btn">查看项目</a>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// ===== 加载联系方式与图片（仅联系页） =====
async function loadContactInfo() {
    const contactGrid = document.getElementById('contactGrid');
    const imageGallery = document.getElementById('imageGallery');
    if (!contactGrid && !imageGallery) return;

    try {
        const response = await fetch('../contact.json');
        if (!response.ok) throw new Error('无法加载联系方式');
        const data = await response.json();

        if (Array.isArray(data)) {
            renderContacts(data, contactGrid);
        } else {
            if (data.contacts && Array.isArray(data.contacts)) {
                renderContacts(data.contacts, contactGrid);
            }
            if (data.images && Array.isArray(data.images)) {
                renderImages(data.images, imageGallery);
            }
        }
    } catch (error) {
        if (contactGrid) {
            contactGrid.innerHTML = '<div class="empty-tip">⚠️ 加载联系方式失败，请稍后重试。</div>';
        }
        console.error('加载 contact.json 出错:', error);
    }
}

function renderContacts(contacts, container) {
    if (!container) return;
    if (!Array.isArray(contacts) || contacts.length === 0) {
        container.innerHTML = '<div class="empty-tip">暂无联系方式。</div>';
        return;
    }

    let html = '';
    contacts.forEach(c => {
        html += `
            <div class="contact-card">
                <div class="contact-icon">${c.icon}</div>
                <h3>${c.title}</h3>
                <p>${c.text}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ===== 渲染多张图片 =====
function renderImages(images, container) {
    if (!container) return;
    if (!Array.isArray(images) || images.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    let html = '';
    images.forEach((img, index) => {
        const alt = img.alt || `图片${index + 1}`;
        html += `
            <div class="image-item">
                <img src="${img.src}" alt="${alt}" class="gallery-image" />
                <p>${alt}</p>
            </div>
        `;
    });
    container.innerHTML = html;

    const overlay = document.getElementById('imageOverlay');
    const overlayImg = document.getElementById('overlayImage');
    const closeBtn = document.getElementById('overlayClose');

    container.querySelectorAll('.gallery-image').forEach(img => {
        img.addEventListener('click', () => {
            overlayImg.src = img.src;
            overlay.style.display = 'flex';
        });
    });

    if (overlay && closeBtn) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target === closeBtn) {
                overlay.style.display = 'none';
            }
        });
        closeBtn.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
    }
}

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initLayout();
    applyRandomTheme();
    loadProjects();
    loadContactInfo();
});
