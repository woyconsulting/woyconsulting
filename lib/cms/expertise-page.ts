import { expertise } from "../recreation-content";

export const defaultExpertisePage = {
  intro: {
    eyebrow: "Our expertise",
    heading: "The ambition is yours.",
    emphasis: "The work is shared.",
    description: "Four connected areas of advisory. Each shaped around your business reality, with our partners involved from diagnosis to delivery.",
  },
  areas: Object.fromEntries(expertise.map(({ id, title, question, description, services }) => [
    id, { title, question, description, services },
  ])),
  caseLabel: "In practice",
  closing: {
    eyebrow: "Designed around your context",
    heading: "Start with the challenge.",
    headingSecondLine: "Build the right response.",
    description: "Your priorities may cross several of these areas. We bring the relevant experience together to design a coherent engagement, with clear outcomes and practical ownership.",
    linkLabel: "Discuss your priorities",
  },
};
