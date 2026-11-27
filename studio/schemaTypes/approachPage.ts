import { defineArrayMember, defineField, defineType } from "sanity";
import { defaultApproachPage } from "../../lib/cms/approach-page";

function shortText(name: string, title: string) {
  return defineField({ name, title, type: "string", validation: (rule) => [rule.required(), rule.max(90).warning()] });
}

function bodyText(name: string, title: string) {
  return defineField({ name, title, type: "text", rows: 3, validation: (rule) => [rule.required(), rule.max(600).warning()] });
}

function entry(name: string, title: string, withLabel = false) {
  return defineField({
    name,
    title,
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      ...(withLabel ? [shortText("label", "Symbol label")] : []),
      shortText("title", "Heading"),
      bodyText("description", "Description"),
    ],
    validation: (rule) => rule.required(),
  });
}

export const approachPage = defineType({
  name: "approachPage",
  title: "Our approach",
  type: "document",
  initialValue: defaultApproachPage,
  preview: { prepare: () => ({ title: "Our approach" }) },
  fields: [
    defineField({
      name: "intro",
      title: "Page introduction",
      description: "Use only copy approved for your public website.",
      type: "object",
      fields: [
        shortText("eyebrow", "Label above the heading"),
        shortText("heading", "Main heading, first line"),
        shortText("emphasis", "Main heading, second line"),
        bodyText("description", "Introduction"),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "method",
      title: "4D approach",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        shortText("eyebrow", "Label above the heading"),
        shortText("heading", "Heading, first line"),
        shortText("headingSecondLine", "Heading, second line"),
        bodyText("description", "Introduction"),
        entry("discover", "Discover"),
        entry("define", "Define"),
        entry("design", "Design"),
        entry("deliver", "Deliver"),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "principles",
      title: "Working principles",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        shortText("eyebrow", "Label above the heading"),
        shortText("heading", "Heading, first line"),
        shortText("headingSecondLine", "Heading, second line"),
        entry("businessLeadership", "Business leadership perspective"),
        entry("bespokeDesign", "Bespoke by design"),
        entry("partnerInvolvement", "Partners who stay involved"),
        entry("adoption", "Built for adoption"),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "philosophy",
      title: "Our philosophy",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        shortText("eyebrow", "Label above the heading"),
        shortText("heading", "Heading"),
        defineField({
          name: "introduction",
          title: "Introduction paragraphs",
          type: "array",
          of: [defineArrayMember({ type: "text", rows: 3, validation: (rule) => [rule.required(), rule.max(750).warning()] })],
          validation: (rule) => rule.required().min(1).max(6),
        }),
        entry("circle", "Circle", true),
        entry("star", "Five-Point Star", true),
        entry("compass", "Compass", true),
        shortText("workLink", "Selected work link text"),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
});
