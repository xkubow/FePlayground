import { http, HttpResponse } from 'msw';
import { pagedOutput } from '../data/vozidlo';
import { responses } from '../data/localhost_responses';

const BASE = '';

const TEST_USER_ID = '009bb7a5-0309-ed11-85b7-8cec4bb4af21';

const testUser = {
  uzivatelId: TEST_USER_ID,
  dzc: 'testuser',
  mfaPerNr: null,
  jmeno: 'Test',
  prijmeni: 'User',
  zobrazeneJmeno: 'Test User',
  oddeleni: 'QA',
  zkusenost: 1,
  email: 'test.user@example.com',
  vstupDatum: '2024-01-01T00:00:00Z',
  vyrazenDatum: null,
  vyrobniLinkaId: 1,
  neovereno: false,
  station: false,
  operations: 15,
};

export const uzivatelHandlers = [
  // Auth endpoints
  http.get(`${BASE}/api/auth/user/logged`, () => {
    return HttpResponse.json({ isLogged: true });
  }),

  http.get(`${BASE}/api/auth/user`, () => {
    return HttpResponse.json({
      uzivatelId: testUser.uzivatelId,
      zobrazeneJmeno: testUser.zobrazeneJmeno,
      vyrobniLinkaId: testUser.vyrobniLinkaId,
    });
  }),

  http.post(`${BASE}/api/auth/DevelopmentLogin`, () => {
    return HttpResponse.json({
      token:
        'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJkaXNwbGF5TmFtZSI6IlN5c3TDqW1vdsO9IGFkbWluaXN0csOhdG9yIiwidWlkIjoiMDA5YmI3YTUtMDMwOS1lZDExLTg1YjctOGNlYzRiYjRhZjIxIiwiZGVwYXJ0bWVudCI6IkZJIiwianRpIjoiYTlmZTBiY2QtMzdiZS00NGRjLTllZWEtM2U1ZTQwYTI1ODA0IiwiZ3JvdXBzIjoiRUZJVC5BRE1JTlMiLCJleHAiOjE3NzI2MzA4ODYsImlzcyI6ImVGSVQiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvIn0.',
      uzivatelId: testUser.uzivatelId,
      zobrazeneJmeno: testUser.zobrazeneJmeno,
    });
  }),

  // Uzivatel
  http.get(`${BASE}/api/Uzivatel`, () => {
    return HttpResponse.json(testUser);
  }),

  http.post(`${BASE}/api/Uzivatel`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.get(`${BASE}/api/Uzivatel/Grid`, () => {
    return HttpResponse.json(pagedOutput([testUser]));
  }),

  http.post(`${BASE}/api/Uzivatel/VyrobniLinka`, () => {
    return HttpResponse.json(1);
  }),

  http.get(`${BASE}/api/Uzivatel/:id`, () => {
    return HttpResponse.json(testUser);
  }),

  http.put(`${BASE}/api/Uzivatel/:id`, () => {
    return HttpResponse.json(1);
  }),

  http.delete(`${BASE}/api/Uzivatel/:id`, () => {
    return HttpResponse.json(1);
  }),

  // Skupina Uzivatelu
  http.get(`${BASE}/api/Uzivatel/Skupina/Grid`, () => {
    return HttpResponse.json(responses.uzivatelSkupinaGrid ? responses.uzivatelSkupinaGrid : []);
  }),

  http.get(`${BASE}/api/Uzivatel/Skupina/DropDownList`, () => {
    return HttpResponse.json([
      { value: 1, text: 'Analyza' },
      { value: 2, text: 'Reseni' },
    ]);
  }),

  http.get(`${BASE}/api/Uzivatel/Skupina/TypDropDownList`, () => {
    return HttpResponse.json(responses.uzivatelSkupinaTypDropDownList ? responses.uzivatelSkupinaTypDropDownList : []);
  }),

  http.post(`${BASE}/api/Uzivatel/Skupina`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.get(`${BASE}/api/Uzivatel/Skupina/:id`, ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      nazev: 'Analyza',
      typ: 1,
      vyrobniLinkaId: 1,
      operations: 15,
    });
  }),

  http.put(`${BASE}/api/Uzivatel/Skupina/:id`, () => {
    return HttpResponse.json(1);
  }),

  http.delete(`${BASE}/api/Uzivatel/Skupina/:id`, () => {
    return HttpResponse.json(1);
  }),

  // SkupinaUzivatelu_Uzivatel
  http.post(`${BASE}/api/SkupinaUzivatelu_Uzivatel`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.delete(`${BASE}/api/SkupinaUzivatelu_Uzivatel`, () => {
    return HttpResponse.json(1);
  }),

  http.get(`${BASE}/api/SkupinaUzivatelu_Uzivatel/List`, () => {
    return HttpResponse.json([TEST_USER_ID]);
  }),

  http.post(`${BASE}/api/SkupinaUzivatelu_Uzivatel/List`, () => {
    return HttpResponse.json(1);
  }),
];
