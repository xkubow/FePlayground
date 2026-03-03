import { http, HttpResponse } from 'msw';
import { pagedOutput } from '../data/vozidlo';
import { responses } from '../data/localhost_responses';

const BASE = '';

const mockEskalace = [
  {
    id: 1,
    knr: 1234567,
    modelovyKlicKod: '8YS',
    schvaleniDatum: null,
    prirazenaSkupinaUzivateluZobrazeneJmeno: 'Analyza',
    text: 'Eskalace pro Enyaq - zavada VN systemu',
    eskalaceStatusEnum: 1,
    eskalaceStatusText: 'Analyza',
    ridiciJednotkaDiagnostickaAdresa: null,
    ridiciJednotkaText: null,
    ridiciJednotkaLabelText: null,
  },
  {
    id: 2,
    knr: 1234567,
    modelovyKlicKod: '8YS',
    schvaleniDatum: '2024-01-20T10:00:00Z',
    prirazenaSkupinaUzivateluZobrazeneJmeno: 'Reseni',
    text: 'Eskalace 2 - problem s nabijenim',
    eskalaceStatusEnum: 2,
    eskalaceStatusText: 'Reseni',
    ridiciJednotkaDiagnostickaAdresa: 0x17,
    ridiciJednotkaText: 'BMS',
    ridiciJednotkaLabelText: 'Battery Management System',
  },
];

export const eskalaceHandlers = [
  // Eskalace Grid
  http.get(`${BASE}/api/Eskalace/Grid`, () => {
    return HttpResponse.json(pagedOutput(mockEskalace));
  }),

  // ChangeLog Grid
  http.get(`${BASE}/api/Eskalace/ChangeLog/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),

  // Filter
  http.get(`${BASE}/api/Eskalace/Filter`, () => {
    return HttpResponse.json({
      knr: null,
      eskalaceId: null,
      vin: null,
      eskalaceStatusEnum: [],
      prirazenaSkupinaUzivateluId: [],
      prirazenyUzivatelId: [],
      schvalujeSkupinaUzivateluId: [],
      vstupDatum: { od: null, do: null },
      schvaleniDatum: { od: null, do: null },
      tableOptions: { sorting: null, paging: { skip: 0, count: 50 } },
    });
  }),

  // PocetNezpracovanych
  http.get(`${BASE}/api/Eskalace/PocetNezpracovanych`, () => {
    return HttpResponse.json(responses.pocetNezpracovanych ? responses.pocetNezpracovanych : 2);
  }),

  // Status change actions
  http.post(`${BASE}/api/Eskalace/Schvaleni`, () => {
    return HttpResponse.json(1);
  }),
  http.post(`${BASE}/api/Eskalace/Zamitnuti`, () => {
    return HttpResponse.json(1);
  }),
  http.post(`${BASE}/api/Eskalace/Uzavreni`, () => {
    return HttpResponse.json(1);
  }),
  http.post(`${BASE}/api/Eskalace/Znovuotevreni`, () => {
    return HttpResponse.json(1);
  }),
  http.post(`${BASE}/api/Eskalace/PredaniDoVyroby`, () => {
    return HttpResponse.json(1);
  }),
  http.post(`${BASE}/api/Eskalace/PredaniKeSchvaleni`, () => {
    return HttpResponse.json(1);
  }),
  http.post(`${BASE}/api/Eskalace/PredaniKAnalyze`, () => {
    return HttpResponse.json(1);
  }),
  http.post(`${BASE}/api/Eskalace/PredaniKReseni`, () => {
    return HttpResponse.json(1);
  }),
  http.post(`${BASE}/api/Eskalace/VraceniKAnalyze`, () => {
    return HttpResponse.json(1);
  }),

  // UzivatelPrirazeno
  http.post(`${BASE}/api/Eskalace/UzivatelPrirazeno`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete(`${BASE}/api/Eskalace/UzivatelPrirazeno`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/Eskalace/UzivatelPrirazeno/List`, () => {
    return HttpResponse.json([]);
  }),
  http.post(`${BASE}/api/Eskalace/UzivatelPrirazeno/List`, () => {
    return HttpResponse.json(1);
  }),

  // UzivatelSchvaluje
  http.post(`${BASE}/api/Eskalace/UzivatelSchvaluje`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete(`${BASE}/api/Eskalace/UzivatelSchvaluje`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/Eskalace/UzivatelSchvaluje/List`, () => {
    return HttpResponse.json([]);
  }),
  http.post(`${BASE}/api/Eskalace/UzivatelSchvaluje/List`, () => {
    return HttpResponse.json(1);
  }),

  // GetByMasterId
  http.get(`${BASE}/api/Eskalace/GetByMasterId`, () => {
    return HttpResponse.json(responses.eskalaceGetByMasterId ? responses.eskalaceGetByMasterId : []);
  }),

  // Eskalace CRUD
  http.post(`${BASE}/api/Eskalace`, () => {
    return HttpResponse.json(1);
  }),
  http.get(`${BASE}/api/Eskalace/:id`, ({ params }) => {
    const id = Number(params.id);
    const eskalace = mockEskalace.find((e) => e.id === id);
    if (!eskalace) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({
      ...eskalace,
      schvaleniUzivatelId: null,
      schvalujeSkupinaUzivateluId: null,
      prirazenaSkupinaUzivateluId: 1,
      ridiciJednotkaId: null,
      uzivatelSchvaluje: [],
      uzivatelPrirazeno: [],
      komentarText: '',
      schvaleniUzivatelText: null,
      vstupUzivatelId: '00000000-0000-0000-0000-000000000001',
      vstupUzivatelText: 'Test User',
      schvalujeSkupinaUzivateluText: null,
      prirazenaSkupinaUzivateluText: 'Analyza',
      operationEskalaceSchvaleni: false,
      operationEskalacePredani: true,
      operationEskalaceCloseNiO: false,
      operationDeletePriloha: false,
      vraceniBaterieId: null,
      uzivatelSchvalujeDropDownList: [],
      uzivatelPrirazenoDropDownList: [],
      operations: 15,
    });
  }),
  http.put(`${BASE}/api/Eskalace/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Eskalace/:id`, () => {
    return HttpResponse.json(1);
  }),

  // Eskalace Komentar
  http.get(`${BASE}/api/Eskalace/Komentar/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.post(`${BASE}/api/Eskalace/Komentar`, () => {
    return HttpResponse.json(1);
  }),
  http.put(`${BASE}/api/Eskalace/Komentar/:id`, () => {
    return HttpResponse.json(1);
  }),
  http.delete(`${BASE}/api/Eskalace/Komentar/:id`, () => {
    return HttpResponse.json(1);
  }),

  // Eskalace Priloha
  http.get(`${BASE}/api/Eskalace/Priloha/Grid`, () => {
    return HttpResponse.json(pagedOutput([]));
  }),
  http.post(`${BASE}/api/Eskalace/Priloha`, () => {
    return HttpResponse.json(1, { status: 201 });
  }),
  http.get(`${BASE}/api/Eskalace/Priloha`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.delete(`${BASE}/api/Eskalace/Priloha`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
