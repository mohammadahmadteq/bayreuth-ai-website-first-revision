import type { MembershipFormText, MembershipLanguage } from '../types/content'

// The legal and fee texts are copied word for word from the paper form in
// public/membership/; change them there first, then here. Only the labels the
// paper does not need (hints, errors, status messages) were written for the web.
// The bank details are left out on purpose: applicants get them by email, so
// the IBAN is not published where scrapers can collect it.

export const membershipPaperForm = '/membership/Mitgliedsantrag_Bayreuth_AI_Association.pdf'

export const membershipFormText: Record<MembershipLanguage, MembershipFormText> = {
  en: {
    languageName: 'English',
    eyebrow: 'Bayreuth AI Association e.V.',
    title: 'Membership application',
    intro: 'Fields marked * are mandatory.',
    sections: {
      personal: '1. Personal details',
      type: '2. Requested type of membership',
      fee: '3. Fee and payment',
      communication: '4. Communication (voluntary)',
      declarations: '5. Declarations',
      privacy: '6. Data protection and data subject rights',
      confirmation: 'Confirmation',
    },
    fields: {
      firstName: 'First name',
      surname: 'Surname',
      organisation: 'Organisation and contact person',
      street: 'Street and number',
      postalCity: 'Postal code and city',
      country: 'Country',
      email: 'Email',
      emailHint: 'Association’s main contact',
      chosenFee: 'Chosen annual fee (in €)',
      feeReductionRequest: 'Your request (optional)',
      feeReductionHint: 'The board may ask you for more details.',
      mobile: 'Mobile phone number',
      mobileHint: 'With country code, for example +49 151 23456789.',
      confirmationName: 'Full name as confirmation',
    },
    membershipTypes: {
      full: {
        label: 'Full member – €12/year',
        description: 'individual, active participation, with voting rights',
      },
      'supporting-individual': {
        label: 'Supporting member (individual) – freely chosen, from €20/year',
      },
      'supporting-legal': {
        label: 'Supporting member (legal entity) – freely chosen, from €50/year',
      },
      alumni: { label: 'Alumni member – €12/year' },
      corresponding: { label: 'Corresponding member – €20/year' },
    },
    organisationHint:
      'Please also enter the organisation and contact person under 1. Personal details.',
    feeParagraphs: [
      'The membership fee is an annual fee, due at the beginning of the financial year (calendar year); in the year of joining, upon admission. The fee is paid by bank transfer to the association’s account.',
      'The ordinary membership fee is, in principle, €1 per month (€12 per year). Upon written application to the board, the fee may be paid pro rata from the month of joining in the year of entry or may also be waived in full.',
    ],
    feeReduction: 'I am applying for a reduction or waiver of the fee.',
    bankDetailsByEmail:
      'We’ll send you the bank details for the transfer by email once we have received your application.',
    communicationIntro:
      'The following details are voluntary and not a condition of membership. Consent may be withdrawn at any time with future effect (e.g. by email to the board).',
    emailList:
      'Email distribution list: I would like to receive association-related information and announcements at the email address provided above (beyond legally required communications).',
    whatsapp:
      'WhatsApp group: I would like to be added to the association’s WhatsApp group. I am aware that my mobile number will be visible to the other group members and that the service (WhatsApp/Meta) may process personal data outside the EU.',
    declaration:
      'I hereby apply for membership and accept the statutes and the membership and fee regulations as amended. I am aware that membership begins with the board’s admission resolution and that there is no entitlement to admission.',
    privacyText: {
      before:
        'The controller is the board of Bayreuth AI Association e.V., represented by Pascal Fechner (chairman), pascalfechner@outlook.de. The data provided above is processed for the purpose of membership administration and performance of the membership (legal basis: Art. 6(1)(b) GDPR in conjunction with § 10 of the statutes). Data is shared with third parties only where necessary to run the association or where there is a legal basis or consent. The consents given in section 4 are voluntary and may be withdrawn at any time with future effect. You have the right of access, rectification, erasure and restriction of processing, as well as the right to lodge a complaint with a data protection supervisory authority. Details are set out in ',
      link: 'the association’s privacy notice',
      after: '.',
    },
    privacyNoted: 'I have read and noted the data protection information.',
    adultConfirmed: 'I confirm that I am at least 18 years old.',
    minorsNote:
      'Under 18? Please use the paper form below, signed by your legal guardian(s), and send it to the board.',
    submit: 'Send application',
    sending: 'Sending…',
    errors: {
      required: 'Please fill in this field.',
      tooLong: 'This entry is too long.',
      email: 'Please enter a valid email address.',
      membershipType: 'Please choose a type of membership.',
      amount: 'Please enter an amount in euros, for example 25 or 25.50.',
      minimum: (euros) => `The minimum is €${euros} per year.`,
      phone: 'Please enter a mobile number with at least 7 digits, for example +49 151 23456789.',
      declaration: 'Please confirm the declaration to apply.',
      privacy: 'Please confirm that you have read the data protection information.',
      adult: 'The online form is for applicants aged 18 or over.',
    },
    status: {
      unavailable:
        'Online applications aren’t open yet. Until then, please use the paper form at the bottom of this page.',
      checkFields: 'Please check the highlighted fields.',
      failed:
        'Your application could not be sent. Please try again later or use the paper form below.',
      rateLimited:
        'Too many applications have been sent from your connection. Please try again later.',
    },
    confirmation: {
      title: 'Thank you for your application.',
      sent: 'Your application has been sent to the board.',
      admission: 'Membership begins with the board’s admission resolution.',
      payment: 'The fee is due upon admission. We’ll email you the bank details for the transfer.',
      withdraw: 'You can withdraw the consents from section 4 at any time by email to the board.',
    },
    paper: {
      title: 'Prefer paper?',
      text: 'Download the application, fill it in and send it, signed, to the board. Applicants under 18 need the signature of their legal guardian(s).',
      download: 'Download the paper form (PDF)',
    },
  },

  de: {
    languageName: 'Deutsch',
    eyebrow: 'Bayreuth AI Association e.V.',
    title: 'Mitgliedsantrag',
    intro: 'Mit * markierte Felder sind Pflichtangaben.',
    sections: {
      personal: '1. Angaben zur Person',
      type: '2. Gewünschte Mitgliedsart',
      fee: '3. Beitrag und Zahlung',
      communication: '4. Kommunikation (freiwillig)',
      declarations: '5. Erklärungen',
      privacy: '6. Datenschutz und Rechte der Betroffenen',
      confirmation: 'Bestätigung',
    },
    fields: {
      firstName: 'Vorname',
      surname: 'Nachname',
      organisation: 'Firma und Ansprechperson',
      street: 'Straße und Hausnummer',
      postalCity: 'PLZ und Ort',
      country: 'Land',
      email: 'E-Mail',
      emailHint: 'Hauptkontakt des Vereins',
      chosenFee: 'Gewählter Jahresbeitrag (in €)',
      feeReductionRequest: 'Ihre Begründung (optional)',
      feeReductionHint: 'Der Vorstand kann Sie um weitere Angaben bitten.',
      mobile: 'Mobilfunknummer',
      mobileHint: 'Mit Ländervorwahl, zum Beispiel +49 151 23456789.',
      confirmationName: 'Vollständiger Name als Bestätigung',
    },
    membershipTypes: {
      full: {
        label: 'Ordentliches Mitglied – 12 €/Jahr',
        description: 'natürliche Person, aktive Mitarbeit, mit Stimmrecht',
      },
      'supporting-individual': {
        label: 'Fördermitglied (natürliche Person) – frei wählbar ab 20 €/Jahr',
      },
      'supporting-legal': {
        label: 'Fördermitglied (juristische Person) – frei wählbar ab 50 €/Jahr',
      },
      alumni: { label: 'Alumni-Mitglied – 12 €/Jahr' },
      corresponding: { label: 'Korrespondenzmitglied – 20 €/Jahr' },
    },
    organisationHint:
      'Bitte tragen Sie unter 1. Angaben zur Person auch Firma und Ansprechperson ein.',
    feeParagraphs: [
      'Der Mitgliedsbeitrag ist ein Jahresbeitrag und zu Beginn des Geschäftsjahres (Kalenderjahr) fällig; im Jahr des Eintritts mit der Aufnahme. Der Beitrag wird per Überweisung auf das Vereinskonto gezahlt.',
      'Der ordentliche Mitgliedsbeitrag beträgt im Grundsatz 1 € pro Monat (12 € pro Jahr). Auf schriftlichen Antrag beim Vorstand kann der Beitrag im Eintrittsjahr anteilig ab dem Eintrittsmonat gezahlt werden oder vollständig erlassen werden.',
    ],
    feeReduction: 'Ich beantrage eine Ermäßigung oder einen Erlass des Beitrags.',
    bankDetailsByEmail:
      'Die Bankverbindung für die Überweisung senden wir Ihnen per E-Mail, sobald Ihr Antrag bei uns eingegangen ist.',
    communicationIntro:
      'Die folgenden Angaben sind freiwillig und keine Voraussetzung für die Mitgliedschaft. Die Einwilligungen können jederzeit mit Wirkung für die Zukunft widerrufen werden (z. B. per E-Mail an den Vorstand).',
    emailList:
      'E-Mail-Verteiler: Ich möchte über die oben angegebene E-Mail-Adresse vereinsbezogene Informationen und Ankündigungen erhalten (über die rechtlich notwendigen Mitteilungen hinaus).',
    whatsapp:
      'WhatsApp-Gruppe: Ich möchte in die WhatsApp-Gruppe des Vereins aufgenommen werden. Mir ist bewusst, dass meine Mobilfunknummer für die anderen Gruppenmitglieder sichtbar ist und dass der Dienst (WhatsApp/Meta) personenbezogene Daten auch außerhalb der EU verarbeiten kann.',
    declaration:
      'Ich beantrage die Mitgliedschaft und erkenne die Satzung sowie die Mitglieder- und Beitragsordnung in der jeweils gültigen Fassung an. Mir ist bekannt, dass die Mitgliedschaft mit dem Aufnahmebeschluss des Vorstands beginnt und kein Anspruch auf Aufnahme besteht.',
    privacyText: {
      before:
        'Verantwortlich ist der Vorstand der Bayreuth AI Association e.V., vertreten durch Pascal Fechner (1. Vorsitzender), pascalfechner@outlook.de. Die oben angegebenen Daten werden zum Zweck der Mitgliederverwaltung und zur Durchführung der Mitgliedschaft verarbeitet (Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO i. V. m. § 10 der Satzung). Eine Weitergabe an Dritte erfolgt nur, soweit dies zur Vereinsführung erforderlich ist oder eine gesetzliche Grundlage bzw. Einwilligung besteht. Die in Abschnitt 4 erteilten Einwilligungen sind freiwillig und jederzeit mit Wirkung für die Zukunft widerrufbar. Es bestehen die Rechte auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung sowie ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde. Einzelheiten regelt ',
      link: 'die Datenschutzerklärung des Vereins',
      after: '.',
    },
    privacyNoted: 'Ich habe die Datenschutzhinweise zur Kenntnis genommen.',
    adultConfirmed: 'Ich bestätige, dass ich mindestens 18 Jahre alt bin.',
    minorsNote:
      'Unter 18? Bitte nutzen Sie den Papierantrag unten, unterschrieben von Ihren gesetzlichen Vertretern, und senden Sie ihn an den Vorstand.',
    submit: 'Antrag absenden',
    sending: 'Wird gesendet …',
    errors: {
      required: 'Bitte füllen Sie dieses Feld aus.',
      tooLong: 'Diese Angabe ist zu lang.',
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      membershipType: 'Bitte wählen Sie eine Mitgliedsart.',
      amount: 'Bitte geben Sie einen Betrag in Euro ein, zum Beispiel 25 oder 25,50.',
      minimum: (euros) => `Der Mindestbetrag ist ${euros} € pro Jahr.`,
      phone:
        'Bitte geben Sie eine Mobilfunknummer mit mindestens 7 Ziffern ein, zum Beispiel +49 151 23456789.',
      declaration: 'Bitte bestätigen Sie die Erklärung, um den Antrag zu stellen.',
      privacy:
        'Bitte bestätigen Sie, dass Sie die Datenschutzhinweise zur Kenntnis genommen haben.',
      adult: 'Das Online-Formular ist für Antragstellende ab 18 Jahren.',
    },
    status: {
      unavailable:
        'Online-Anträge sind noch nicht freigeschaltet. Bis dahin nutzen Sie bitte den Papierantrag unten auf dieser Seite.',
      checkFields: 'Bitte prüfen Sie die markierten Felder.',
      failed:
        'Ihr Antrag konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder nutzen Sie den Papierantrag unten.',
      rateLimited:
        'Von Ihrer Verbindung wurden zu viele Anträge gesendet. Bitte versuchen Sie es später erneut.',
    },
    confirmation: {
      title: 'Vielen Dank für Ihren Antrag.',
      sent: 'Ihr Antrag wurde an den Vorstand gesendet.',
      admission: 'Die Mitgliedschaft beginnt mit dem Aufnahmebeschluss des Vorstands.',
      payment:
        'Der Beitrag ist mit der Aufnahme fällig. Die Bankverbindung für die Überweisung senden wir Ihnen per E-Mail.',
      withdraw:
        'Die Einwilligungen aus Abschnitt 4 können Sie jederzeit per E-Mail an den Vorstand widerrufen.',
    },
    paper: {
      title: 'Lieber auf Papier?',
      text: 'Laden Sie den Antrag herunter, füllen Sie ihn aus und senden Sie ihn unterschrieben an den Vorstand. Bei Minderjährigen ist die Unterschrift der/des gesetzlichen Vertreter(s) nötig.',
      download: 'Papierantrag herunterladen (PDF)',
    },
  },
}
