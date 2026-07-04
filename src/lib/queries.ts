// ============================================================
// GROQ-forespørgsler til Sanity.
// Bruges af data.ts. `alleCykler` og `alleVaerksted` er de primære
// build-time-fetches; de parametriserede varianter ligger klar til
// on-demand-brug (fx server islands eller ISR), hvis behovet opstår.
// ============================================================

export const alleCykler = `*[_type == "cykel"] | order(fremhaev desc, _createdAt desc)`;

export const cyklerEfterKoen = `*[_type == "cykel" && koen == $koen] | order(_createdAt desc)`;

export const enCykel = `*[_type == "cykel" && slug.current == $slug][0]`;

export const fremhaevede = `*[_type == "cykel" && fremhaev == true][0..5]`;

export const relaterede = `*[_type == "cykel" && koen == $koen && type == $type && _id != $id][0..3]`;

export const alleVaerksted = `*[_type == "vaerkstedsydelse"] | order(raekkefolge asc)`;
