"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CheckIcon = () => (
  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  delay?: number;
}

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  popular = false,
  delay = 0 
}: PricingCardProps) => {
  const router = useRouter();
  
  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${
        popular ? 'ring-2 ring-primary-500 transform scale-105 md:scale-110' : ''
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
    >
      {popular && (
        <div className="bg-primary-500 text-white text-center py-2 font-medium">
          Most Popular
        </div>
      )}
      
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
        
        <div className="mb-6">
          <span className="text-5xl font-bold text-gray-900 dark:text-white">${price}</span>
          {price > 0 && <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>}
        </div>
        
        <Button 
          className={`w-full py-6 ${
            popular 
              ? 'bg-primary-500 hover:bg-primary-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
          }`}
          onClick={() => router.push('/signup')}
        >
          {buttonText}
        </Button>
        
        <div className="mt-8">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">What's included:</h4>
          <ul className="space-y-3">
            {features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 mt-0.5">
                  <CheckIcon />
                </span>
                <span className="text-gray-600 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

interface Plan {
  title: string;
  price: number;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  delay?: number;
}

export default function PricingSection() {
  const plans: Plan[] = [
    {
      title: "Free",
      price: 0,
      description: "Perfect for individual developers",
      features: [
        "Up to 3 repositories",
        "Basic code analysis",
        "Community support",
        "Limited API calls",
        "7-day history"
      ],
      buttonText: "Get Started",
      delay: 0.1
    },
    {
      title: "Pro",
      price: 19,
      description: "For professional developers",
      features: [
        "Unlimited repositories",
        "Advanced code analysis",
        "Priority support",
        "Unlimited API calls",
        "30-day history",
        "Custom integrations",
        "Team collaboration"
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
      delay: 0.2
    },
    {
      title: "Enterprise",
      price: 49,
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Dedicated support",
        "Custom AI training",
        "SSO & advanced security",
        "Unlimited history",
        "Custom deployment",
        "SLA guarantee"
      ],
      buttonText: "Contact Sales",
      delay: 0.3
    }
  ];

  return (
    <section id="pricing" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent inline-block">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose the plan that's right for you and start optimizing your repositories today
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 dark:text-gray-300">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
