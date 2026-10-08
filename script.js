const S = window.SITE, $$ = (q) => document.querySelectorAll(q);
const wa = (m) => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(m || S.mensagem)}`;
const mapa = encodeURIComponent(S.endereco);
$$("[data-wa]").forEach((a) => { a.href = wa(); a.target = "_blank"; a.rel = "noopener"; });
$$("[data-txt]").forEach((e) => { e.textContent = S[e.dataset.txt] ?? ""; });
$$("[data-ano]").forEach((e) => { e.textContent = new Date().getFullYear(); });
$$("[data-mapa]").forEach((f) => { f.src = `https://www.google.com/maps?q=${mapa}&z=16&output=embed`; });
$$("[data-rota]").forEach((a) => { a.href = `https://www.google.com/maps/dir/?api=1&destination=${mapa}`; a.target = "_blank"; a.rel = "noopener"; });
$$("[data-waze]").forEach((a) => { a.href = `https://waze.com/ul?q=${mapa}&navigate=yes`; a.target = "_blank"; a.rel = "noopener"; });
$$("[data-copiar]").forEach((b) => { b.onclick = async () => { try { await navigator.clipboard.writeText(S.endereco); b.textContent = "Copiado!"; } catch {} }; });
// Horário de funcionamento + "Aberto agora / Fechado agora"
const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const hm = (h) => h.replace(":", "h"), min = (t) => +t.slice(0, 2) * 60 + +t.slice(3);
const lista = document.getElementById("horas");
if (lista && S.horarios) {
  const hoje = new Date().getDay(), h = S.horarios[hoje], agora = new Date().getHours() * 60 + new Date().getMinutes();
  lista.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => `<li class="${d === hoje ? "hoje" : ""}"><span>${dias[d]}</span><span>${S.horarios[d] ? hm(S.horarios[d][0]) + " às " + hm(S.horarios[d][1]) : "Fechado"}</span></li>`).join("");
  const st = document.getElementById("status");
  if (st) st.textContent = !h ? "Fechado hoje" : agora < min(h[0]) ? `Fechado agora · abre hoje às ${hm(h[0])}` : agora < min(h[1]) ? `Aberto agora · fecha às ${hm(h[1])}` : "Fechado agora";
}
// Menu: destaca a seção visível
const links = [...$$(".nav-list a[href^='#']")];
if (links.length) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = document.querySelector(a.hash); if (s) io.observe(s); });
}
// Setas do carrossel
$$("[data-carr]").forEach((b) => { b.onclick = () => { const c = document.querySelector(b.dataset.carr); c.scrollBy({ left: +b.dataset.dir * (c.firstElementChild.offsetWidth + 16), behavior: "smooth" }); }; });
// Formulário de contato -> WhatsApp (sem backend)
const f = document.getElementById("form-wa");
if (f) f.addEventListener("submit", (e) => { e.preventDefault(); const d = new FormData(f); window.open(wa(`Olá! Meu nome é ${d.get("nome")}. ${d.get("msg")}`), "_blank", "noopener"); });
// Aviso de cookies
try { if (!localStorage.getItem("ck")) { const d = document.createElement("div"); d.className = "cookie"; d.innerHTML = `<p>${S.cookie || "Usamos cookies só para melhorar sua experiência no site."}</p><button class="btn peq">OK</button>`; d.querySelector("button").onclick = () => { localStorage.setItem("ck", 1); d.remove(); }; document.body.append(d); } } catch {}
// Dados estruturados para o Google
const ld = document.createElement("script"); ld.type = "application/ld+json";
ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": S.tipoSchema || "LocalBusiness", name: S.nome, url: location.href, telephone: S.telefone, address: S.endereco });
document.head.append(ld);
