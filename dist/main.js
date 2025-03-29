(()=>{"use strict";var e=function(){return e=Object.assign||function(e){for(var t,n=1,o=arguments.length;n<o;n++)for(var a in t=arguments[n])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e},e.apply(this,arguments)},t={alojamiento:{heroClass:"hero rooms-hero",heroImage:"assets/images/home/header.jpg",heroContent:{title:"Alojamiento en <strong>Finca Termópilas</strong>",subtitle:"Habitaciones cómodas en un entorno natural",ctaText:"RESERVA AHORA",ctaHref:"index.html#contacto"}},catalogo:{heroClass:"hero catalog-hero",heroImage:"assets/images/catalog/header.png",heroContent:{title:"Nuestro Catálogo",subtitle:"Descubre nuestra selección de alojamiento, tours, vinos artesanales y chocolates. Una experiencia completa que combina hospedaje de calidad con productos elaborados con pasión en el corazón del Huila.",ctaText:"",ctaHref:""}},tour:{heroClass:"hero tour-hero",heroImage:"assets/images/tour/section0.jpg",heroContent:{title:"Tour de Vino 🍷 y Chocolate 🍫",subtitle:"Una experiencia sensorial única en Finca Termópilas",ctaText:"RESERVA AHORA",ctaHref:"#main-content"}},coliving:{heroClass:"hero coliving-hero",heroImage:"assets/images/coliving/section0.jpg",heroContent:{title:"Coliving para <strong>Nómadas Digitales</strong>",subtitle:"Trabajo remoto en un paraíso natural",ctaText:"RESERVA TU CUPO",ctaHref:"#coliving-form"}},ubicacion:{heroClass:"hero directions-hero",heroImage:"assets/images/directions/section0.jpg",heroContent:{title:"Cómo Llegar",subtitle:"Instrucciones detalladas para encontrarnos fácilmente",ctaText:"",ctaHref:""}},galeria:{heroClass:"hero gallery-hero",heroImage:"assets/images/gallery/section5-gallery1.jpg",heroContent:{title:"Galería de fotos",subtitle:"Explora nuestra colección de imágenes y descubre la belleza de nuestro alojamiento",ctaText:"Ver Alojamiento",ctaHref:"alojamiento.html"}},blog:{heroClass:"hero blog-hero",heroImage:"assets/images/home/header.jpg",heroContent:{title:"Nuestro Blog",subtitle:"Historias, consejos y experiencias de Finca Termópilas",ctaText:"EXPLORAR",ctaHref:"#main-content"}},404:{heroClass:"hero",heroImage:"assets/images/error/section0.jpg",heroContent:void 0}},n={logoText:"Finca Termópilas",logoIcon:"fas fa-map-marker-alt",navItems:[{text:"Inicio",href:"index.html"},{text:"Alojamiento",href:"alojamiento.html"},{text:"Catálogo",href:"catalogo.html"},{text:"Tour",href:"tour.html"},{text:"Coliving",href:"coliving.html"},{text:"Cómo Llegar",href:"ubicacion.html"},{text:"Galería",href:"galeria.html"},{text:"Blog",href:"blog.html"}],heroContent:{title:"Entorno que <strong>cautiva</strong>",subtitle:"Rivera - Huila 🇨🇴",ctaText:"Ver Alojamiento",ctaHref:"alojamiento.html"},heroClass:"hero",heroImage:"assets/images/home/header.jpg"};function o(){var e,t=document.querySelector(".nav-toggle"),n=document.querySelector(".nav-menu");if(t&&n){var o=t.cloneNode(!0);null===(e=t.parentNode)||void 0===e||e.replaceChild(o,t),o.addEventListener("click",(function(e){e.stopPropagation(),n.classList.toggle("active");var t=n.classList.contains("active");o.setAttribute("aria-expanded",t.toString()),console.log("Toggle clicked, menu active:",t)})),n.addEventListener("touchstart",(function(e){e.stopPropagation()}),{passive:!0}),n.addEventListener("touchmove",(function(e){}),{passive:!0}),document.addEventListener("click",(function(e){var t=e.target;!n.classList.contains("active")||o.contains(t)||n.contains(t)||(n.classList.remove("active"),o.setAttribute("aria-expanded","false"))})),n.querySelectorAll("a").forEach((function(e){e.addEventListener("click",(function(){n.classList.remove("active"),o.setAttribute("aria-expanded","false")}))}))}}function a(e){void 0===e&&(e=n);var t=document.querySelector("header");if(t){if("true"===t.getAttribute("data-static-hero")){var a='\n      <nav class="navbar">\n        <div class="logo">\n          <a href="index.html">\n            <i class="'.concat(e.logoIcon,'"></i>\n            <span>').concat(e.logoText,'</span>\n          </a>\n        </div>\n        <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-menu">\n          <span class="hamburger"></span>\n        </button>\n        <ul class="nav-menu" id="nav-menu">\n          ').concat(e.navItems.map((function(e){return'<li><a href="'.concat(e.href,'"').concat(e.isActive?' class="active"':"",">").concat(e.text,"</a></li>")})).join(""),"\n        </ul>\n      </nav>\n    ");return t.insertAdjacentHTML("afterbegin",a),void o()}e.heroClass&&(t.className=e.heroClass),e.heroImage&&(t.style.backgroundImage="url('".concat(e.heroImage,"')"),t.style.backgroundSize="cover",t.style.backgroundPosition="center");var r=function(e,t,n){if(n||2===arguments.length)for(var o,a=0,r=t.length;a<r;a++)!o&&a in t||(o||(o=Array.prototype.slice.call(t,0,a)),o[a]=t[a]);return e.concat(o||Array.prototype.slice.call(t))}([],e.navItems,!0);r.some((function(e){return"blog.html"===e.href}))||r.push({text:"Blog",href:"blog.html"});var i='\n    <nav class="navbar">\n      <div class="logo">\n        <a href="index.html">\n          <i class="'.concat(e.logoIcon,'"></i>\n          <span>').concat(e.logoText,'</span>\n        </a>\n      </div>\n      <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-menu">\n        <span class="hamburger"></span>\n      </button>\n      <ul class="nav-menu" id="nav-menu">\n        ').concat(r.map((function(e){return'<li><a href="'.concat(e.href,'"').concat(e.isActive?' class="active"':"",">").concat(e.text,"</a></li>")})).join(""),"\n      </ul>\n    </nav>\n  "),c="";if(e.heroContent){var s=e.heroContent.ctaText?'<a href="'.concat(e.heroContent.ctaHref,'" class="cta-button">').concat(e.heroContent.ctaText,"</a>"):"";c='\n      <div class="hero-content">\n        <h1>'.concat(e.heroContent.title,"</h1>\n        <p>").concat(e.heroContent.subtitle,"</p>\n        ").concat(s,"\n      </div>\n    ")}t.innerHTML=i+c,o()}else console.error("Header element not found")}function r(){var o=window.location.pathname,r=(o.split("/").pop()||"").replace(".html","");if(o.includes("/blog/posts/"))console.log("Blog post page detected, skipping header generation");else{var i=JSON.parse(JSON.stringify(n));i.navItems.some((function(e){return"blog.html"===e.href}))||i.navItems.push({text:"Blog",href:"blog.html"}),i.navItems=i.navItems.map((function(t){return e(e({},t),{isActive:t.href.includes(r)})})),r in t&&Object.assign(i,t[r]),a(i)}}var i={location:{title:"¿Cómo llegar?",address:["Km 3.3","Vía las Juntas","Rivera","Huila"],directionsLink:"ubicacion.html"},contact:{title:"¿Tienes preguntas?",description:"Escríbenos para más información",phone:"+573143428579",email:"termopilashuila@gmail.com",socialMedia:[{platform:"Instagram",url:"https://www.instagram.com/alojamientotermopilas/",icon:"fab fa-instagram"},{platform:"Facebook",url:"https://www.facebook.com/termopilashuila/",icon:"fab fa-facebook"},{platform:"WhatsApp",url:"https://wa.link/vscfew",icon:"fab fa-whatsapp"}]},copyright:"© 2025 Finca Termópilas. Todos los derechos reservados."};function c(e){void 0===e&&(e=i);var t=document.querySelector("footer");if(t){var n=e.contact.phone,o="(+57) ".concat(n.slice(3)),a='\n    <div class="footer-content">\n      <div class="location">\n        <h3>'.concat(e.location.title,"</h3>\n        ").concat(e.location.address.map((function(e){return"<p>".concat(e,"</p>")})).join(""),'\n        <a href="').concat(e.location.directionsLink,'" class="directions-link" rel="noopener">\n          <i class="fas fa-map-marker-alt"></i> Ver instrucciones\n        </a>\n      </div>\n      <div class="contact">\n        <h3>').concat(e.contact.title,"</h3>\n        <p>").concat(e.contact.description,'</p>\n        <a href="tel:').concat(e.contact.phone,'"><i class="fas fa-phone"></i> ').concat(o,'</a>\n        <a href="mailto:').concat(e.contact.email,'"><i class="fas fa-envelope"></i> ').concat(e.contact.email,'</a>\n        <div class="social-media">\n          ').concat(e.contact.socialMedia.map((function(e){return'<a href="'.concat(e.url,'" target="_blank" rel="noopener" aria-label="').concat(e.platform,'">\n              <i class="').concat(e.icon,'"></i>\n            </a>')})).join(""),'\n        </div>\n      </div>\n    </div>\n    <div class="footer-bottom">\n      <p>').concat(e.copyright,"</p>\n    </div>\n  ");t.innerHTML=a}else console.error("Footer element not found")}function s(){var e=window.location.pathname.split("/").pop()||"index.html",t=JSON.parse(JSON.stringify(i)),n="Inicio";switch(e){case"alojamiento.html":n="Alojamiento",t.contact.description="Escríbenos para más información o reservas";break;case"catalogo.html":n="Catálogo",t.contact.description="Escríbenos para más información sobre nuestros productos";break;case"tour.html":n="Tour de Vino y Chocolate",t.contact.description="Escríbenos para reservar tu tour";break;case"coliving.html":n="Coliving";break;case"ubicacion.html":n="Ubicación";break;case"galeria.html":n="Galería";break;case"blog.html":n="Blog";break;default:n="Inicio"}var o="Hola. Estaba en la página de ".concat(n," y me gustaría saber más sobre"),a=encodeURIComponent(o),r="https://wa.me/573143428579?text=".concat(a),s=t.contact.socialMedia.findIndex((function(e){return"WhatsApp"===e.platform}));-1!==s&&(t.contact.socialMedia[s].url=r),c(t)}function l(e){var t=e.split(" ");if(4===t.length){var n=parseInt(t[0],10),o={enero:0,febrero:1,marzo:2,abril:3,mayo:4,junio:5,julio:6,agosto:7,septiembre:8,octubre:9,noviembre:10,diciembre:11}[t[2].replace(",","")],a=parseInt(t[3],10);if(!isNaN(n)&&void 0!==o&&!isNaN(a))return new Date(a,o,n)}return new Date(0)}"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/service-worker.js").then((function(e){console.log("ServiceWorker registration successful")})).catch((function(e){console.error("ServiceWorker registration failed:",e)}))})),document.addEventListener("DOMContentLoaded",(function(){var o,d,u,m,g=window.location.pathname.split("/").pop()||"index.html";switch(console.log("Initializing page:",g),window.termopilasHeader={updateConfig:function(o){var r=window.location.pathname;if(r.includes("/blog/posts/"))console.log("Blog post page detected, skipping header update");else{var i=JSON.parse(JSON.stringify(n)),c=r.split("/").pop()||"index.html",s=c.replace(".html","");i.navItems.some((function(e){return"blog.html"===e.href}))||i.navItems.push({text:"Blog",href:"blog.html"}),i.navItems=i.navItems.map((function(t){return t.href.split("#")[0]===c?e(e({},t),{isActive:!0}):t})),s in t&&Object.assign(i,t[s]),Object.assign(i,o),a(i)}},regenerateHeader:function(){window.location.pathname.includes("/blog/posts/")?console.log("Blog post page detected, skipping header regeneration"):r()}},window.termopilasFooter={updateConfig:function(e){var t=JSON.parse(JSON.stringify(i)),n=window.location.pathname.split("/").pop()||"index.html";"alojamiento.html"===n?t.contact.description="Escríbenos para más información o reservas":"tour.html"===n&&(t.contact.description="Escríbenos para reservar tu tour"),Object.assign(t,e),c(t)},regenerateFooter:function(){s()}},r(),s(),o=document.querySelectorAll("[data-animate]"),d=new IntersectionObserver((function(e){e.forEach((function(e){if(e.isIntersecting){var t=e.target,n=t.getAttribute("data-animate");n&&(t.classList.add("animated",n),d.unobserve(t))}}))}),{root:null,rootMargin:"0px",threshold:.1}),o.forEach((function(e){d.observe(e)})),function(){var e=document.querySelector(".navbar");if(e){var t=window.scrollY,n=!1;window.addEventListener("scroll",(function(){n||(window.requestAnimationFrame((function(){var o;(o=window.scrollY)>50?e.classList.add("navbar-scrolled"):e.classList.remove("navbar-scrolled"),Math.abs(o-t)>100&&(o>t?e.classList.add("navbar-hidden"):e.classList.remove("navbar-hidden"),t=o),n=!1})),n=!0)}))}}(),document.querySelectorAll('a[href^="#"]').forEach((function(e){e.addEventListener("click",(function(t){t.preventDefault();var n=e.getAttribute("href");if(n){var o=document.querySelector(n);if(o){var a=document.querySelector(".navbar"),r=a?a.getBoundingClientRect().height:0,i=o.getBoundingClientRect().top+window.scrollY-r;window.scrollTo({top:i,behavior:"smooth"})}}}))})),g){case"galeria.html":!function(){if(document.querySelector(".gallery-grid")){var e=document.getElementById("gallery-lightbox"),t=document.getElementById("lightbox-image"),n=document.getElementById("lightbox-caption"),o=document.getElementById("lightbox-close"),a=document.getElementById("lightbox-prev"),r=document.getElementById("lightbox-next"),i=Array.from(document.querySelectorAll(".gallery-item img")),c=0,s=function(o){if(!(o<0||o>=i.length)){c=o;var a=i[o];t.src=a.src,t.alt=a.alt,n.textContent=a.alt,e.classList.add("active"),document.body.style.overflow="hidden"}},l=function(){e.classList.remove("active"),document.body.style.overflow=""},d=function(){var e=c+1;e>=i.length&&(e=0),s(e)},u=function(){var e=c-1;e<0&&(e=i.length-1),s(e)};i.forEach((function(e,t){e.addEventListener("click",(function(){s(t)}))})),o.addEventListener("click",l),r.addEventListener("click",d),a.addEventListener("click",u),e.addEventListener("click",(function(t){t.target===e&&l()})),document.addEventListener("keydown",(function(t){if(e.classList.contains("active"))switch(t.key){case"Escape":l();break;case"ArrowLeft":u();break;case"ArrowRight":d()}}));var m=0,g=0;e.addEventListener("touchstart",(function(e){m=e.changedTouches[0].screenX}),!1),e.addEventListener("touchend",(function(e){g=e.changedTouches[0].screenX,h()}),!1);var h=function(){g<m-50?d():g>m+50&&u()}}}();break;case"blog.html":u=document.querySelectorAll(".category-button"),m=document.querySelectorAll(".blog-card"),function(){var e=document.querySelector(".blog-grid");if(e){var t=Array.from(document.querySelectorAll(".blog-card"));t.length<=1||(t.sort((function(e,t){var n=e.querySelector(".blog-date"),o=t.querySelector(".blog-date");if(!n||!o)return 0;var a=l(n.textContent||"");return l(o.textContent||"").getTime()-a.getTime()})),t.forEach((function(t){e.appendChild(t)})))}}(),u.forEach((function(e){e.addEventListener("click",(function(){u.forEach((function(e){return e.classList.remove("active")})),e.classList.add("active");var t=e.getAttribute("data-category");m.forEach((function(e){var n=e;if("all"===t)n.style.display="block";else{var o=e.getAttribute("data-categories");o&&o.includes(t)?n.style.display="block":n.style.display="none"}}))}))}));break;case"tour.html":!function(){var e=document.querySelector(".experience-timeline");if(e){var t=Array.from(e.querySelectorAll(".experience-item"));t.forEach((function(e,t){t>=3&&e.classList.add("lazy-hidden")}));var n=function(e){var t;e.classList.remove("lazy-hidden"),e.classList.add("lazy-visible"),console.log("Item revealed:",null===(t=e.querySelector("h3"))||void 0===t?void 0:t.textContent)},o=new IntersectionObserver((function(e){e.forEach((function(e){if(e.isIntersecting){var t=e.target;n(t),o.unobserve(t)}}))}),{root:null,rootMargin:"0px 0px 300px 0px",threshold:.01});t.forEach((function(e,t){var a;t>=3&&(o.observe(e),console.log("Observing item:",null===(a=e.querySelector("h3"))||void 0===a?void 0:a.textContent),setTimeout((function(){var t;e.classList.contains("lazy-hidden")&&(console.log("Fallback revealing item:",null===(t=e.querySelector("h3"))||void 0===t?void 0:t.textContent),n(e),o.unobserve(e))}),5e3+500*(t-3)))}));var a={root:null,rootMargin:"0px 0px 500px 0px",threshold:.01},r=function(e){e.dataset.src&&(e.src=e.dataset.src,e.onload=function(){var t=e.closest(".experience-image");t&&t.classList.remove("loading")})};document.querySelectorAll(".experience-image img").forEach((function(e,t){var n=e,o=n.src;n.src='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',n.dataset.src=o;var i=n.closest(".experience-image");i&&i.classList.add("loading");var c=new IntersectionObserver((function(e){e.forEach((function(e){if(e.isIntersecting){var t=e.target;r(t),c.unobserve(t)}}))}),a);c.observe(n),setTimeout((function(){n.src.includes("data:image")&&(console.log("Fallback loading image:",t),r(n),c.unobserve(n))}),7e3+300*t)}))}}()}!function(){var e=document.querySelector(".testimonials-slider");if(e){var t=e.querySelector(".slider-track"),n=Array.from(e.querySelectorAll(".testimonial-card")),o=e.querySelector(".slider-prev"),a=e.querySelector(".slider-next");if(t&&n.length&&o&&a){var r=0,i=n[0].getBoundingClientRect().width,c=n.length,s=function(){var e=-r*i;t.style.transform="translateX(".concat(e,"px)"),o.classList.toggle("disabled",0===r),a.classList.toggle("disabled",r===c-1)};o.addEventListener("click",(function(){r>0&&(r--,s())})),a.addEventListener("click",(function(){r<c-1&&(r++,s())}));var l,d=0,u=0;e.addEventListener("touchstart",(function(e){d=e.touches[0].clientX}),{passive:!0}),e.addEventListener("touchmove",(function(e){u=e.touches[0].clientX}),{passive:!0}),e.addEventListener("touchend",(function(){var e=u-d;Math.abs(e)>50&&(e>0&&r>0?r--:e<0&&r<c-1&&r++,s())})),s(),window.addEventListener("resize",(function(){clearTimeout(l),l=window.setTimeout((function(){n[0].getBoundingClientRect().width!==i&&location.reload()}),250)}))}}}(),document.querySelectorAll("[data-product-order]").forEach((function(e){e.addEventListener("click",(function(t){t.preventDefault();var n=e.getAttribute("data-product-name")||"Producto",o=encodeURIComponent("¡Hola! Me interesa obtener más información sobre ".concat(n," en Termópilas Huila.")),a="https://wa.me/573138957766?text=".concat(o);window.open(a,"_blank")}))}))}))})();