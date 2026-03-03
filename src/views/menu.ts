import { MenuType } from '@/template/menu/constants';
import { About } from './about';
import { Nastaveni } from './administrace/nastaveni';
import { Blikacka } from './blikacka';
import { Barva2 } from './ciselniky/barva2';
import { Barva4 } from './ciselniky/barva4';
import { ModelovaSkupina } from './ciselniky/modelovaSkupina';
import { ModelovaTrida } from './ciselniky/modelovaTrida';
import { Eskalace } from './eskalace';
import { Scanner } from './scanner';
import { Skupina } from './uzivatel/skupina';
import { Vozidlo } from './vozidlo';
import { VozidloStitek } from './vozidloStitek';
import { VyrobniLinka } from './vyrobniLinka';
import { VyrobniLinkaKonfigurace } from './vyrobniLinka/konfigurace';
import { VozidloZavadaNavrhovana } from './vozidlo/zavada/navrhovane';
import { RidiciJednotka } from './ciselniky/ridiciJednotka';
import { AutomatickeZpracovaniTestu } from './ciselniky/automatickeZpracovaniTestu';
import { Uzivatel } from './uzivatel';
import { VraceniBaterie } from './vraceniBaterie';
import { TypBaterie } from './ciselniky/typBaterie';
import RiDatabase2Line from 'vue-remix-icons/icons/ri-database-2-line.vue';

export const menu = [
  Scanner.menu[1],
  ...Vozidlo.menu,
  Blikacka.menu,
  Eskalace.menu,
  VraceniBaterie.menu,
  // Tiket.menu,
  VozidloZavadaNavrhovana.menu,
  {
    i18nKey: 'ciselnik',
    menuType: MenuType.SUBMENU,
    icon: RiDatabase2Line,
    items: [
      VyrobniLinkaKonfigurace.menu,
      VyrobniLinka.menu,
      Barva2.menu,
      Barva4.menu,
      Skupina.menu,
      VozidloStitek.menu,
      ModelovaSkupina.menu,
      ModelovaTrida.menu,
      RidiciJednotka.menu,
      AutomatickeZpracovaniTestu.menu,
      Uzivatel.menu,
      TypBaterie.menu,
    ],
  },
  Nastaveni.menu,
  About.menu,
];
