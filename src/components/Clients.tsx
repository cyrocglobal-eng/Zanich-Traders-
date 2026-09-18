import { site } from "@/content/site";
import { SectionHeading } from "./SectionHeading";

export function Clients() {
  const { clients } = site;
  return (
    <section id="clients" className="press-section bg-paper">
      <div className="container-x">
        <SectionHeading eyebrow={clients.eyebrow} title={clients.title} intro={clients.intro} />
        <ul className="press-clients">{clients.logos.map(name => <li key={name}>{name}</li>)}</ul>
      </div>
    </section>
  );
}
