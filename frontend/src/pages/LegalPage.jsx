import PublicLayout from "@/components/PublicLayout";

// Plain-language starter text. Have it reviewed by the agency's advisor before going live.
const PAGES = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      ["What we collect", "When you fill in an enquiry form we collect your name, phone number and what you are looking for. If you open the site from an advert, we also note which advert (campaign) brought you here."],
      ["How we use it", "We use your details only to contact you about properties and to follow up on your enquiry. We do not sell your details to anyone."],
      ["WhatsApp updates", "If you tick the WhatsApp box we may send you property updates on WhatsApp. You can ask us to stop at any time."],
      ["Who can see it", "Your enquiry is visible to the Kishan Real Estate team. It is stored with our database provider, Supabase, which keeps it secure on our behalf."],
      ["Your choices", "You can ask us to correct or delete your details by calling or messaging us on the number shown on this site."],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    sections: [
      ["Information on this site", "Property details, photos and prices are shared in good faith and may change or sell without notice. Please confirm everything with us before you decide."],
      ["No guarantee of availability", "A property shown as Available may have been sold or put on hold since the page was last updated."],
      ["Photos", "Some photos are for reference and may not show the exact property."],
      ["Loan calculator", "The EMI calculator gives an estimate only. Actual interest rates and eligibility depend on your bank."],
      ["Contact", "For any question about these terms, call or message us on the number shown on this site."],
    ],
  },
};

export default function LegalPage({ kind }) {
  const page = PAGES[kind];
  return (
    <PublicLayout>
      <title>{`${page.title} · Kishan Real Estate`}</title>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">{page.title}</h1>
        <div className="space-y-6">
          {page.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="font-semibold text-lg mb-1">{heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </article>
    </PublicLayout>
  );
}
