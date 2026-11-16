import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import portfolioMarkup from './portfolio.html?raw';
import './styles.css';

const projects = {
  calc: {
    title: 'C Calculator Pro (Desktop)', badge: 'C / GTK App',
    desc: 'A lightweight, performant desktop application created in C using GTK. Supports basic and mathematical operations with robust signal-handling mechanisms and custom expression parsing.',
    tech: ['C', 'C++', 'GTK', 'MSYS2', 'GCC'],
    features: ['Real-time input expression parsing', 'Signal callback mechanism for dynamic GUI buttons', 'Efficient memory management in low-level C']
  },
  sim: {
    title: 'Interactive Logic & Simulation Suite', badge: 'Educational Logic',
    desc: 'A series of sequential logic simulations including traffic light state machines and interactive math quiz engines created to model state flows.',
    tech: ['Scratch', 'Logic Design', 'Event-Driven Flow'],
    features: ['Algorithmic score evaluation', 'Visual traffic light state controller', 'Modular event listener design']
  },
  pos: {
    title: 'C++ POS Cafe System', badge: 'C++ Desktop Application',
    desc: 'A complete Point of Sale (POS) desktop system for cafe operations featuring real-time menu management, transaction processing, receipt generation, and sales logs.',
    tech: ['C++', 'Object-Oriented Programming (OOP)', 'Data Structures'],
    features: ['Order queuing and bill calculations', 'Stock and inventory management', 'Sales reporting and structured transaction logging']
  },
  brand: {
    title: 'Graphic & Team Branding Projects', badge: 'Visual Artwork',
    desc: 'Custom graphic design assets created for athletic and technical engineering groups, including vector logos, typography, crests, and identity branding.',
    tech: ['Vector Design', 'Image Editing', 'Graphic Layout'],
    features: ['Custom athletic & tech crests', 'Scalable vector graphics', 'Clean typography layouts']
  }
};

function App() {
  useEffect(() => {
    const canvas = document.getElementById('bg-canvas');
    const context = canvas?.getContext('2d');
    let frame;
    let particles = [];
    let toastTimer;
    if (!canvas || !context) return undefined;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!particles.length) {
        particles = Array.from({ length: 45 }, () => ({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.2
        }));
      }
    };
    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x = (p.x + p.speedX + canvas.width) % canvas.width;
        p.y = (p.y + p.speedY + canvas.height) % canvas.height;
        context.fillStyle = `rgba(34, 211, 238, ${p.opacity})`;
        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fill();
      });
      frame = requestAnimationFrame(animate);
    };
    resize();
    animate();
    window.addEventListener('resize', resize);

    const toast = (message) => {
      const box = document.getElementById('toast');
      const label = document.getElementById('toast-msg');
      if (!box || !label) return;
      label.textContent = message;
      box.classList.remove('hidden');
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => box.classList.add('hidden'), 3000);
    };
    const copyToClipboard = async (value, label) => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const field = document.createElement('textarea');
        field.value = value;
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        document.execCommand('copy');
        field.remove();
      }
      toast(`${label} copied to clipboard!`);
    };
    const openModal = (key) => {
      const data = projects[key];
      const content = document.getElementById('modal-content');
      if (!data || !content) return;
      content.replaceChildren();
      const badge = document.createElement('span');
      badge.className = 'px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-accent font-mono text-xs';
      badge.textContent = data.badge;
      const title = document.createElement('h3');
      title.className = 'text-xl font-bold text-white mt-2';
      title.textContent = data.title;
      const desc = document.createElement('p');
      desc.className = 'text-slate-300 text-sm leading-relaxed';
      desc.textContent = data.desc;
      const featureBlock = document.createElement('div');
      featureBlock.className = 'space-y-2 pt-2';
      featureBlock.innerHTML = '<h4 class="font-mono text-xs font-bold text-slate-400 uppercase">Key Features</h4>';
      const list = document.createElement('ul');
      list.className = 'space-y-1 text-slate-400 text-xs font-sans';
      data.features.forEach((feature) => {
        const item = document.createElement('li');
        item.className = 'flex items-center gap-2';
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-check text-cyan-accent';
        item.append(icon, document.createTextNode(feature));
        list.append(item);
      });
      featureBlock.append(list);
      const tags = document.createElement('div');
      tags.className = 'pt-4 border-t border-slate-800 flex flex-wrap gap-2 font-mono text-[11px]';
      data.tech.forEach((tech) => {
        const tag = document.createElement('span');
        tag.className = 'px-2.5 py-1 rounded bg-slate-800 text-slate-300';
        tag.textContent = tech;
        tags.append(tag);
      });
      content.append(badge, title, desc, featureBlock, tags);
      document.getElementById('modal')?.classList.remove('hidden');
    };

    // The original page uses inline handlers; expose small adapters for those controls.
    window.copyToClipboard = copyToClipboard;
    window.openModal = openModal;
    window.closeModal = () => document.getElementById('modal')?.classList.add('hidden');
    window.handleFormSubmit = (event) => {
      event.preventDefault();
      toast('Thank you! Your message has been sent.');
      event.currentTarget.reset();
    };

    const menuButton = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const toggleMenu = () => mobileMenu?.classList.toggle('hidden');
    const closeMenu = () => mobileMenu?.classList.add('hidden');
    menuButton?.addEventListener('click', toggleMenu);
    mobileMenu?.querySelectorAll('.mobile-link').forEach((link) => link.addEventListener('click', closeMenu));

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(toastTimer);
      window.removeEventListener('resize', resize);
      menuButton?.removeEventListener('click', toggleMenu);
      mobileMenu?.querySelectorAll('.mobile-link').forEach((link) => link.removeEventListener('click', closeMenu));
      delete window.copyToClipboard;
      delete window.openModal;
      delete window.closeModal;
      delete window.handleFormSubmit;
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: portfolioMarkup }} />;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
