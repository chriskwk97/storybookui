import { Brand, Domain, toUpdateVisitorTypeRequest, VisitorTypeFormValue } from './update-visitor-type-request.model';

describe('toUpdateVisitorTypeRequest', () => {
  const brand: Brand = {
    id: 'brand-1',
    name: 'Acme Facilities',
    code: 'ACME',
    imageUrl: '/assets/acme.png',
    isActive: true,
    sites: [
      { id: 'site-1', name: 'North Tower' },
      { id: 'site-2', name: 'South Tower' },
    ],
  };

  const domain: Domain = {
    id: 'domain-1',
    name: 'acme.example.com',
    logoutURL: 'https://acme.example.com/logout',
  };

  const form: VisitorTypeFormValue = {
    description: 'Contractor',
    isActive: true,
    brand,
    domain,
  };

  it('maps the form value to the slim request shape', () => {
    const request = toUpdateVisitorTypeRequest('visitor-type-1', form);

    expect(request).toEqual({
      id: 'visitor-type-1',
      description: 'Contractor',
      isActive: true,
      brandId: 'brand-1',
      domainId: 'domain-1',
    });
  });

  it('never carries the nested Brand.sites or Domain.logoutURL onto the wire', () => {
    const request = toUpdateVisitorTypeRequest('visitor-type-1', form);

    expect(request).not.toHaveProperty('sites');
    expect(request).not.toHaveProperty('logoutURL');
    expect(JSON.stringify(request)).not.toContain('North Tower');
  });
});
