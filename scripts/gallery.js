// =======================
//     GALERIA Dinâmica
// =======================

document.addEventListener("DOMContentLoaded", () => {
  // === Mapeamento de IDs de containers → pastas físicas ===
  const categorias = {
    ilustracoes: "illustration",
    motion: "motion",
    projetos: "design"
  };

  Object.entries(categorias).forEach(([id, pastaCategoria]) => {
    const container = document.getElementById(`gallery-${id}`);
    if (!container) return;

    // ** Importante: retirei a barra inicial '/' para funcionar no Live-Server **
    const urlDaPasta = `assets/galeria/${pastaCategoria}/`;

    fetch(urlDaPasta)
      .then(res => res.text())
      .then(html => {
        // DEBUG: inspecione o HTML retornado pelo Live-Server
        console.groupCollapsed(`Conteúdo retornado de “${urlDaPasta}”`);
        console.log(html);
        console.groupEnd();

        // Cria elemento temporário para “parsear” o HTML
        const temp = document.createElement("div");
        temp.innerHTML = html;

        // Extrai todos os <a href="..."> que apontam a um jpg/png/gif...
        const imagens = [...temp.querySelectorAll("a")]
          .map(a => a.getAttribute("href"))
          .filter(href =>
            href &&
            /\.(jpe?g|png|gif|webp)$/i.test(href)
          )
          .map(nomeArquivo => {
            // Extrai o número antes do “-”. Se não tiver número, uso 999 para deixá-lo no final.
            const numero = parseInt(nomeArquivo.split("-")[0], 10);
            return {
              path: `${urlDaPasta}${nomeArquivo}`,
              prioridade: isNaN(numero) ? 999 : numero
            };
          })
          // Só quero prioridades de 1 a 5 (página principal)
          .filter(item => item.prioridade >= 1 && item.prioridade <= 5)
          .sort((a, b) => a.prioridade - b.prioridade);

        // Se não encontrar NENHUMA <a> com imagem, avisa no console:
        if (imagens.length === 0) {
          console.warn(`Não encontrei JPGs/PNGs em “${urlDaPasta}”.`);
        }

        // Cria e anexa cada <img> no container
        imagens.forEach(({ path }) => {
          const imgEl = document.createElement("img");
          imgEl.src = path;
          imgEl.alt = ""; // se quiser, preencha algo significativo
          imgEl.loading = "lazy";
          imgEl.classList.add("fadeInUp"); // se quiser animação de fade-in
          container.appendChild(imgEl);
        });
      })
      .catch(err => {
        console.error(`Erro ao carregar pasta “${urlDaPasta}”:`, err);
      });
  });
});

// =======================
//     MODO ESCURO (caso você já tenha)
// =======================
const darkToggleBtn = document.getElementById("dark-toggle");
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
  darkToggleBtn.querySelector("span").innerText = "light_mode";
}
darkToggleBtn?.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  darkToggleBtn.querySelector("span").innerText = isDark ? "light_mode" : "dark_mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// =======================
//    MENU RESPONSIVO
// =======================
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// =======================
// HEADER BEHAVIOR & SCROLL-TOP
// =======================
(() => {
  const header = document.querySelector('.site-header');
  const scrollTopBtn = document.getElementById('scroll-top');
  let lastScroll = 0;
  let ticking = false;

  const handleScroll = () => {
    const currentScroll = window.scrollY;

    // 1) Esconder header ao rolar pra baixo
    if (currentScroll > lastScroll && currentScroll > 80) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }

    // 2) Mostrar / esconder scroll-to-top
    if (currentScroll > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll);

  // Ao clicar → scroll suave ao topo
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
