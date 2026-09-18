// Illustrates the fix for the real app's API overfetch/overpost finding:
// reference.service.ts's updateVisitorType()/addVisitorType() send the full
// nested Brand (including Brand.sites[]) and Domain objects just to
// reference which brand/domain a visitor type belongs to. `Brand`/`Domain`
// below mirror that real, nested shape; nothing here is wired to a UI in
// this demo — it's the mapping pattern in isolation.

export interface Brand {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  isActive: boolean;
  sites: { id: string; name: string }[]; // the expensive part that shouldn't round-trip
}

export interface Domain {
  id: string;
  name: string;
  logoutURL: string;
}

// Carved out of the full models with `Pick` rather than hand-duplicated —
// this is the "slim option shape" a dropdown actually needs.
export type BrandOption = Pick<Brand, 'id' | 'name'>;
export type DomainOption = Pick<Domain, 'id' | 'name'>;

export interface VisitorTypeFormValue {
  description: string;
  isActive: boolean;
  brand: Brand;
  domain: Domain;
}

// The slim shape that should actually go over the wire on save — an id
// reference instead of the full nested object.
export interface UpdateVisitorTypeRequest {
  id: string;
  description: string;
  isActive: boolean;
  brandId: string;
  domainId: string;
}

export function toUpdateVisitorTypeRequest(
  id: string,
  form: VisitorTypeFormValue,
): UpdateVisitorTypeRequest {
  return {
    id,
    description: form.description,
    isActive: form.isActive,
    brandId: form.brand.id,
    domainId: form.domain.id,
  };
}
