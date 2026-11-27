/* eslint-disable @next/next/no-img-element -- Preserve the supplied recreation asset and its original rendering. */
import { StructuredData } from "@/components/StructuredData";
import { PageIntro, FourSteps, TextLink } from "@/components/recreation/Site";
import { approachPrincipleKeys, approachStageKeys, approachSymbolKeys } from "@/lib/cms/approach-page";
import { getApproachPage } from "@/lib/cms/content";
import { pageMetadata } from "@/lib/metadata";
import { contentPageGraph } from "@/lib/structured-data";

export const metadata = pageMetadata(
  "Our approach",
  "Discover, Define, Design, Deliver. A structured path from understanding to sustained adoption, grounded in the Win Over Yourself philosophy.",
  "/approach",
);

export default async function ApproachPage() {
  const { intro, method, principles, philosophy } = await getApproachPage();

  return (
    <div className="recreation">
      <StructuredData id="approach-structured-data" nodes={contentPageGraph({
        path: "/approach", name: "Our approach", description: metadata.description ?? "",
      })} />
      <PageIntro label={intro.eyebrow} title={<>{intro.heading}<br /><em>{intro.emphasis}</em></>}>
        <p>{intro.description}</p>
      </PageIntro>
      <section className="approach-band">
        <div className="wrap section">
          <div className="section-head">
            <div>
              <p className="eyebrow red">{method.eyebrow}</p>
              <h2>{method.heading}<br />{method.headingSecondLine}</h2>
            </div>
            <p>{method.description}</p>
          </div>
          <FourSteps steps={approachStageKeys.map((id) => ({ id, ...method[id] }))} />
        </div>
      </section>
      <section className="wrap section approach-principles">
        <div>
          <p className="eyebrow red">{principles.eyebrow}</p>
          <h2>{principles.heading}<br />{principles.headingSecondLine}</h2>
        </div>
        <div className="principles-list">
          {approachPrincipleKeys.map((id, index) => (
            <div key={id}>
              <span>0{index + 1}</span>
              <h3>{principles[id].title}</h3>
              <p>{principles[id].description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="philosophy-section philosophy-detail" id="our-philosophy" aria-labelledby="philosophy-detail-heading">
        <div className="wrap philosophy-grid">
          <div className="philosophy-mark">
            <img src="/assets/woy-mark.png" width="1024" height="1024" alt="WOY emblem combining circle, star and compass" />
            <p className="eyebrow red">{philosophy.eyebrow}</p>
            <h2 id="philosophy-detail-heading">{philosophy.heading}</h2>
          </div>
          <div className="philosophy-detail-copy">
            <div className="philosophy-detail-introduction">
              {philosophy.introduction.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            {approachSymbolKeys.map((id) => (
              <article className="symbol-explanation" key={id}>
                <div className="philosophy-pillar-top">
                  <span className="philosophy-icon" aria-hidden="true">
                    <span className={`logo-symbol ${id}`} />
                  </span>
                  <span className="symbol-label">{philosophy[id].label}</span>
                </div>
                <h3>{philosophy[id].title}</h3>
                <p>{philosophy[id].description}</p>
              </article>
            ))}
            <TextLink href="/work">{philosophy.workLink}</TextLink>
          </div>
        </div>
      </section>
    </div>
  );
}
