"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface LandingPageProps {
  onLoginClick: () => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0B] text-white selection:bg-brand-500/30">
      
      {/* ── Background Elements ── */}
      {/* Subtle radial gradient to illuminate center */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[120px]" />
      
      {/* Navbar */}
      <nav className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-md border border-white/5">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nextflow</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            type="button" 
            onClick={onLoginClick} 
            className="text-sm font-medium text-white/70 transition hover:text-white"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={onLoginClick}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Start Building
          </button>
        </div>
      </nav>

      {/* ── Hero Content ── */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-brand-400 shadow-[0_0_10px_#38bdf8]" />
          Powered by Gemini 2.5 Flash
        </motion.div>

        {/* Hero Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1000px] text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl"
          style={{ lineHeight: 1.1 }}
        >
          Visual AI <br />
          <span className="bg-gradient-to-r from-brand-300 via-white to-brand-300 bg-clip-text text-transparent opacity-90 blur-[0.3px]">
            in real-time.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-[600px] text-lg font-medium text-white/50 sm:text-xl"
        >
          Design, connect, and execute multi-node AI workflows in a stunning drag-and-drop canvas. 
          No terminal required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={onLoginClick}
            className="group flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.02] hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Open Canvas
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {/* ── Complex Multi-Node Abstract Visual ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 h-[500px] w-full max-w-[1000px] hidden md:block" // Hidden on very small screens for cleanliness, but complex on desktop
        >
          {/* Multiple complex connecting lines */}
          <svg className="absolute left-0 top-0 -z-10 h-full w-full overflow-visible opacity-[0.25]" viewBox="0 0 1000 500">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
               <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Trigger -> Code */}
            <path
              d="M 150,250 C 300,250 350,120 500,120"
              fill="none" stroke="url(#grad1)" strokeWidth="3" strokeDasharray="8 8"
              className="animate-[dash_3s_linear_infinite]"
            />
            {/* Trigger -> Filter */}
            <path
              d="M 150,250 C 300,250 350,380 500,380"
              fill="none" stroke="url(#grad2)" strokeWidth="3" strokeDasharray="8 8"
              className="animate-[dash_3s_linear_infinite]"
            />
            {/* Code -> Slack */}
            <path
              d="M 500,120 C 650,120 700,120 850,120"
              fill="none" stroke="url(#grad4)" strokeWidth="3" strokeDasharray="8 8"
              className="animate-[dash_3s_linear_infinite]"
            />
            {/* Filter -> AI Analysis */}
            <path
              d="M 500,380 C 650,380 700,280 850,280"
              fill="none" stroke="url(#grad3)" strokeWidth="3" strokeDasharray="8 8"
              className="animate-[dash_3s_linear_infinite]"
            />
          </svg>

          {/* Node 1: Webhook Trigger */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[20px] top-[190px]"
          >
            <MockNode type="TRIGGER" label="Webhook Intercept" borderColor="border-emerald-500/40" glow="shadow-[0_0_30px_rgba(16,185,129,0.15)]" />
          </motion.div>

          {/* Node 2: Data Parser */}
          <motion.div
            animate={{ y: [6, -4, 6] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute left-[380px] top-[60px]"
          >
            <MockNode type="CODE" label="Data Parser" borderColor="border-amber-500/40" glow="shadow-[0_0_30px_rgba(245,158,11,0.15)]" />
          </motion.div>

          {/* Node 3: Condition */}
          <motion.div
            animate={{ y: [-4, 6, -4] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute left-[380px] top-[320px]"
          >
            <MockNode type="CONDITION" label="High Priority Filter" borderColor="border-purple-500/40" glow="shadow-[0_0_30px_rgba(168,85,247,0.15)]" />
          </motion.div>

          {/* Node 4: AI Analysis */}
          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute left-[730px] top-[220px]"
          >
            <MockNode type="AI" label="Gemini Analysis" borderColor="border-blue-500/50" glow="shadow-[0_0_40px_rgba(59,130,246,0.2)]" />
          </motion.div>

          {/* Node 5: Notification */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute left-[730px] top-[60px]"
          >
            <MockNode type="ACTION" label="Slack Alert" borderColor="border-red-500/40" glow="shadow-[0_0_30px_rgba(239,68,68,0.15)]" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Marquee Section ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] border-t border-white/5 pt-20 pb-10">
        <div className="px-6 md:px-12 mb-12">
           <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl max-w-2xl">
             The industry's best AI models.<br/>
             <span className="text-white/50">In one single workflow.</span>
           </h2>
        </div>
        
        {/* Infinite Scroll Container */}
        <div className="relative flex w-full overflow-hidden bg-black/20 py-8">
           {/* Fade overlay masks */}
           <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0B] to-transparent z-10" />
           <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0B] to-transparent z-10" />
           
           <div className="flex animate-marquee min-w-max items-center gap-20 px-10">
              <MarqueeItem icon="✧" name="Gemini 2.5 Flash" />
              <MarqueeItem icon="✦" name="Gemini 2.5 Pro" />
              <MarqueeItem icon="⟠" name="Claude 3.5 Sonnet" />
              <MarqueeItem icon="⎊" name="GPT-4o" />
              <MarqueeItem icon="⚛" name="Llama 3" />
              <MarqueeItem icon="❀" name="Mistral Large" />
              <MarqueeItem icon="֎" name="Cohere Command R" />
              
              {/* Duplicate set for infinite loop illusion */}
              <MarqueeItem icon="✧" name="Gemini 2.5 Flash" />
              <MarqueeItem icon="✦" name="Gemini 2.5 Pro" />
              <MarqueeItem icon="⟠" name="Claude 3.5 Sonnet" />
              <MarqueeItem icon="⎊" name="GPT-4o" />
              <MarqueeItem icon="⚛" name="Llama 3" />
              <MarqueeItem icon="❀" name="Mistral Large" />
              <MarqueeItem icon="֎" name="Cohere Command R" />
           </div>
        </div>
      </div>

      {/* ── Bento Box Feature Grid ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 py-24">
        <div className="grid auto-rows-[240px] grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[280px]">
          
          {/* R1: Instant execution - Wide */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative col-span-1 overflow-hidden rounded-[24px] bg-slate-900 shadow-2xl md:col-span-2"
          >
            <img src="/landing/instant_execution.png" alt="Speed" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-8">
              <h3 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Instant execution</h3>
              <p className="mt-2 text-sm font-medium text-white/70">Warp speed node execution engine</p>
            </div>
          </motion.div>

          {/* R1: Gemini Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center justify-center rounded-[24px] bg-[#111113] p-8 text-center border border-white/5 shadow-2xl"
          >
             <h3 className="text-6xl font-extrabold tracking-tighter text-white">2.5</h3>
             <p className="mt-2 font-semibold text-white/60">Gemini Flash</p>
          </motion.div>

          {/* R1: Sync Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center rounded-[24px] bg-[#111113] p-8 text-center border border-white/5 shadow-2xl"
          >
             <h3 className="text-5xl font-extrabold tracking-tighter text-white">Sync</h3>
             <p className="mt-2 font-semibold text-white/60">Saved workflows</p>
          </motion.div>

          {/* R2: Eye */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative col-span-1 overflow-hidden rounded-[24px] bg-slate-900 shadow-2xl"
          >
            <img src="/landing/gemini_engine.png" alt="AI Agent" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-4xl font-extrabold tracking-tight text-white">Agentic</h3>
              <p className="mt-1 text-sm font-semibold text-white/70">Neural capabilities</p>
            </div>
          </motion.div>

          {/* R2 & R3: Visual Canvas (Huge) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative col-span-1 row-span-2 overflow-hidden rounded-[24px] bg-slate-900 shadow-2xl md:col-span-2"
          >
            <img src="/landing/visual_canvas.png" alt="Canvas" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
               <h3 className="text-6xl font-extrabold tracking-tighter text-white sm:text-7xl">Canvas</h3>
               <p className="absolute bottom-8 left-0 right-0 font-medium text-white/60">The infinite spatial visualizer</p>
            </div>
          </motion.div>

          {/* R2: Stacked Text Boxes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1 flex flex-col gap-4"
          >
             <div className="flex flex-1 flex-col items-center justify-center rounded-[24px] bg-[#111113] p-6 text-center border border-white/5 shadow-2xl">
               <h3 className="text-2xl font-bold text-white">Local</h3>
               <p className="mt-1 text-xs font-semibold text-white/50">Run in browser</p>
             </div>
             <div className="flex flex-1 flex-col items-center justify-center rounded-[24px] bg-brand-500 text-white shadow-2xl shadow-brand-500/20">
               <h3 className="text-5xl font-extrabold">∞</h3>
               <p className="mt-1 text-xs font-semibold text-white/80">Endless nodes</p>
             </div>
          </motion.div>

          {/* R3: Minimalist UI */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative col-span-1 overflow-hidden rounded-[24px] bg-slate-900 shadow-2xl"
          >
             <img src="/landing/minimalist_ui.png" alt="Minimal" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
             <div className="relative h-full flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold tracking-tight text-white">Minimalist UI</h3>
             </div>
          </motion.div>

          {/* R3: Custom API Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1 flex flex-col items-center justify-center rounded-[24px] bg-[#111113] p-6 text-center border border-white/5 shadow-2xl"
          >
             <h3 className="text-3xl font-extrabold text-white">REST</h3>
             <p className="mt-2 text-sm font-medium text-white/50">Full API integration</p>
          </motion.div>
        </div>
      </div>

      {/* ── Pricing Section ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1200px] border-t border-white/5 px-6 py-24 md:px-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            We've got a plan for everybody...
          </h2>
          
          {/* Billing Toggle */}
          <div className="mt-10 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                !isYearly ? "bg-white text-black shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                isYearly ? "bg-white text-black shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              Yearly
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isYearly ? "bg-brand-500 text-white" : "bg-brand-500/20 text-brand-400"}`}>
                -20% off
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Free Card */}
          <div className="flex flex-col rounded-[24px] bg-[#111113] p-8 border border-white/10 shadow-2xl transition hover:border-white/20">
            <h3 className="text-2xl font-bold text-white">Free</h3>
            <p className="mt-2 text-sm text-white/50 min-h-[40px]">Get free daily credits to try basic features.</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-white">$0</span>
              <span className="text-sm font-medium text-white/40">/month</span>
            </div>
            <div className="mt-4 text-xs font-semibold text-white/70">100 compute units / day</div>
            <hr className="my-8 border-white/10" />
            <ul className="flex flex-col gap-4 text-sm text-white/60">
              <li className="flex items-start gap-3"><PricingCheck /> No credit card required</li>
              <li className="flex items-start gap-3"><PricingCheck /> Full access to real-time models</li>
              <li className="flex items-start gap-3"><PricingCheck /> Limited access to specialized nodes</li>
            </ul>
          </div>

          {/* Basic Card */}
          <div className="flex flex-col rounded-[24px] bg-[#111113] p-8 border border-white/10 shadow-2xl transition hover:border-white/20">
            <h3 className="text-2xl font-bold text-white">Basic</h3>
            <p className="mt-2 text-sm text-white/50 min-h-[40px]">Access our most popular features</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-white">{isYearly ? "$7" : "$9"}</span>
              <span className="text-sm font-medium text-white/40">/month</span>
            </div>
            <div className="mt-4 text-xs font-semibold text-white/70">5,000 compute units / month</div>
            <hr className="my-8 border-white/10" />
            <ul className="flex flex-col gap-4 text-sm text-white/60">
              <li className="flex items-start gap-2 font-bold text-white"><SparklesIcon /> Everything in Free plus:</li>
              <li className="flex items-start gap-3"><PricingCheck /> Commercial license</li>
              <li className="flex items-start gap-3"><PricingCheck /> LoRA fine-tuning with 50 images</li>
              <li className="flex items-start gap-3"><PricingCheck /> Upscale & enhance to 4K</li>
            </ul>
          </div>

          {/* Pro Card */}
          <div className="flex flex-col rounded-[24px] bg-[#111113] p-8 border border-white/10 shadow-2xl transition hover:border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-500/5 -z-10" />
            <div className="absolute top-0 right-0 rounded-bl-[16px] bg-brand-500 px-4 py-1.5 text-xs font-bold text-white">Most Popular</div>
            
            <h3 className="text-2xl font-bold text-white">Pro</h3>
            <p className="mt-2 text-sm text-white/50 min-h-[40px]">Advanced features and compute discounts</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-white">{isYearly ? "$28" : "$35"}</span>
              <span className="text-sm font-medium text-white/40">/month</span>
            </div>
            <div className="mt-4 text-xs font-semibold text-white/70">20,000 compute units / month</div>
            <hr className="my-8 border-white/10" />
            <ul className="flex flex-col gap-4 text-sm text-white/60">
              <li className="flex items-start gap-2 font-bold text-white"><SparklesIcon /> Everything in Basic plus:</li>
              <li className="flex items-start gap-3"><PricingCheck /> Workflow automation with Nodes</li>
              <li className="flex items-start gap-3"><PricingCheck /> AI-powered Nodes Agent</li>
              <li className="flex items-start gap-3"><PricingCheck /> Upscale & enhance to 8K</li>
            </ul>
          </div>

          {/* Max Card */}
          <div className="flex flex-col rounded-[24px] bg-[#111113] p-8 border border-white/10 shadow-2xl transition hover:border-white/20">
            <h3 className="text-2xl font-bold text-white">Max</h3>
            <p className="mt-2 text-sm text-white/50 min-h-[40px]">Full access with massive compute allocation</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-white">{isYearly ? "$132" : "$165"}</span>
              <span className="text-sm font-medium text-white/40">/month</span>
            </div>
            <div className="mt-4 text-xs font-semibold text-white/70">100,000 compute units / month</div>
            <hr className="my-8 border-white/10" />
            <ul className="flex flex-col gap-4 text-sm text-white/60">
              <li className="flex items-start gap-2 font-bold text-white"><SparklesIcon /> Everything in Pro plus:</li>
              <li className="flex items-start gap-3"><PricingCheck /> Unlimited concurrency</li>
              <li className="flex items-start gap-3"><PricingCheck /> Unlimited relaxed generations</li>
              <li className="flex items-start gap-3"><PricingCheck /> Upscale & enhance to 22K</li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Mega Footer ── */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-[#0A0A0B] pt-20 pb-12">
        <div className="mx-auto max-w-[1200px] px-6 md:px-12">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-5 md:gap-8">
            
            {/* Col 1: Brand */}
            <div className="flex flex-col gap-4">
              <span className="font-bold text-white">Nextflow</span>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Log In</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Pricing</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Enterprise</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Models</a>
            </div>

            {/* Col 2: Products */}
            <div className="flex flex-col gap-4">
              <span className="font-bold text-white">Products</span>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Flow Builder</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">AI Agents</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Visual Canvas</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Code Editor</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Integrations</a>
            </div>

            {/* Col 3: Resources */}
            <div className="flex flex-col gap-4">
              <span className="font-bold text-white">Resources</span>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Pricing</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Careers</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Terms of Service</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Privacy Policy</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Press</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">API</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Documentation</a>
            </div>

            {/* Col 4: About */}
            <div className="flex flex-col gap-4">
              <span className="font-bold text-white">About</span>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Blog</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Discord</a>
            </div>

            {/* Col 5: Models */}
            <div className="flex flex-col gap-4">
              <span className="font-bold text-white">Models</span>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Gemini 2.5</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Claude 3.5</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">GPT-4o</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Llama 3</a>
              <a href="#" className="text-sm font-medium text-white/50 hover:text-white transition">Command R</a>
            </div>

          </div>

          {/* Footer Bottom */}
          <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
            <p className="text-sm font-medium text-white/40">© 2026 Nextflow</p>
            
            <div className="flex gap-6 text-white/40">
              <a href="#" className="hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

{/* Micro component strictly for the visual landing page illusion */}
function MockNode({ type, label, borderColor, glow }: { type: string; label: string; borderColor: string; glow: string }) {
  return (
    <div className={`w-[240px] rounded-[24px] border border-white/10 bg-black/60 p-4 backdrop-blur-xl ${glow}`}>
      <div className={`rounded-[16px] border-[1.5px] bg-white/5 px-4 py-3 ${borderColor}`}>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">{type}</div>
        <div className="mt-1 truncate text-sm font-semibold text-white/90">{label}</div>
      </div>
      <div className="mt-5 flex min-h-[36px] w-full items-center rounded-[18px] border border-white/5 bg-white/5 px-4 py-2">
        <div className="h-1.5 w-1/2 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

function MarqueeItem({ icon, name }: { icon: string; name: string }) {
  return (
    <div className="flex items-center gap-3 text-white/40 grayscale transition-all hover:text-white hover:grayscale-0">
       <span className="text-xl">{icon}</span>
       <span className="text-xl font-semibold tracking-tight">{name}</span>
    </div>
  );
}

function PricingCheck() {
  return (
    <svg className="h-4 w-4 shrink-0 text-white mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-brand-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}
