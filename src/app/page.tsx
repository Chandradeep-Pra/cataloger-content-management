"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderTree, ShoppingCart, BarChart3, Settings, Users, Shield } from "lucide-react";
import { SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import { ThemeToggle } from "@/components/ThemeToggle";
import LogoMarquee from "@/components/Marque/Lm";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { ShinyButton } from "@/components/magicui/shiny-button";


const Index = () => {
  const features = [
    {
      icon: FolderTree,
      title: "Hierarchical Categories",
      description: "Create and manage nested category structures with drag-and-drop simplicity."
    },
    {
      icon: ShoppingCart,
      title: "Product Assignment",
      description: "Easily assign products to categories and manage bulk operations efficiently."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track category performance and get insights to optimize your product organization."
    },
    {
      icon: Settings,
      title: "Bulk Operations",
      description: "Import, export, and manage thousands of categories with powerful bulk tools."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with your team with role-based permissions and activity tracking."
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security to keep your category data safe and compliant."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60 fixed min-w-full">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FolderTree className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">CategoryHub</h1>
            </div>
            <div className="flex items-center space-x-3">
            <ThemeToggle />
            <SignedOut>
            <SignInButton mode="modal">
            <Button variant="outline">
              Sign in
            </Button>
            </SignInButton>
            <SignUpButton mode="modal">
            <Button >
              Sign up
            </Button>
            </SignUpButton>
            </SignedOut>
            </div>
          </div>
        </div>
      </header>
      <ScrollProgress className="top-[71px]" />
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 mt-8">
            E-commerce Category Management
          </Badge>
          <h2 className="text-7xl font-bold text-foreground mb-6 leading-tight">
            Organize Your Products
            <span className="text-primary block">Like Never Before</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Streamline your e-commerce operations with our powerful category management system. 
            Create, organize, and optimize product categories with enterprise-grade tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Button size="lg" className="text-lg px-8 py-6">
              Get Started Free
            </Button> */}
            <SignedOut>
              <SignUpButton>
            <InteractiveHoverButton>Get Started</InteractiveHoverButton>
              </SignUpButton>
            </SignedOut>
            
          </div>
        </div>
      </section>
      <LogoMarquee/>
      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Manage Categories
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From simple category creation to advanced analytics, our platform provides 
              all the tools you need to organize your e-commerce catalog efficiently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-border/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Category Management?
          </h3>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of e-commerce businesses already using CategoryHub to 
            streamline their product organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Your Free Trial
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FolderTree className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">CategoryHub</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 CategoryHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;