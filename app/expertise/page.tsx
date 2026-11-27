import { StructuredData } from "@/components/StructuredData";
import { PageIntro, TextLink } from "@/components/recreation/Site";
import { expertise } from "@/lib/recreation-content";
import { getEngagements, getExpertisePage } from "@/lib/cms/content";
import { pageMetadata } from "@/lib/metadata";
import { contentPageGraph } from "@/lib/structured-data";

export const metadata = pageMetadata(
  "Our expertise",
  "Business consulting across strategy, growth, leadership, organisation, culture, HR and performance systems.",
  "/expertise",
);

export default async function ExpertisePage() {
  const [cases, { intro, areas, caseLabel, closing }] = await Promise.all([getEngagements(), getExpertisePage()]);
  return (
    <div className="recreation">
      <StructuredData id="expertise-structured-data" nodes={contentPageGraph({
        path: "/expertise", name: "Our expertise", description: metadata.description ?? "",
      })} />
      <PageIntro label={intro.eyebrow} title={<>{intro.heading}<br /><em>{intro.emphasis}</em></>}>
        <p>{intro.description}</p>
      </PageIntro>
      <div className="wrap expertise-details">
        {expertise.map(({ id, number, caseSlug }) => {
          const item = areas[id];
          const example = cases.find((study) => study.slug === caseSlug);
          return (
            <section id={id} className="expertise-detail" key={id}>
              <div className="expertise-detail-title">
                <span className="eyebrow red">{number} /</span>
                <h2>{item.title}</h2>
              </div>
              <div>
                <h3>{item.question}</h3>
                <p className="muted expertise-description">{item.description}</p>
                <ul className="service-list">
                  {item.services.map((service, index) => <li key={index}>{service}</li>)}
                </ul>
                {example && (
                  <div className="expertise-case">
                    <span className="eyebrow muted">{caseLabel}</span>
                    <TextLink href={`/work/${caseSlug}`}>{example.title}</TextLink>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
      <section className="wrap section expertise-note">
        <p className="eyebrow red">{closing.eyebrow}</p>
        <h2>{closing.heading}<br />{closing.headingSecondLine}</h2>
        <p className="muted">{closing.description}</p>
        <TextLink href="/contact">{closing.linkLabel}</TextLink>
      </section>
    </div>
  );
}
