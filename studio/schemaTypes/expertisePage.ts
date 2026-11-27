import { defineArrayMember, defineField, defineType } from "sanity";
import { defaultExpertisePage } from "../../lib/cms/expertise-page";
import { expertise } from "../../lib/recreation-content";

const textLine = (name: string, title: string) =>
  defineField({ name, title, type: "string", validation: (rule) => [rule.required(), rule.max(90).warning()] });

const description = defineField({
  name: "description", title: "Description", type: "text", rows: 3,
  validation: (rule) => [rule.required(), rule.max(600).warning()],
});

export const expertisePage = defineType({
  name: "expertisePage",
  title: "Expertise",
  type: "document",
  initialValue: defaultExpertisePage,
  fields: [
    defineField({
      name: "intro", title: "Page introduction", type: "object",
      description: "Use only copy approved for your public website.",
      validation: (rule) => rule.required(),
      fields: [textLine("eyebrow", "Section label"), textLine("heading", "Heading"), textLine("emphasis", "Heading second line"), description],
    }),
    defineField({
      name: "areas", title: "Advisory areas", type: "object", validation: (rule) => rule.required(),
      options: { collapsible: true, collapsed: true },
      fields: expertise.map(({ id, title }) => defineField({
        name: id, title, type: "object", validation: (rule) => rule.required(),
        options: { collapsible: true, collapsed: true },
        fields: [
          textLine("title", "Title"), textLine("question", "Question"), description,
          defineField({
            name: "services", title: "Services", type: "array",
            of: [defineArrayMember({ type: "string" })], validation: (rule) => rule.required().min(1),
          }),
        ],
      })),
    }),
    textLine("caseLabel", "Label above the example case studies"),
    defineField({
      name: "closing", title: "Closing section", type: "object", validation: (rule) => rule.required(),
      options: { collapsible: true, collapsed: true },
      fields: [
        textLine("eyebrow", "Section label"), textLine("heading", "Heading"), textLine("headingSecondLine", "Heading second line"),
        description, textLine("linkLabel", "Contact link label"),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Expertise" }) },
});
