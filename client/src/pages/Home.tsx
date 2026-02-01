import { Link } from "wouter";
import { ArrowRight, LayoutTemplate, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="text-center space-y-8"
      >
        <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium border border-secondary">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          v1.0 Now Available
        </motion.div>
        
        <motion.h1 variants={item} className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground">
          Build faster with <br/>
          <span className="bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
            Modern Defaults
          </span>
        </motion.h1>

        <motion.p variants={item} className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A production-ready fullstack starter kit. Pre-configured with TypeScript, 
          Tailwind CSS, TanStack Query, and a robust backend architecture.
        </motion.p>

        <motion.div variants={item} className="flex items-center justify-center gap-4 pt-4">
          <Link href="/demo">
            <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              View Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a 
            href="https://github.com/replit/stack" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full hover:bg-secondary/50">
              Documentation
            </Button>
          </a>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="grid md:grid-cols-3 gap-8 mt-24"
      >
        <FeatureCard 
          icon={<Zap className="h-6 w-6" />}
          title="Lightning Fast"
          description="Vite-powered frontend with instant HMR and optimized production builds."
        />
        <FeatureCard 
          icon={<LayoutTemplate className="h-6 w-6" />}
          title="Type Safe"
          description="End-to-end type safety with TypeScript, Zod, and shared schemas."
        />
        <FeatureCard 
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Production Ready"
          description="Structured architecture with clear separation of concerns and best practices."
        />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group p-6 rounded-2xl border bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300">
      <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-display mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
