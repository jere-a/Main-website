import posthog from "@lib/analytics";
import * as CookieConsent from "vanilla-cookieconsent";

import "vanilla-cookieconsent/dist/cookieconsent.css";

await CookieConsent.run({
  onConsent: () => {
    posthog.opt_in_capturing();
  },
  onModalReady: () => {
    const documentElementClassList = document.documentElement.classList;
    const ccDarkMode = "cc-darkmode";
    if (!documentElementClassList.contains(ccDarkMode)) documentElementClassList.add(ccDarkMode);
  },
  guiOptions: {
    consentModal: {
      layout: "box inline",
      position: "bottom left",
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      position: "right",
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  categories: {
    necessary: {
      readOnly: true,
    },
  },
  language: {
    default: "en",
    autoDetect: "browser",
    translations: {
      en: {
        consentModal: {
          title: "Hello traveller, it's cookie time!",
          description:
            "Cookies can be found here and elsewhere, but for us, cookies are only Posthog's own cookies.",
          closeIconLabel: "",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          showPreferencesBtn: "Manage preferences",
          footer: '<a href="#link">Privacy Policy</a>\n<a href="#link">Terms and conditions</a>',
        },
        preferencesModal: {
          title: "Consent Preferences Center",
          closeIconLabel: "Close modal",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Save preferences",
          serviceCounterLabel: "Service|Services",
          sections: [
            {
              title: "Cookie Usage",
              description:
                "The only cookies are Posthog's own cookies, which they have developed independently for their own purposes only. You can read more on their website.",
            },
            {
              title: 'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
              description: "Necessary cookies",
              linkedCategory: "necessary",
            },
            {
              title: "More information",
              description:
                'For any query in relation to my policy on cookies and your choices, please <a class="cc__link" href="#yourdomain.com">contact me</a>.',
            },
          ],
        },
      },
      fi: {
        consentModal: {
          title: "Hei matkailija, eväste aika!",
          description:
            "Evästeitä löytyy täältä ja muualtakin. mutta meillä evästeet ovat vain posthogin oma eväste.",
          closeIconLabel: "",
          acceptAllBtn: "Hyväksyn",
          acceptNecessaryBtn: "En hyväksy",
          showPreferencesBtn: "Muokkaa eväste asetuksiasi",
          footer:
            '<a href="#link">Politique de confidentialité</a>\n<a href="#link">Termes et conditions</a>',
        },
        preferencesModal: {
          title: "Eväste asetukset",
          closeIconLabel: "Fermer la modale",
          acceptAllBtn: "Hyväksyn muokatut asetukset",
          acceptNecessaryBtn: "En hyväksy asetuksia",
          savePreferencesBtn: "Tallenna eväste asetukset",
          serviceCounterLabel: "Palvelut",
          sections: [
            {
              title: "Evästeiden käyttö",
              description:
                "Evästeitä on ainoastaan posthogin oma eväste joka he ovat kehitelleet itsenäisesti vain heidän tarkoituksiin voit lukea lisää heidän sivuiltansa.",
            },
            {
              title:
                'Ehdottoman välttämättömät evästeet <span class="pm__badge">aina käytössä</span>',
              description: "Välttämättömiä evästeitä.",
              linkedCategory: "necessary",
            },
            {
              title: "Lisätietoja",
              description:
                'Jos sinulla on kysyttävää evästekäytännöstäni ja valinnoistasi, <a class="cc__link" href="#yourdomain.com">ota minuun yhteyttä</a>.',
            },
          ],
        },
      },
    },
  },
});
