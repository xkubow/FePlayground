import { http, HttpResponse } from 'msw';
import { mockVozidlaFe, mockVozidlaGrid, pagedOutput } from '../data/vozidlo';
import { responses, vozidloSemafor } from '../data/localhost_responses';
import { responsesByUrl } from '../data/vozidlo_list_responses';

const BASE = '';

export const vozidloHandlers = [
  // Vozidlo semafor/ (GET with Knr query param)
  http.get(`${BASE}/api/Vozidlo/semafor`, ({ request }) => {
    return HttpResponse.json(vozidloSemafor);
  }),

  // Vozidlo Grid
  http.get(`${BASE}/api/Vozidlo/Grid`, () => {
    return HttpResponse.json(pagedOutput(mockVozidlaGrid));
  }),

  // Vozidlo by id (VozidloFeDto)
  http.get(`${BASE}/api/Vozidlo/:id`, ({ params }) => {
    return HttpResponse.json(responses.vozidlo ? responses.vozidlo : {});
  }),

  // Vozidlo PUT
  http.put(`${BASE}/api/Vozidlo/:id`, () => {
    return HttpResponse.json(1);
  }),

  // Vozidlo Chyby Grid
  http.get(`${BASE}/api/Vozidlo/Chyby/Grid`, () => {
    return HttpResponse.json(responses.vozidloChybyGrid ? responses.vozidloChybyGrid : {});
  }),

  // Vozidlo PrCislo Grid
  http.get(`${BASE}/api/Vozidlo/PrCislo/Grid`, () => {
    return HttpResponse.json(responses.vozidloPrCisloGrid ? responses.vozidloPrCisloGrid : []);
  }),

  // Vozidlo_VozidloStitek
  http.post(`${BASE}/api/Vozidlo_VozidloStitek`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete(`${BASE}/api/Vozidlo_VozidloStitek`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/Vozidlo_VozidloStitek/List`, () => {
    return HttpResponse.json(responses.vozidloVozidloStitek ? responses.vozidloVozidloStitek : []);
  }),
  http.post(`${BASE}/api/Vozidlo_VozidloStitek/List`, () => {
    return HttpResponse.json(1);
  }),

  // VozidloStitek Grid (codelist)
  http.get(`${BASE}/api/VozidloStitek/Grid`, () => {
    return HttpResponse.json(responses.vozidloStitekGrid ? responses.vozidloStitekGrid : []);
  }),

  // VozidloStitek CRUD
  http.post(`${BASE}/api/VozidloStitek`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/VozidloStitek/:id`, ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      nazev: 'Stietek A',
      zkratka: 'A',
      vyrazeno: false,
      operations: 15,
    });
  }),
  http.put(`${BASE}/api/VozidloStitek/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/VozidloStitek/:id`, () => {
    return HttpResponse.json(1);
  }),

  // VozidloStitek_PrCislo
  http.post(`${BASE}/api/VozidloStitek_PrCislo`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete(`${BASE}/api/VozidloStitek_PrCislo`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/VozidloStitek_PrCislo/List`, () => {
    return HttpResponse.json(['PR-001', 'PR-002']);
  }),
  http.post(`${BASE}/api/VozidloStitek_PrCislo/List`, () => {
    return HttpResponse.json(1);
  }),

  // Komentar Grid
  http.get(`${BASE}/api/Vozidlo/Komentar/Grid`, () => {
    return HttpResponse.json(responses.vozidloKomentarGrid ? responses.vozidloKomentarGrid : []);
  }),
  http.post(`${BASE}/api/Vozidlo/Komentar`, () => {
    return HttpResponse.json(1, { status: 201 });
  }),
  http.put(`${BASE}/api/Vozidlo/Komentar/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Vozidlo/Komentar/:id`, () => {
    return HttpResponse.json(1);
  }),

  // Priloha
  http.get(`${BASE}/api/Vozidlo/Priloha/Grid`, () => {
    return HttpResponse.json(responses.vozidloPrilohaGrid ? responses.vozidloPrilohaGrid : []);
  }),
  http.post(`${BASE}/api/Vozidlo/Priloha`, () => {
    return HttpResponse.json(1, { status: 201 });
  }),
  http.get(`${BASE}/api/Vozidlo/Priloha`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete(`${BASE}/api/Vozidlo/Priloha`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // Zavada Grid
  http.get(`${BASE}/api/Vozidlo/Zavada/Grid`, () => {
    return HttpResponse.json(responses.vozidloZavadaGrid ? responses.vozidloZavadaGrid : []);
  }),
  http.get(`${BASE}/api/Vozidlo/Zavada/Navrhovane/Grid`, () => {
    return HttpResponse.json(responses.vozidloZavadaNavrhovaneGrid ? responses.vozidloZavadaNavrhovaneGrid : []);
  }),
  http.get(`${BASE}/api/Vozidlo/Zavada/Navrhovane/Archiv/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.get(`${BASE}/api/Vozidlo/Zavada/Navrhovane/Archiv/Prehled/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),

  // Zavada DropDownLists
  http.get(`${BASE}/api/Vozidlo/Zavada/PracovisteVznikuZavadyDropDownList`, () => {
    return HttpResponse.json([
      { value: 1, text: 'Pracoviste 1', disabled: false },
      { value: 2, text: 'Pracoviste 2', disabled: false },
    ]);
  }),
  http.get(`${BASE}/api/Vozidlo/Zavada/PracovisteZadaniZavadyDropDownList`, () => {
    return HttpResponse.json([
      { value: 1, text: 'Pracoviste 1', disabled: false },
      { value: 2, text: 'Pracoviste 2', disabled: false },
    ]);
  }),

  // Zavada Default
  http.get(`${BASE}/api/Vozidlo/Zavada/Default`, () => {
    return HttpResponse.json({
      definiceZavadyId: null,
      sqsZavadaTypId: null,
      sqsZavadaVinikId: null,
      sqsZavadaRadekId: null,
      sqsZavadaSkupinaId: null,
      pracovisteVznikuZavadyId: null,
      pracovisteZadaniZavadyId: null,
      operations: 15,
    });
  }),

  // Zavada OdesliSqs
  http.post(`${BASE}/api/Vozidlo/Zavada/OdesliSqs`, () => {
    return HttpResponse.json({
      userMessageList: [],
      odeslanoDoSqsDatum: new Date().toISOString(),
    });
  }),

  // Zavada CRUD
  http.post(`${BASE}/api/Vozidlo/Zavada`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.get(`${BASE}/api/Vozidlo/Zavada/:id`, ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      knr: 1234567,
      definiceZavadyId: 1,
      sqsZavadaTypId: 1,
      sqsZavadaVinikId: 1,
      sqsZavadaRadekId: 1,
      text: 'Mock zavada',
      operations: 15,
    });
  }),
  http.put(`${BASE}/api/Vozidlo/Zavada/:id`, () => {
    return HttpResponse.json(1);
  }),

  // RidiciJednotkaInfo Grid (GET with Knr query param)
  http.get(`${BASE}/api/ridiciJednotkaInfo/Grid`, ({ request }) => {
    return HttpResponse.json(responses.ridiciJednotkaInfoGrid ? responses.ridiciJednotkaInfoGrid : []);
  }),

  // Vozidlo casOpravy Grid (GET with Knr query param)
  http.get(`${BASE}/api/Vozidlo/casOpravy/Grid`, ({ request }) => {
    // Use centralized mock response
    return HttpResponse.json(responses.vozidloCasOpravyGrid ? responses.vozidloCasOpravyGrid : []);
  }),
];
