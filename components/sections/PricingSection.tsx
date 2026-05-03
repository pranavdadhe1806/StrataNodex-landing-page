"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedText from "@/components/ui/AnimatedText";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";

type PlanInterval = "MONTHLY" | "YEARLY";

const plans = [
  {
    name: "Hobby",
    price: { MONTHLY: 0, YEARLY: 0 },
    description: "Perfect for individuals and side projects.",
    features: [
      "Infinite node nesting",
      "CLI, Web, and Mobile access",
      "Up to 3 active lists",
      "Basic daily scoring",
    ],
    cta: "Start for free",
    popular: false,
  },
  {
    name: "Pro",
    price: { MONTHLY: 8, YEARLY: 80 },
    description: "For professionals who need unlimited power.",
    features: [
      "Everything in Hobby",
      "Unlimited lists and nodes",
      "Advanced gamification & streaks",
      "Custom tags and colors",
      "Priority email support",
    ],
    cta: "Get Pro",
    popular: true,
  },
  {
    name: "Team",
    price: { MONTHLY: 19, YEARLY: 190 },
    description: "Collaborate with your team in shared workspaces.",
    features: [
      "Everything in Pro",
      "Shared folders and lists",
      "Role-based access control",
      "Team analytics and leaderboards",
      "SSO & advanced security",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingSection() {
  const [interval, setInterval] = useState<PlanInterval>("MONTHLY");

  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 relative"
      style={{ background: "var(--bg-base)" }}
      id="pricing"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel className="mb-4 justify-center">PRICING</SectionLabel>
          <AnimatedText
            text="Simple, transparent pricing"
            tag="h2"
            className="font-bold mb-6 text-[color:var(--text-primary)]"
            style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
          />
          <p
            className="mx-auto"
            style={{
              color: "var(--text-secondary)",
              fontSize: "18px",
              maxWidth: "600px",
            }}
          >
            Start for free. Upgrade when you need more power and collaboration.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center mt-10">
            <div
              className="flex items-center p-1 rounded-lg"
              style={{
                background: "rgba(0,191,255,0.04)",
                border: "1px solid rgba(0,191,255,0.12)",
              }}
            >
              <button
                onClick={() => setInterval("MONTHLY")}
                className="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200"
                style={{
                  background:
                    interval === "MONTHLY"
                      ? "rgba(0,191,255,0.1)"
                      : "transparent",
                  color:
                    interval === "MONTHLY"
                      ? "var(--accent-cyan)"
                      : "var(--text-secondary)",
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setInterval("YEARLY")}
                className="px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2"
                style={{
                  background:
                    interval === "YEARLY"
                      ? "rgba(0,191,255,0.1)"
                      : "transparent",
                  color:
                    interval === "YEARLY"
                      ? "var(--accent-cyan)"
                      : "var(--text-secondary)",
                }}
              >
                Yearly
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(0,200,150,0.15)",
                    color: "var(--accent-teal)",
                  }}
                >
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className="relative">
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold tracking-wide z-10"
                  style={{
                    background: "var(--accent-cyan)",
                    color: "var(--bg-base)",
                  }}
                >
                  MOST POPULAR
                </div>
              )}
              <GlassCard
                hover={true}
                className="h-full flex flex-col p-8 relative"
                style={
                  plan.popular
                    ? {
                        border: "1px solid rgba(0,191,255,0.4)",
                        background: "rgba(0,191,255,0.03)",
                      }
                    : {}
                }
              >
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-sm mb-6 h-10"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {plan.description}
                </p>
                <div className="mb-8">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ${plan.price[interval]}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    /mo
                  </span>
                </div>

                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        size={18}
                        style={{ color: "var(--accent-teal)", flexShrink: 0 }}
                      />
                      <span
                        className="text-sm leading-tight"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <GlowButton
                  variant={plan.popular ? "primary" : "ghost"}
                  href="#auth"
                  className="w-full justify-center"
                >
                  {plan.cta}
                </GlowButton>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
