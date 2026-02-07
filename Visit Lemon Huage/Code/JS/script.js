const PRODUCTS = [
    {
        id: "lh-tonometer",
        title: "Тонометр LemonCare",
        category: "Диагностика",
        price: "Товар Жонундо",
        image: "../../PHOTO/AD - 1.jpg",
        shortHint: "Короткое Описание",
        description:
            "Описание Товара",
        format: "Жидкое приминение",
        specs: ["Экран: LCD", "Питание: батарейки/USB", "Память: 2 профиля"],
        note: "Перед применением ознакомьтесь с инструкцией.",
    },
    {
        id: "lh-antiseptic",
        title: "Антисептик LemonClean",
        category: "Гигиена",
        price: "Товар Жонундо",
        image: "../../PHOTO/AD - 2.jpg",
        shortHint: "Короткое Описание",
        description:
            "Описание Товара",
        format: "Спрей",
        specs: ["Объём: 100 мл", "Назначение: руки/поверхности", "Флакон: компактный"],
        note: "Избегайте попадания в глаза. Хранить в недоступном для детей месте.",
    },
    {
        id: "lh-bandage",
        title: "Эластичный бинт LemonFlex",
        category: "Первая помощь",
        price: "Товар Жонундо",
        image: "../../PHOTO/AD - 3.jpg",
        shortHint: "Короткое Описание",
        description:
            "Описание Товара",
        format: "Спрей",
        specs: ["Длина: 2 м", "Ширина: 8 см", "Эластичность: высокая"],
        note: "Не перетягивайте. При боли/онемении ослабьте фиксацию.",
    },
    {
        id: "lh-thermo",
        title: "Термометр LemonTemp",
        category: "Диагностика",
        price: "Товар Жонундо",
        image: "../../PHOTO/AD - 4.jpg",
        shortHint: "Короткое Описание",
        description:
            "Описание Товара",
        format: "Гель",
        specs: ["Время измерения: ~60 сек", "Сигнал: звуковой", "Корпус: лёгкий"],
        note: "Дезинфицируйте наконечник после каждого использования.",
    },
];

// -------- helpers --------
const qs = (sel, root = document) => root.querySelector(sel);

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function uniq(arr) {
    return [...new Set(arr)];
}

function getProductById(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
}

function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

// -------- rendering catalog --------
function renderCategories(products) {
    const categorySelect = qs("#category");
    if (!categorySelect) return;

    const categories = uniq(products.map((p) => p.category)).sort((a, b) =>
        a.localeCompare(b, "ru")
    );

    categorySelect.innerHTML = `<option value="all">Все</option>`;
    for (const c of categories) {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        categorySelect.appendChild(opt);
    }
}

function productCardTemplate(p) {
    const title = escapeHtml(p.title);
    const category = escapeHtml(p.category);
    const price = escapeHtml(p.price || "");
    const hint = escapeHtml(p.shortHint || "Нажмите, чтобы открыть описание");
    const description = escapeHtml(p.description || "");
    const img = escapeHtml(p.image || "");
    const id = escapeHtml(p.id);

    return `
    <article class="card" data-id="${id}" tabindex="0" role="button" aria-expanded="false">
      <div class="card__imgWrap">
        <img class="card__img" src="${img}" alt="${title}" loading="lazy" />
      </div>

      <div class="card__body">
        <div class="card__top">
          <h3 class="card__title">${title}</h3>
          <span class="card__tag">${category}</span>
        </div>
        <p class="card__descHint">${hint}</p>
      </div>

      <div class="card__details" hidden aria-hidden="true">
        <div class="details__row">
          <span class="price">${price}</span>
          <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end">
            <button class="miniBtn" type="button" data-more="1" data-id="${id}" tabindex="-1">Узнать подробнее</button>
          </div>
        </div>
        <p class="details__text">${description}</p>
      </div>
    </article>
  `;
}

function renderProducts(products) {
    const grid = qs("#productsGrid");
    if (!grid) return;
    grid.innerHTML = products.map(productCardTemplate).join("");
}

function applyFilters() {
    const searchEl = qs("#search");
    const categoryEl = qs("#category");
    if (!searchEl || !categoryEl) return;

    const searchValue = searchEl.value.trim().toLowerCase();
    const categoryValue = categoryEl.value;

    const filtered = PRODUCTS.filter((p) => {
        const inCategory = categoryValue === "all" || p.category === categoryValue;
        const text = `${p.title} ${p.shortHint || ""} ${p.description || ""}`.toLowerCase();
        const inSearch = !searchValue || text.includes(searchValue);
        return inCategory && inSearch;
    });

    renderProducts(filtered);
    wireCatalogUI();
}

// -------- smooth accordion animation --------
function setDetailsMaxHeight(details, px) {
    details.style.maxHeight = typeof px === "number" ? `${px}px` : "";
}

function openDetailsAnimated(details) {
    if (!details) return;

    details.hidden = false;
    details.setAttribute("aria-hidden", "false");

    details.classList.remove("is-open");
    setDetailsMaxHeight(details, 0);

    requestAnimationFrame(() => {
        const target = details.scrollHeight + 8;
        setDetailsMaxHeight(details, target);
        details.classList.add("is-open");
    });

    const onEnd = (e) => {
        if (e.propertyName !== "max-height") return;
        details.removeEventListener("transitionend", onEnd);
        setDetailsMaxHeight(details, null);
    };
    details.addEventListener("transitionend", onEnd);
}

function closeDetailsAnimated(details) {
    if (!details || details.hidden) return;

    const current = details.scrollHeight;
    setDetailsMaxHeight(details, current);

    requestAnimationFrame(() => {
        details.classList.remove("is-open");
        setDetailsMaxHeight(details, 0);
    });

    const onEnd = (e) => {
        if (e.propertyName !== "max-height") return;
        details.removeEventListener("transitionend", onEnd);

        details.hidden = true;
        details.setAttribute("aria-hidden", "true");
        setDetailsMaxHeight(details, null);
    };
    details.addEventListener("transitionend", onEnd);
}

// -------- accordion in cards --------
function closeAllCards(scope = document) {
    scope.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("card--open");
        card.setAttribute("aria-expanded", "false");

        const details = card.querySelector(".card__details");
        if (details) closeDetailsAnimated(details);

        card.querySelectorAll('[data-more="1"]').forEach((el) => {
            if (el.tagName === "BUTTON") el.setAttribute("tabindex", "-1");
        });
    });
}

function openCard(card, scope = document) {
    closeAllCards(scope);

    card.classList.add("card--open");
    card.setAttribute("aria-expanded", "true");

    const details = card.querySelector(".card__details");
    if (details) openDetailsAnimated(details);

    card.querySelectorAll('[data-more="1"]').forEach((el) => {
        if (el.tagName === "BUTTON") el.setAttribute("tabindex", "0");
    });

    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function toggleCard(card, scope = document) {
    const details = card.querySelector(".card__details");
    const isOpen = details ? !details.hidden : card.classList.contains("card--open");
    if (isOpen) closeAllCards(scope);
    else openCard(card, scope);
}

// -------- modal (“page” of product) --------
function setModalOpen(isOpen) {
    const modal = qs("#productModal");
    if (!modal) return;

    if (isOpen) {
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    } else {
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
}

function fillModal(p) {
    qs("#modalImg").src = p.image || "";
    qs("#modalImg").alt = p.title || "";

    qs("#modalCategory").textContent = p.category || "";
    qs("#modalTitle").textContent = p.title || "";
    qs("#modalPrice").textContent = p.price || "";
    qs("#modalDesc").textContent = p.description || "";

    const format = p.format || "Шаблон";
    const formatEl = qs("#modalFormat");
    if (formatEl) formatEl.textContent = format;

    const openPage = qs("#modalOpenPage");
    if (openPage) openPage.href = `./product.html?id=${encodeURIComponent(p.id)}`;
}

function openProductModalById(id) {
    const p = getProductById(id);
    if (!p) return;
    fillModal(p);
    setModalOpen(true);
}

// -------- product.html fill --------
function fillProductPage() {
    const id = getQueryParam("id");
    if (!id) return;

    const p = getProductById(id);
    if (!p) return;

    const img = qs("#productImg");
    if (img) {
        img.src = p.image || "";
        img.alt = p.title || "";
    }

    const cat = qs("#productCategory");
    if (cat) cat.textContent = p.category || "";

    const title = qs("#productTitle");
    if (title) title.textContent = p.title || "";

    const price = qs("#productPrice");
    if (price) price.textContent = p.price || "";

    const desc = qs("#productDesc");
    if (desc) desc.textContent = p.description || "";

    document.title = `${p.title} — Lemon Huage`;
}

// -------- effects --------
function enableCursorGlow() {
    const root = document.documentElement;
    const onMove = (e) => {
        root.style.setProperty("--mx", `${e.clientX}px`);
        root.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
}

function enableCardTilt(grid) {
    const MAX = 8;

    grid.querySelectorAll(".card").forEach((card) => {
        const onMove = (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            const ry = (px - 0.5) * (MAX * 2);
            const rx = (0.5 - py) * (MAX * 2);

            card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
            card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
        };

        const onLeave = () => {
            card.style.setProperty("--rx", `0deg`);
            card.style.setProperty("--ry", `0deg`);
        };

        card.addEventListener("pointermove", onMove, { passive: true });
        card.addEventListener("pointerleave", onLeave, { passive: true });
    });
}

function enableReveal(grid) {
    const cards = grid.querySelectorAll(".card");

    if (!("IntersectionObserver" in window)) {
        cards.forEach((c) => c.classList.add("is-in"));
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            for (const ent of entries) {
                if (ent.isIntersecting) {
                    ent.target.classList.add("is-in");
                    io.unobserve(ent.target);
                }
            }
        },
        { threshold: 0.12 }
    );

    cards.forEach((card) => io.observe(card));
}

// -------- catalog wiring --------
function wireCatalogUI() {
    const grid = qs("#productsGrid");
    if (!grid) return;

    const freshGrid = grid.cloneNode(true);
    grid.parentNode.replaceChild(freshGrid, grid);

    freshGrid.addEventListener("click", (e) => {
        const moreBtn = e.target && e.target.closest ? e.target.closest('[data-more="1"]') : null;
        if (moreBtn) {
            e.preventDefault();
            openProductModalById(moreBtn.getAttribute("data-id"));
            return;
        }

        const card = e.target && e.target.closest ? e.target.closest(".card") : null;
        if (!card) return;

        toggleCard(card, freshGrid);
    });

    freshGrid.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;

        const card = e.target && e.target.closest ? e.target.closest(".card") : null;
        if (!card) return;

        e.preventDefault();
        toggleCard(card, freshGrid);
    });

    enableCardTilt(freshGrid);
    enableReveal(freshGrid);
}

// -------- modal wiring --------
function wireModalUI() {
    const modal = qs("#productModal");
    if (!modal) return;

    modal.addEventListener("click", (e) => {
        const close = e.target && e.target.closest ? e.target.closest('[data-close="true"]') : null;
        if (close) setModalOpen(false);
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setModalOpen(false);
    });
}

// -------- init --------
function init() {
    document.documentElement.classList.add("js");

    const year = qs("#year");
    if (year) year.textContent = new Date().getFullYear();

    enableCursorGlow();

    if (qs("#productsGrid")) {
        renderCategories(PRODUCTS);
        renderProducts(PRODUCTS);
        wireCatalogUI();
        wireModalUI();

        const searchEl = qs("#search");
        const categoryEl = qs("#category");
        if (searchEl) searchEl.addEventListener("input", applyFilters);
        if (categoryEl) categoryEl.addEventListener("change", applyFilters);
    }

    fillProductPage();
}

init();