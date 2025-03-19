({931:function(){var e=this&&this.__assign||function(){return e=Object.assign||function(e){for(var t,o=1,n=arguments.length;o<n;o++)for(var a in t=arguments[o])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e},e.apply(this,arguments)},t=this&&this.__spreadArray||function(e,t,o){if(o||2===arguments.length)for(var n,a=0,r=t.length;a<r;a++)!n&&a in t||(n||(n=Array.prototype.slice.call(t,0,a)),n[a]=t[a]);return e.concat(n||Array.prototype.slice.call(t))},o={logoText:"Finca Termópilas",logoIcon:"fas fa-map-marker-alt",navItems:[{text:"Inicio",href:"index.html"},{text:"Alojamiento",href:"alojamiento.html"},{text:"Tour",href:"tour.html"},{text:"Coliving",href:"coliving.html"},{text:"Cómo Llegar",href:"ubicacion.html"},{text:"Galería",href:"galeria.html"},{text:"Blog",href:"blog.html"}],heroContent:{title:"Entorno que <strong>cautiva</strong>",subtitle:"Rivera - Huila 🇨🇴",ctaText:"Ver Alojamiento",ctaHref:"alojamiento.html"},heroClass:"hero",heroImage:"assets/images/home/section0-hero.jpg"},n={location:{title:"¿Cómo llegar?",address:["Km 3.3","Vía las Juntas","Rivera","Huila"],directionsLink:"ubicacion.html"},contact:{title:"¿Tienes preguntas?",description:"Escríbenos para más información",phone:"+573143428579",email:"termopilashuila@gmail.com",socialMedia:[{platform:"Instagram",url:"https://www.instagram.com/alojamientotermopilas/",icon:"fab fa-instagram"},{platform:"Facebook",url:"https://www.facebook.com/termopilashuila/",icon:"fab fa-facebook"},{platform:"WhatsApp",url:"https://wa.link/vscfew",icon:"fab fa-whatsapp"}]},copyright:"© 2025 Finca Termópilas. Todos los derechos reservados."};function a(e){void 0===e&&(e=o);var n=document.querySelector("header");if(n){e.heroClass&&(n.className=e.heroClass),e.heroImage&&(n.style.backgroundImage="url('".concat(e.heroImage,"')"),n.style.backgroundSize="cover",n.style.backgroundPosition="center");var a=t([],e.navItems,!0);a.some((function(e){return"blog.html"===e.href}))||a.push({text:"Blog",href:"blog.html"});var i='\n    <nav class="navbar">\n      <div class="logo">\n        <a href="index.html">\n          <i class="'.concat(e.logoIcon,'"></i>\n          <span>').concat(e.logoText,'</span>\n        </a>\n      </div>\n      <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-menu">\n        <span class="hamburger"></span>\n      </button>\n      <ul class="nav-menu" id="nav-menu">\n        ').concat(a.map((function(e){return'<li><a href="'.concat(e.href,'"').concat(e.isActive?' class="active"':"",">").concat(e.text,"</a></li>")})).join(""),"\n      </ul>\n    </nav>\n  "),s="";if(e.heroContent){var c=e.heroContent.ctaText?'<a href="'.concat(e.heroContent.ctaHref,'" class="cta-button">').concat(e.heroContent.ctaText,"</a>"):"";s='\n      <div class="hero-content">\n        <h1>'.concat(e.heroContent.title,"</h1>\n        <p>").concat(e.heroContent.subtitle,"</p>\n        ").concat(c,"\n      </div>\n    ")}n.innerHTML=i+s,r()}else console.error("Header element not found")}function r(){var e,t=document.querySelector(".nav-toggle"),o=document.querySelector(".nav-menu");if(t&&o){var n=t.cloneNode(!0);null===(e=t.parentNode)||void 0===e||e.replaceChild(n,t),n.addEventListener("click",(function(e){e.stopPropagation(),o.classList.toggle("active");var t=o.classList.contains("active");n.setAttribute("aria-expanded",t.toString()),console.log("Toggle clicked, menu active:",t)})),o.addEventListener("touchstart",(function(e){e.stopPropagation()}),{passive:!0}),o.addEventListener("touchmove",(function(e){}),{passive:!0}),document.addEventListener("click",(function(e){var t=e.target;!o.classList.contains("active")||n.contains(t)||o.contains(t)||(o.classList.remove("active"),n.setAttribute("aria-expanded","false"))})),o.querySelectorAll("a").forEach((function(e){e.addEventListener("click",(function(){o.classList.remove("active"),n.setAttribute("aria-expanded","false")}))}))}}function i(){var t=window.location.pathname,n=t.split("/").pop()||"index.html";if(t.includes("/blog/posts/"))console.log("Blog post page detected, skipping header generation");else{var r=JSON.parse(JSON.stringify(o));r.navItems.some((function(e){return"blog.html"===e.href}))||r.navItems.push({text:"Blog",href:"blog.html"}),r.navItems=r.navItems.map((function(t){return t.href.split("#")[0]===n?e(e({},t),{isActive:!0}):t})),"alojamiento.html"===n?(r.heroClass="hero rooms-hero",r.heroImage="assets/images/rooms/section0.jpg",r.heroContent={title:"Alojamiento",subtitle:"Habitaciones cómodas en un entorno natural",ctaText:"RESERVA AHORA",ctaHref:"index.html#contacto"}):"tour.html"===n?(r.heroClass="hero tour-hero",r.heroImage="assets/images/tour/section0.jpg",r.heroContent={title:"Tour de Vino 🍷 y Chocolate 🍫",subtitle:"Una experiencia sensorial única en Finca Termópilas",ctaText:"RESERVA AHORA",ctaHref:"#main-content"}):"coliving.html"===n?(r.heroClass="hero coliving-hero",r.heroImage="assets/images/coliving/section0.jpg",r.heroContent={title:"Coliving para <strong>Nómadas Digitales</strong>",subtitle:"Trabajo remoto en un paraíso natural",ctaText:"RESERVA TU CUPO",ctaHref:"#coliving-form"}):"ubicacion.html"===n?(r.heroClass="hero directions-hero",r.heroImage="assets/images/directions/section0.jpg",r.heroContent={title:"Cómo Llegar",subtitle:"Instrucciones para encontrarnos",ctaText:"",ctaHref:""}):"galeria.html"===n?(r.heroClass="hero gallery-hero",r.heroImage="assets/images/gallery/section5-gallery1.jpg",r.heroContent={title:"Galería",subtitle:"Explora nuestra colección de imágenes y descubre la belleza de nuestro alojamiento",ctaText:"",ctaHref:""}):"blog.html"===n?(r.heroClass="hero blog-hero",r.heroImage="assets/images/home/section0-hero.jpg",r.heroContent={title:"Nuestro Blog",subtitle:"Historias, consejos y experiencias de Finca Termópilas",ctaText:"EXPLORAR",ctaHref:"#main-content"}):"404.html"===n&&(r.heroClass="hero",r.heroImage="assets/images/error/section0.jpg",r.heroContent=void 0),a(r)}}function s(e){void 0===e&&(e=n);var t=document.querySelector("footer");if(t){var o='\n    <div class="footer-content">\n      <div class="location">\n        <h3>'.concat(e.location.title,"</h3>\n        ").concat(e.location.address.map((function(e){return"<p>".concat(e,"</p>")})).join(""),'\n        <a href="').concat(e.location.directionsLink,'" class="directions-link" rel="noopener">\n          <i class="fas fa-map-marker-alt"></i> Ver instrucciones\n        </a>\n      </div>\n      <div class="contact">\n        <h3>').concat(e.contact.title,"</h3>\n        <p>").concat(e.contact.description,'</p>\n        <a href="tel:').concat(e.contact.phone,'"><i class="fas fa-phone"></i> (').concat(e.contact.phone.substring(0,4),") ").concat(e.contact.phone.substring(4),'</a>\n        <a href="mailto:').concat(e.contact.email,'"><i class="fas fa-envelope"></i> ').concat(e.contact.email,'</a>\n        <div class="social-media">\n          ').concat(e.contact.socialMedia.map((function(e){return'<a href="'.concat(e.url,'" target="_blank" rel="noopener" aria-label="').concat(e.platform,'">\n              <i class="').concat(e.icon,'"></i>\n            </a>')})).join(""),'\n        </div>\n      </div>\n    </div>\n    <div class="footer-bottom">\n      <p>').concat(e.copyright,"</p>\n    </div>\n  ");t.innerHTML=o}else console.error("Footer element not found")}function c(){var e=window.location.pathname.split("/").pop()||"index.html",t=JSON.parse(JSON.stringify(n));"alojamiento.html"===e?t.contact.description="Escríbenos para más información o reservas":"tour.html"===e&&(t.contact.description="Escríbenos para reservar tu tour"),s(t)}document.addEventListener("DOMContentLoaded",(function(){var e,t;i(),c(),r(),window.location.pathname.includes("tour.html")&&function(){var e=document.querySelector(".experience-timeline");if(e){var t=Array.from(e.querySelectorAll(".experience-item"));t.forEach((function(e,t){t>=3&&e.classList.add("lazy-hidden")}));var o=function(e){var t;e.classList.remove("lazy-hidden"),e.classList.add("lazy-visible"),console.log("Item revealed:",null===(t=e.querySelector("h3"))||void 0===t?void 0:t.textContent)},n=new IntersectionObserver((function(e){e.forEach((function(e){if(e.isIntersecting){var t=e.target;o(t),n.unobserve(t)}}))}),{root:null,rootMargin:"0px 0px 300px 0px",threshold:.01});t.forEach((function(e,t){var a;t>=3&&(n.observe(e),console.log("Observing item:",null===(a=e.querySelector("h3"))||void 0===a?void 0:a.textContent),setTimeout((function(){var t;e.classList.contains("lazy-hidden")&&(console.log("Fallback revealing item:",null===(t=e.querySelector("h3"))||void 0===t?void 0:t.textContent),o(e),n.unobserve(e))}),5e3+500*(t-3)))}));var a={root:null,rootMargin:"0px 0px 500px 0px",threshold:.01},r=function(e){e.dataset.src&&(e.src=e.dataset.src,e.onload=function(){var t=e.closest(".experience-image");t&&t.classList.remove("loading")})};document.querySelectorAll(".experience-image img").forEach((function(e,t){var o=e,n=o.src;o.src='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',o.dataset.src=n;var i=o.closest(".experience-image");i&&i.classList.add("loading");var s=new IntersectionObserver((function(e){e.forEach((function(e){if(e.isIntersecting){var t=e.target;r(t),s.unobserve(t)}}))}),a);s.observe(o),setTimeout((function(){o.src.includes("data:image")&&(console.log("Fallback loading image:",t),r(o),s.unobserve(o))}),7e3+300*t)}))}}(),function(){if(document.querySelector(".gallery-grid")){var e=document.getElementById("gallery-lightbox"),t=document.getElementById("lightbox-image"),o=document.getElementById("lightbox-caption"),n=document.getElementById("lightbox-close"),a=document.getElementById("lightbox-prev"),r=document.getElementById("lightbox-next"),i=Array.from(document.querySelectorAll(".gallery-item img")),s=0,c=function(n){if(!(n<0||n>=i.length)){s=n;var a=i[n];t.src=a.src,t.alt=a.alt,o.textContent=a.alt,e.classList.add("active"),document.body.style.overflow="hidden"}},l=function(){e.classList.remove("active"),document.body.style.overflow=""},u=function(){var e=s+1;e>=i.length&&(e=0),c(e)},d=function(){var e=s-1;e<0&&(e=i.length-1),c(e)};i.forEach((function(e,t){e.addEventListener("click",(function(){c(t)}))})),n.addEventListener("click",l),r.addEventListener("click",u),a.addEventListener("click",d),e.addEventListener("click",(function(t){t.target===e&&l()})),document.addEventListener("keydown",(function(t){if(e.classList.contains("active"))switch(t.key){case"Escape":l();break;case"ArrowLeft":d();break;case"ArrowRight":u()}}));var m=0,h=0;e.addEventListener("touchstart",(function(e){m=e.changedTouches[0].screenX}),!1),e.addEventListener("touchend",(function(e){h=e.changedTouches[0].screenX,g()}),!1);var g=function(){h<m-50?u():h>m+50&&d()}}}(),window.location.pathname.includes("blog.html")&&(e=document.querySelectorAll(".category-button"),t=document.querySelectorAll(".blog-card"),e.forEach((function(o){o.addEventListener("click",(function(){e.forEach((function(e){return e.classList.remove("active")})),o.classList.add("active");var n=o.getAttribute("data-category");t.forEach((function(e){var t=e;if("all"===n)t.style.display="block";else{var o=e.getAttribute("data-categories");o&&o.includes(n)?t.style.display="block":t.style.display="none"}}))}))})));var o=document.querySelector(".hero-content");o&&(o.style.opacity="0",setTimeout((function(){o.style.transition="opacity 1s ease-out",o.style.opacity="1"}),300));var n=document.querySelector(".nav-toggle"),a=document.querySelector(".nav-menu");n&&a&&(n.setAttribute("aria-expanded","false"),n.setAttribute("aria-controls","nav-menu"),a.setAttribute("id","nav-menu"));var s=document.createElement("a");s.href="#main-content",s.className="skip-link",s.textContent="Saltar al contenido principal",document.body.insertBefore(s,document.body.firstChild);var l=document.querySelector("#alojamiento");l&&(l.setAttribute("id","main-content"),l.setAttribute("tabindex","-1"))})),document.querySelectorAll('a[href^="#"]').forEach((function(e){e.addEventListener("click",(function(e){e.preventDefault();var t=this.getAttribute("href");if(t){var o=document.querySelector(t);o&&(o.scrollIntoView({behavior:"smooth",block:"start"}),history.pushState(null,"",t))}}))}));var l=document.querySelectorAll(".section:not(.tour-experience)"),u=new IntersectionObserver((function(e,t){e.forEach((function(e){if(e.isIntersecting){var o=e.target;o.style.opacity="1",o.style.transform="translateY(0)",t.unobserve(e.target)}}))}),{root:null,threshold:.1,rootMargin:"0px"});l.forEach((function(e){var t=e;t.style.opacity="0",t.style.transform="translateY(20px)",t.style.transition="opacity 0.6s ease-out, transform 0.6s ease-out",u.observe(e)}));var d,m,h=document.querySelector(".testimonials-slider"),g=!1;h&&(h.addEventListener("mousedown",(function(e){g=!0,d=e.pageX-h.offsetLeft,m=h.scrollLeft})),h.addEventListener("mouseleave",(function(){g=!1})),h.addEventListener("mouseup",(function(){g=!1})),h.addEventListener("mousemove",(function(e){if(g){e.preventDefault();var t=2*(e.pageX-h.offsetLeft-d);h.scrollLeft=m-t}})),h.addEventListener("touchstart",(function(e){g=!0,d=e.touches[0].pageX-h.offsetLeft,m=h.scrollLeft})),h.addEventListener("touchend",(function(){g=!1})),h.addEventListener("touchmove",(function(e){if(g){e.preventDefault();var t=2*(e.touches[0].pageX-h.offsetLeft-d);h.scrollLeft=m-t}}))),document.querySelectorAll(".order-button").forEach((function(e){e.addEventListener("click",(function(){var e=this.closest(".product-card");if(e){var t=e.querySelector(".product-overlay h3"),o=e.querySelector(".product-overlay .price");if(t&&o){var n=t.textContent||"",a=o.textContent||"",r="Hola, me gustaría obtener información sobre ".concat(n," (").concat(a,")"),i="https://wa.me/573143428579?text=".concat(encodeURIComponent(r));window.open(i,"_blank")}}}))}));var f=document.querySelector(".navbar");if(f&&window.addEventListener("scroll",(function(){window.scrollY>50?f.style.background="rgba(0, 0, 0, 0.95)":f.style.background="rgba(0, 0, 0, 0.8)"})),"loading"in HTMLImageElement.prototype)document.querySelectorAll('img[loading="lazy"]').forEach((function(e){e.dataset.src&&(e.src=e.dataset.src)}));else{var v=document.createElement("script");v.src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js",document.body.appendChild(v),document.querySelectorAll('img[loading="lazy"]').forEach((function(e){e.classList.add("lazyload"),e.dataset.src&&e.setAttribute("data-src",e.dataset.src)}))}"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/service-worker.js").then((function(e){console.log("Service Worker registered with scope:",e.scope)})).catch((function(e){console.error("Service Worker registration failed:",e)}))})),window.termopilasHeader={updateConfig:function(t){var n=window.location.pathname;if(n.includes("/blog/posts/"))console.log("Blog post page detected, skipping header update");else{var r=JSON.parse(JSON.stringify(o)),i=n.split("/").pop()||"index.html";r.navItems.some((function(e){return"blog.html"===e.href}))||r.navItems.push({text:"Blog",href:"blog.html"}),r.navItems=r.navItems.map((function(t){return t.href.split("#")[0]===i?e(e({},t),{isActive:!0}):t})),"alojamiento.html"===i?(r.heroClass="hero rooms-hero",r.heroImage="assets/images/rooms/section0.jpg",r.heroContent={title:"Alojamiento en <strong>Finca Termópilas</strong>",subtitle:"Habitaciones cómodas en un entorno natural",ctaText:"RESERVA AHORA",ctaHref:"index.html#contacto"}):"tour.html"===i?(r.heroClass="hero tour-hero",r.heroImage="assets/images/tour/section0.jpg",r.heroContent={title:"Tour de Vino 🍷 y Chocolate 🍫",subtitle:"Una experiencia sensorial única en Finca Termópilas",ctaText:"RESERVA AHORA",ctaHref:"#main-content"}):"ubicacion.html"===i?(r.heroClass="hero directions-hero",r.heroImage="assets/images/directions/section0.jpg",r.heroContent={title:"Cómo Llegar a Finca Termópilas",subtitle:"Instrucciones detalladas para encontrarnos fácilmente",ctaText:"",ctaHref:""}):"galeria.html"===i?(r.heroClass="hero gallery-hero",r.heroImage="assets/images/gallery/section5-gallery1.jpg",r.heroContent={title:"Galería de Finca Termópilas",subtitle:"Explora nuestra colección de imágenes y descubre la belleza de nuestro alojamiento",ctaText:"Ver Alojamiento",ctaHref:"alojamiento.html"}):"blog.html"===i?(r.heroClass="hero blog-hero",r.heroImage="assets/images/home/section0-hero.jpg",r.heroContent={title:"Nuestro Blog",subtitle:"Historias, consejos y experiencias de Finca Termópilas",ctaText:"EXPLORAR",ctaHref:"#main-content"}):"404.html"===i&&(r.heroClass="hero",r.heroImage="assets/images/error/section0.jpg",r.heroContent=void 0),Object.assign(r,t),a(r)}},regenerateHeader:function(){window.location.pathname.includes("/blog/posts/")?console.log("Blog post page detected, skipping header regeneration"):i()}},window.termopilasFooter={updateConfig:function(e){var t=JSON.parse(JSON.stringify(n)),o=window.location.pathname.split("/").pop()||"index.html";"alojamiento.html"===o?t.contact.description="Escríbenos para más información o reservas":"tour.html"===o&&(t.contact.description="Escríbenos para reservar tu tour"),Object.assign(t,e),s(t)},regenerateFooter:function(){c()}}}})[931]();