-- Remove only the original sample fabric claims. Merchant-entered fabric_details,
-- care instructions and edited descriptions are preserved. Existing URLs stay valid.
update public.categories set description = 'Explore our clothing collection.'
where slug = 'clothing' and description = 'Lawn suits, co-ord sets and embroidered pieces.';

update public.categories set description = 'Explore our scarves.'
where slug = 'scarves' and description = 'Signature printed and woven scarves.';

update public.collections set name = 'Featured Styles'
where slug = 'luxury-lawn' and name = 'Luxury Lawn';
update public.collections set description = 'Explore featured articles.'
where slug = 'luxury-lawn' and description = 'Light, breezy, elegant lawn for every day.';

update public.products p set
  name = case when p.name = s.original_name then s.neutral_name else p.name end,
  description = case when p.description = s.original_description then '' else p.description end
from (values
  ('ZN-CL-001', 'embroidered-lawn-suit', 'Embroidered Lawn Suit', 'Suit 01', 'A three-piece embroidered lawn suit with delicate floral motifs, finished with a matching dupatta.'),
  ('ZN-CL-002', 'linen-co-ord-set', 'Linen Co-ord Set', 'Co-ord Set', 'A relaxed linen co-ord set tailored for effortless everyday elegance.'),
  ('ZN-CL-003', 'printed-lawn-suit', 'Printed Lawn Suit', 'Suit 02', 'Hand-finished printed lawn suit with contrast piping and a printed dupatta.'),
  ('ZN-CL-004', 'solid-lawn-suit', 'Solid Lawn Suit', 'Suit 03', 'A solid-tone lawn suit with subtle self-embroidery along the neckline.'),
  ('ZN-SC-001', 'signature-scarf', 'Signature Scarf', 'Scarf', 'Our signature printed scarf in lightweight silk-blend fabric.'),
  ('ZN-CL-005', 'embroidered-suit', 'Embroidered Suit', 'Suit 04', 'A statement embroidered suit in rich jewel tones for special occasions.'),
  ('ZN-DP-001', 'classic-woven-dupatta', 'Classic Woven Dupatta', 'Dupatta', 'A finely woven dupatta with jacquard border detailing.'),
  ('ZN-AC-001', 'embroidered-tote', 'Embroidered Tote', 'Tote Bag', 'A structured tote finished with hand embroidery, for everyday carry.')
) as s(sku, slug, original_name, neutral_name, original_description)
where p.sku = s.sku and p.slug = s.slug
  and (p.name = s.original_name or p.description = s.original_description);

update public.faqs set
  question = 'Where can I find fabric and care details?',
  answer = 'Fabric and care details appear on each product page when provided for that article. Contact us if you need more information.'
where question = 'Are your fabrics pre-shrunk?'
  and answer = 'Our lawn and cotton pieces are pre-washed; we still recommend following the care label for longevity.';
