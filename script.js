// AWS Student Builder Group — NIU website
// Nav toggle + footer year + interactive 3D hero (Three.js) + scroll animations (GSAP).
// No-JS fallback: all content is visible by default; animations only enhance via JS.
// Reduced motion: 3D renders one static frame, GSAP motion is skipped entirely.

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile navigation + footer year ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- 3D hero: floating low-poly shapes + particles ---------- */
  // Procedural geometry only — no model files, so the page stays fast.
  var hero = document.getElementById("home");
  var canvas = document.getElementById("hero-3d");
  if (hero && canvas && window.THREE) {
    try {
      var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.set(0, 0, 14);

      var group = new THREE.Group();
      scene.add(group);

      var wireOrange = new THREE.MeshBasicMaterial({ color: 0xff9900, wireframe: true, transparent: true, opacity: 0.85 });
      var wireGreen = new THREE.MeshBasicMaterial({ color: 0x22c55e, wireframe: true, transparent: true, opacity: 0.6 });
      var wireSlate = new THREE.MeshBasicMaterial({ color: 0x64748b, wireframe: true, transparent: true, opacity: 0.5 });
      var solidOrange = new THREE.MeshStandardMaterial({ color: 0xff9900, roughness: 0.4, metalness: 0.3 });
      var solidSlate = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.4 });

      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      var dir = new THREE.DirectionalLight(0xffffff, 0.9);
      dir.position.set(5, 8, 6);
      scene.add(dir);

      var shapes = [];
      function addShape(geometry, material, x, y, z, speed) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.userData = { baseY: y, speed: speed, phase: Math.random() * Math.PI * 2 };
        group.add(mesh);
        shapes.push(mesh);
        return mesh;
      }

      addShape(new THREE.IcosahedronGeometry(1.6, 0), wireOrange, 5.2, 1.4, -2, 0.9);
      addShape(new THREE.IcosahedronGeometry(1.1, 0), wireGreen, -5.6, -1.2, -1, 0.7);
      addShape(new THREE.TorusGeometry(1.0, 0.28, 10, 28), wireOrange, -4.2, 2.2, -3, 0.6);
      addShape(new THREE.OctahedronGeometry(0.9, 0), solidOrange, 3.4, -2.2, -1, 1.1);
      addShape(new THREE.DodecahedronGeometry(0.8, 0), solidSlate, -2.6, -2.4, -2, 0.8);
      addShape(new THREE.TetrahedronGeometry(0.7, 0), wireSlate, 6.4, -0.6, -4, 1.3);
      addShape(new THREE.IcosahedronGeometry(0.55, 0), wireGreen, 1.8, 2.6, -3, 1.0);
      addShape(new THREE.OctahedronGeometry(0.5, 0), wireSlate, -6.8, 1.0, -4, 0.9);

      function makeParticles(count, color, size, spread) {
        var positions = new Float32Array(count * 3);
        for (var i = 0; i < count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * spread;
          positions[i * 3 + 1] = (Math.random() - 0.5) * (spread * 0.6);
          positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
        }
        var geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        var mat = new THREE.PointsMaterial({ color: color, size: size, transparent: true, opacity: 0.7 });
        var points = new THREE.Points(geo, mat);
        group.add(points);
        return points;
      }
      makeParticles(220, 0xff9900, 0.06, 18);
      makeParticles(160, 0x94a3b8, 0.05, 18);

      var mouseX = 0, mouseY = 0, targetRX = 0, targetRY = 0;
      hero.addEventListener("mousemove", function (e) {
        var rect = hero.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetRY = mouseX * 0.22;
        targetRX = -mouseY * 0.14;
      });

      function resize() {
        var w = hero.clientWidth, h = hero.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      window.addEventListener("resize", resize);
      resize();

      var clock = new THREE.Clock();
      function renderFrame() {
        var t = clock.getElapsedTime();
        shapes.forEach(function (m) {
          m.position.y = m.userData.baseY + Math.sin(t * m.userData.speed + m.userData.phase) * 0.35;
          m.rotation.x += 0.0025;
          m.rotation.y += 0.0035;
        });
        group.rotation.y += (targetRY - group.rotation.y) * 0.04;
        group.rotation.x += (targetRX - group.rotation.x) * 0.04;
        renderer.render(scene, camera);
      }

      if (reduceMotion) {
        renderFrame(); // one static frame, no loop
      } else {
        (function animate() {
          requestAnimationFrame(animate);
          if (!document.hidden) renderFrame();
        })();
      }
    } catch (err) {
      // 3D is decoration: if WebGL fails, drop the canvas and keep the page.
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  }

  /* ---------- GSAP: hero intro + scroll reveals + team counter ---------- */
  // gsap.from() only: without JS (or if the CDN fails) everything stays visible.
  if (window.gsap && !reduceMotion) {
    if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

    window.gsap.from(".hero-content .eyebrow, .hero-content h1, .hero-content .hero-lead, .hero-content .hero-actions, .hero-content .hero-leader", {
      opacity: 0, y: 20, duration: 0.7, stagger: 0.09, ease: "expo.out", clearProps: "all"
    });

    if (window.ScrollTrigger) {
      window.gsap.utils.toArray(".section-kicker, .section h2, .card, .member, .event-card, .steps li, .faq-list details").forEach(function (el) {
        window.gsap.from(el, {
          opacity: 0, y: 14, duration: 0.4, ease: "power1.out", clearProps: "all",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" }
        });
      });

      var stat = document.getElementById("stat-team");
      if (stat) {
        var counter = { v: 0 };
        window.gsap.to(counter, {
          v: 6, duration: 0.9, ease: "power1.out",
          scrollTrigger: { trigger: stat, start: "top 92%", once: true },
          onUpdate: function () { stat.textContent = String(Math.round(counter.v)); }
        });
      }
    }
  }
})();
