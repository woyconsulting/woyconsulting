import { steps } from "../recreation-content";
import { brandPhilosophy, philosophyDetailIntroduction } from "../recreation-philosophy";

export const approachStageKeys = ["discover", "define", "design", "deliver"] as const;
export const approachPrincipleKeys = ["businessLeadership", "bespokeDesign", "partnerInvolvement", "adoption"] as const;
export const approachSymbolKeys = ["circle", "star", "compass"] as const;

const stage = ({ name, text }: (typeof steps)[number]) => ({ title: name, description: text });
const symbol = ({ symbol, detailTitle, detail }: (typeof brandPhilosophy)[number]) => ({
  label: symbol,
  title: detailTitle,
  description: detail,
});

export const defaultApproachPage = {
  intro: {
    eyebrow: "Our approach",
    heading: "Clarity in the thinking.",
    emphasis: "Discipline in the doing.",
    description: "Since 2015, WOY has helped leaders connect ambition with the practical work of change. Every engagement is tailored. Every engagement is partner-led.",
  },
  method: {
    eyebrow: "Discover · Define · Design · Deliver",
    heading: "A structured path.",
    headingSecondLine: "A tailored response.",
    description: "Our 4D approach brings rigour to diagnosis and flexibility to delivery, with adoption considered from the start.",
    discover: stage(steps[0]),
    define: stage(steps[1]),
    design: stage(steps[2]),
    deliver: stage(steps[3]),
  },
  principles: {
    eyebrow: "How it feels to work with us",
    heading: "Close to your business.",
    headingSecondLine: "Accountable for the work.",
    businessLeadership: {
      title: "Business leadership perspective",
      description: "Advice shaped by experience of targets, talent, trade-offs and execution in real operating environments.",
    },
    bespokeDesign: {
      title: "Bespoke by design",
      description: "Proven frameworks adapted to your context, maturity and constraints, with usable tools and clear choices.",
    },
    partnerInvolvement: {
      title: "Partners who stay involved",
      description: "Direct access to our partners, with continuity and accountability throughout the engagement.",
    },
    adoption: {
      title: "Built for adoption",
      description: "Attention to observable behaviour, operating rhythms and ownership so your teams can sustain the work.",
    },
  },
  philosophy: {
    eyebrow: "Our name. Our philosophy.",
    heading: "Win Over Yourself.",
    introduction: [...philosophyDetailIntroduction] as string[],
    circle: symbol(brandPhilosophy[0]),
    star: symbol(brandPhilosophy[1]),
    compass: symbol(brandPhilosophy[2]),
    workLink: "See our approach in practice",
  },
};
