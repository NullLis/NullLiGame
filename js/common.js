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

// ===== 移动端导航切换 =====
function initNavigation() {
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
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

// ===== 加载联系方式并渲染（仅联系页） =====
async function loadContactInfo() {
    const grid = document.getElementById('contactGrid');
    if (!grid) return;

    try {
        const response = await fetch('../contact.json');
        if (!response.ok) throw new Error('无法加载联系方式');
        const contacts = await response.json();
        renderContacts(contacts, grid);
    } catch (error) {
        grid.innerHTML = '<div class="empty-tip">⚠️ 加载联系方式失败，请稍后重试。</div>';
        console.error('加载 contact.json 出错:', error);
    }
}

function renderContacts(contacts, container) {
    if (!Array.isArray(contacts) || contacts.length === 0) {
        container.innerHTML = '<div class="empty-tip">暂无联系方式。</div>';
        return;
    }

    let html = '';
    contacts.forEach(c => {
        // 如果链接有效，将 text 用作按钮文字；否则显示为普通文本
        let contentHtml = '';
        if (c.link && c.link !== '#') {
            contentHtml = `<a href="${c.link}" target="_blank" class="btn">${c.text}</a>`;
        } else {
            contentHtml = `<p>${c.text}</p>`;
        }

        html += `
            <div class="contact-card">
                <div class="contact-icon">${c.icon}</div>
                <h3>${c.title}</h3>
                ${contentHtml}
            </div>
        `;
    });
    container.innerHTML = html;
}

// ===== 页面初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    applyRandomTheme();
    initNavigation();
    loadProjects();
    loadContactInfo();
});
