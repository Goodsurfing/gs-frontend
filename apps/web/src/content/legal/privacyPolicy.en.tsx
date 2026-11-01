import { BULLETS, type LegalDocument, NUMBERED, SECTION, SUBTITLE, TITLE } from "./styles";

/**
 * Политика конфиденциальности (английский) — текст перенесён из старого фронта
 * (src/pages/PrivacyPolicyPage/ui/TextContent/TextContent.en.tsx) без изменений; абзацы со
 * вложенными списками и подзаголовками — div, а не p (иначе серверная
 * разметка невалидна и браузер разрезает абзац).
 */
export const PRIVACY_POLICY_EN: LegalDocument = {
    menu: [
        { id: "1", title: "1. General Provisions" },
        { id: "2", title: "2. Principles and Purposes of Personal Data Processing" },
        { id: "3", title: "3. Legal Grounds for Personal Data Processing by the Organization" },
        { id: "4", title: "4. Scope and Categories of Processed Personal Data, Categories of Personal Data Subjects" },
        { id: "5", title: "5. Procedure and Conditions for Personal Data Processing" },
        { id: "6", title: "6. List of Actions with Personal Data and Methods of Their Processing" },
        { id: "7", title: "7. Rights of Personal Data Subjects" },
        { id: "8", title: "8. Measures Taken by the Organization to Ensure Compliance with the Operator’s Obligations When Processing Personal Data" },
        { id: "9", title: "9. Responsibility for Organizing the Processing of Personal Data" },
    ],
    body: (
        <>
            <div className={SECTION} id="1">
                <h2 className={TITLE}>1. General Provisions</h2>
                <div>
                    This Policy has been developed in accordance with Part 2 of
                    Article 18.1 of Federal Law “On Personal Data” No. 152-FZ of
                    July 27, 2006, and taking into account the requirements of
                    the Constitution of the Russian Federation, legislative and
                    other regulatory legal acts of the Russian Federation in the
                    field of personal data, and defines the procedure for the
                    activities of the autonomous non-profit organization
                    “Goodsurfing - Good Journeys” (hereinafter – the
                    Organization) with respect to the processing of personal
                    data. Definitions and abbreviations used in the Policy on
                    the Processing of Personal Data of the autonomous non-profit
                    organization “Goodsurfing - Good Journeys” (hereinafter –
                    the Policy).
                    <h3 className={SUBTITLE}>Personal data</h3>
                    Any information relating to a directly or indirectly
                    identified or identifiable natural person (personal data
                    subject).
                    <h3 className={SUBTITLE}>Operator</h3>
                    A state authority, municipal authority, legal entity or
                    natural person that, independently or jointly with other
                    persons, organizes and/or carries out the processing of
                    personal data, and also determines the purposes of
                    processing personal data, the composition of personal data
                    subject to processing, and the actions (operations)
                    performed with personal data.
                    <h3 className={SUBTITLE}>Processing of personal data</h3>
                    Any action (operation) or set of actions (operations)
                    performed with personal data using automation tools or
                    without using such tools, including collection, recording,
                    systematization, accumulation, storage, clarification
                    (updating, modification), extraction, use, transfer
                    (dissemination, provision, access), depersonalization,
                    blocking, deletion, and destruction of personal data.
                    <h3 className={SUBTITLE}>Automated processing of personal data</h3>
                    Processing of personal data by means of computer technology.
                    <h3 className={SUBTITLE}>Provision of personal data</h3>
                    Actions aimed at disclosing personal data to a specific
                    person or a specific group of persons.
                    <h3 className={SUBTITLE}>Dissemination of personal data</h3>
                    Actions aimed at disclosing personal data to an indefinite
                    group of persons.
                    <h3 className={SUBTITLE}>Cross-border transfer of personal data</h3>
                    Transfer of personal data to the territory of a foreign
                    state to a foreign state authority, a foreign natural person
                    or a foreign legal entity.
                    <h3 className={SUBTITLE}>Blocking of personal data</h3>
                    Temporary suspension of the processing of personal data
                    (except in cases where processing is necessary for the
                    clarification of personal data).
                    <h3 className={SUBTITLE}>Destruction of personal data</h3>
                    Actions as a result of which it becomes impossible to
                    restore the content of personal data in the personal data
                    information system and/or as a result of which the material
                    carriers of personal data are destroyed.
                    <h3 className={SUBTITLE}>Depersonalization of personal data</h3>
                    Actions as a result of which it becomes impossible, without
                    the use of additional information, to determine the
                    affiliation of personal data with a specific personal data
                    subject.
                    <h3 className={SUBTITLE}>Personal data information system</h3>
                    The totality of personal data contained in databases and
                    the information technologies and technical means ensuring
                    their processing.
                    <h3 className={SUBTITLE}>Personal data subject</h3>
                    A natural person who is directly or indirectly identified or
                    identifiable with the help of personal data.
                    <h3 className={SUBTITLE}>Confidentiality of personal data</h3>
                    A mandatory requirement for the operator or another person
                    who has gained access to personal data not to permit their
                    dissemination without the consent of the personal data
                    subject or another lawful basis.
                </div>
            </div>
            <div className={SECTION} id="2">
                <h2 className={TITLE}>
                    2. Principles and Purposes of Personal Data Processing
                </h2>
                <div>
                    The Organization, as an operator of personal data, processes
                    personal data of the Organization’s employees and of
                    personal data subjects who are not in employment
                    relationships with the Organization.
                    <br />
                    <br />
                    The processing of personal data in the Organization is
                    carried out taking into account the need to ensure the
                    protection of the rights and freedoms of the Organization’s
                    employees and other personal data subjects, including the
                    protection of the right to privacy, personal and family
                    secrets, on the basis of the following principles:
                    <ul className={BULLETS}>
                        <li>
                            personal data are processed in the Organization on a
                            lawful and fair basis;
                        </li>
                        <li>
                            the processing of personal data is limited to the
                            achievement of specific, predetermined and lawful
                            purposes. Processing of personal data that is
                            incompatible with the purposes of collecting personal
                            data is not permitted;
                        </li>
                        <li>
                            merging of databases containing personal data, the
                            processing of which is carried out for purposes that
                            are incompatible with each other, is not permitted;
                        </li>
                        <li>
                            only personal data that meet the purposes of their
                            processing are subject to processing;
                        </li>
                        <li>
                            the content and volume of the personal data processed
                            correspond to the declared purposes of processing.
                            Redundancy of the personal data processed in relation
                            to the declared purposes of their processing is not
                            permitted;
                        </li>
                        <li>
                            when processing personal data, the accuracy,
                            sufficiency and, where necessary, the relevance of
                            personal data in relation to the purposes of
                            processing are ensured. The Organization takes the
                            necessary measures, or ensures that such measures are
                            taken, to delete or clarify incomplete or inaccurate
                            personal data;
                        </li>
                        <li>
                            personal data are stored in a form that makes it
                            possible to determine the personal data subject, for
                            no longer than the purposes of processing personal
                            data require, unless the storage period is established
                            by federal law or by a contract under which the
                            personal data subject is a party, beneficiary or
                            guarantor;
                        </li>
                        <li>
                            processed personal data are destroyed or
                            depersonalized upon achievement of the purposes of
                            processing or in the event that the need to achieve
                            these purposes no longer exists, unless otherwise
                            provided by federal law.
                        </li>
                    </ul>
                    Personal data are processed in the Organization for the
                    following purposes:
                    <ul className={BULLETS}>
                        <li>
                            ensuring compliance with the Constitution of the
                            Russian Federation, legislative and other regulatory
                            legal acts of the Russian Federation, and the
                            Organization’s local regulatory acts;
                        </li>
                        <li>
                            performing the functions, powers and duties assigned
                            to the Organization by the legislation of the Russian
                            Federation, including providing personal data to
                            state authorities, the Pension Fund of the Russian
                            Federation, the Social Insurance Fund of the Russian
                            Federation, the Federal Compulsory Medical Insurance
                            Fund, and other state bodies;
                        </li>
                        <li>
                            regulating labor relations with the Organization’s
                            employees (assistance in employment, training and
                            career advancement, ensuring personal safety,
                            monitoring the quantity and quality of work performed,
                            and ensuring the safety of property);
                        </li>
                        <li>
                            providing the Organization’s employees and members of
                            their families with additional guarantees and
                            compensation, including non-state pension provision,
                            voluntary medical insurance, medical services and
                            other types of social security
                        </li>
                        <li>
                            protecting the life, health or other vital interests
                            of personal data subjects;
                        </li>
                        <li>
                            preparing, concluding, performing and terminating
                            contracts with counterparties;
                        </li>
                        <li>
                            forming reference materials for the internal
                            information support of the Organization’s activities,
                            its branches and representative offices, as well as
                            the Organization’s subsidiaries;
                        </li>
                        <li>
                            enforcing court decisions and the acts of other bodies
                            or officials that are subject to enforcement in
                            accordance with the legislation of the Russian
                            Federation on enforcement proceedings;
                        </li>
                        <li>
                            exercising the rights and legitimate interests of the
                            Organization within the framework of the types of
                            activity provided for by the Organization’s Charter
                            and other local regulatory acts, including, but not
                            limited to, registering personal data subjects to
                            provide them with access to the Organization’s
                            functionality, implemented, among other means, through
                            electronic resources, or third parties, or achieving
                            socially significant goals;
                        </li>
                        <li>
                            providing personal data subjects with the opportunity
                            to access the functionality implemented by the
                            Organization, including through the Organization’s
                            electronic resources, for the purpose of enabling
                            participation in events, including receiving
                            invitations to events, participating in competitions,
                            obtaining information about internships, projects,
                            etc.;
                        </li>
                        <li>
                            maintaining the history of social activity of personal
                            data subjects;
                        </li>
                        <li>for other lawful purposes.</li>
                    </ul>
                </div>
            </div>
            <div className={SECTION} id="3">
                <h2 className={TITLE}>
                    3. Legal Grounds for Processing Personal Data in the
                    Organization
                </h2>
                <div>
                    The legal basis for the processing of personal data is the
                    totality of federal laws and the regulatory legal acts
                    adopted on their basis that govern relations connected with
                    the activities of the Organization; the Organization’s
                    constituent documents; contracts concluded between the
                    Organization and the personal data subject; and the consent
                    to the processing of personal data (in cases not expressly
                    provided for by the legislation of the Russian Federation but
                    corresponding to the powers of the Organization), in
                    fulfillment of which and in accordance with which the
                    Organization processes personal data, including, but not
                    limited to:
                    <ul className={BULLETS}>
                        <li>the Constitution of the Russian Federation;</li>
                        <li>the Labor Code of the Russian Federation;</li>
                        <li>the Civil Code of the Russian Federation</li>
                        <li>the Tax Code of the Russian Federation;</li>
                        <li>
                            Law of the Russian Federation dated 29.12.2012 No.
                            273-FZ “On Education in the Russian Federation”;
                        </li>
                        <li>
                            other regulatory legal acts of the Russian Federation
                            and normative documents of authorized state authorities;
                        </li>
                        <li>the Organization’s Charter;</li>
                        <li>
                            contracts and agreements to which the Organization is
                            one of the parties
                        </li>
                        <li>
                            the consent of the personal data subject to the
                            processing of his or her personal data;
                        </li>
                        <li>other documents.</li>
                    </ul>
                </div>
            </div>
            <div className={SECTION} id="4">
                <h2 className={TITLE}>
                    4. Scope and Categories of Personal Data Processed, and
                    Categories of Personal Data Subjects
                </h2>
                <div>
                    The list of personal data processed in the Organization is
                    determined in accordance with the legislation of the Russian
                    Federation and the Organization’s local regulatory acts,
                    taking into account the purposes of personal data processing
                    specified in Section 2 of the Policy.
                    <br />
                    <br />
                    The processing of special categories of personal data
                    concerning racial origin, religious beliefs or intimate life
                    is not carried out by the Organization.
                    <br />
                    <br />
                    The processing of special categories of personal data
                    concerning political views, philosophical beliefs or state of
                    health is carried out in strict compliance with, and in the
                    manner established by, the legislation of the Russian
                    Federation.
                    <br />
                    <br />
                    The Organization processes personal data of the following
                    categories of personal data subjects:
                    <ul className={BULLETS}>
                        <li>
                            employees of the Organization, former employees,
                            candidates for vacant positions, as well as relatives
                            of employees;
                        </li>
                        <li>
                            clients and counterparties of the Organization
                            (natural persons);
                        </li>
                        <li>
                            representatives/employees of clients and counterparties
                            of the Organization (legal entities);
                        </li>
                    </ul>
                    The composition of the personal data processed by the
                    Organization within the framework of events held by the
                    Organization for natural persons is determined by the specific
                    purposes of processing and is specified in the consents to the
                    processing of personal data of the subjects.
                </div>
            </div>
            <div className={SECTION} id="5">
                <h2 className={TITLE}>
                    5. Procedure and Conditions for Processing Personal Data
                </h2>
                <div>
                    When processing personal data, the Organization:
                    <ul className={BULLETS}>
                        <li>
                            takes measures necessary and sufficient to ensure
                            compliance with the requirements of the legislation of
                            the Russian Federation and the Organization’s local
                            regulatory acts in the field of personal data;
                        </li>
                        <li>
                            takes legal, organizational and technical measures to
                            protect personal data from unlawful or accidental
                            access, destruction, alteration, blocking, copying,
                            provision or dissemination of personal data, as well
                            as from other unlawful actions with respect to
                            personal data;
                        </li>
                        <li>
                            appoints a person responsible for organizing the
                            processing of personal data in the Organization;
                        </li>
                        <li>
                            issues local regulatory acts determining the policy
                            and matters of processing and protection of personal
                            data in the Organization;
                        </li>
                        <li>
                            familiarizes the employees of the Organization, its
                            branches and representative offices who directly carry
                            out the processing of personal data with the provisions
                            of the legislation of the Russian Federation and the
                            Organization’s local regulatory acts in the field of
                            personal data, including the requirements for the
                            protection of personal data, and provides training for
                            these employees;
                        </li>
                        <li>
                            publishes this Policy or otherwise ensures unrestricted
                            access to it;
                        </li>
                        <li>
                            informs personal data subjects or their representatives,
                            in the established manner, of the existence of personal
                            data relating to the relevant subjects, and provides an
                            opportunity to familiarize themselves with such personal
                            data upon request and/or receipt of inquiries from such
                            personal data subjects or their representatives, unless
                            otherwise provided by the legislation of the Russian
                            Federation;
                        </li>
                        <li>
                            terminates processing and destroys personal data in the
                            cases provided for by the legislation of the Russian
                            Federation in the field of personal data;
                        </li>
                        <li>
                            performs other actions provided for by the legislation
                            of the Russian Federation in the field of personal data.
                        </li>
                    </ul>
                    Conditions for the processing of personal data in the
                    Organization.
                    <br />
                    <br />
                    The processing of personal data in the Organization is carried
                    out with the consent of the personal data subject to the
                    processing of his or her personal data, unless otherwise
                    provided by the legislation of the Russian Federation in the
                    field of personal data.
                    <br />
                    <br />
                    Without the consent of the personal data subject, the
                    Organization does not disclose personal data to third parties
                    or disseminate personal data, unless otherwise provided by
                    federal law.
                    <br />
                    <br />
                    The Organization may entrust the processing of personal data
                    to another person with the consent of the personal data
                    subject, on the basis of a contract concluded with that
                    person. The contract must contain a list of actions
                    (operations) with personal data to be performed by the person
                    processing personal data, the purposes of processing, the
                    obligation of such person to maintain the confidentiality of
                    personal data and to ensure the security of personal data
                    during their processing, as well as requirements for the
                    protection of the personal data being processed in accordance
                    with Article 19 of the Federal Law “On Personal Data”.
                    <br />
                    <br />
                    For the purposes of internal information support, the
                    Organization may create internal reference materials which,
                    with the written consent of the personal data subject and
                    unless otherwise provided by the legislation of the Russian
                    Federation, may include his or her surname, first name,
                    patronymic, place of work, position, year and place of birth,
                    address, subscriber number, e-mail address, and other personal
                    data communicated by the personal data subject.
                    <br />
                    <br />
                    Access to personal data processed in the Organization is
                    permitted only to employees of the Organization holding
                    positions included in the list of positions of the structural
                    units of the Organization, its branches and representative
                    offices, the holding of which involves the processing of
                    personal data.
                    <br />
                    <br />
                    The Organization terminates the processing of personal data
                    upon achievement of the purposes of processing personal data,
                    expiration of the term of validity of consent, withdrawal of
                    consent by the personal data subject to the processing of his
                    or her personal data, as well as upon detection of unlawful
                    processing of personal data. The specific periods of
                    processing of personal data by the Organization within the
                    framework of events held by the Organization for natural
                    persons are specified in the consents to the processing of the
                    subject’s personal data.
                </div>
            </div>
            <div className={SECTION} id="6">
                <h2 className={TITLE}>
                    6. List of Actions with Personal Data and Methods of Their
                    Processing
                </h2>
                <div>
                    The Organization carries out the collection, recording,
                    systematization, accumulation, storage, clarification
                    (updating, modification), extraction, use, transfer
                    (dissemination, provision, access), depersonalization,
                    blocking, deletion and destruction of personal data.
                    <br />
                    <br />
                    The processing of personal data in the Organization is carried
                    out by the following methods:
                    <ul className={BULLETS}>
                        <li>non-automated processing of personal data;</li>
                        <li>
                            automated processing of personal data with or without
                            transmission of the information obtained over
                            information and telecommunication networks;
                        </li>
                        <li>mixed processing of personal data.</li>
                    </ul>
                </div>
            </div>
            <div className={SECTION} id="7">
                <h2 className={TITLE}>
                    7. Rights of Personal Data Subjects
                </h2>
                <div>
                    Personal data subjects have the right to:
                    <ul className={BULLETS}>
                        <li>
                            full information about their personal data processed
                            in the Organization;
                        </li>
                        <li>
                            access to their personal data, including the right to
                            obtain a copy of any record containing their personal
                            data, except in cases provided for by federal law, as
                            well as access to their medical data with the
                            assistance of a medical specialist of their choice;
                        </li>
                        <li>
                            clarification of their personal data, their blocking or
                            destruction in the event that the personal data are
                            incomplete, outdated, inaccurate, unlawfully obtained or
                            not necessary for the stated purpose of processing;
                        </li>
                        <li>
                            withdrawal of consent to the processing of personal
                            data;
                        </li>
                        <li>
                            taking measures provided for by law to protect their
                            rights;
                        </li>
                        <li>
                            appealing against actions or omissions of the
                            Organization carried out in violation of the
                            requirements of the legislation of the Russian
                            Federation in the field of personal data, to the
                            authorized body for the protection of the rights of
                            personal data subjects or to a court
                        </li>
                        <li>
                            exercising other rights provided for by the legislation
                            of the Russian Federation.
                        </li>
                    </ul>
                </div>
            </div>
            <div className={SECTION} id="8">
                <h2 className={TITLE}>
                    8. Measures Taken by the Organization to Ensure the
                    Performance of Operator Obligations When Processing Personal
                    Data
                </h2>
                <div>
                    The measures necessary and sufficient to ensure that the
                    Organization performs the operator’s obligations provided for
                    by the legislation of the Russian Federation in the field of
                    personal data include:
                    <ul className={BULLETS}>
                        <li>
                            appointing persons responsible for organizing the
                            processing of personal data in the Organization;
                        </li>
                        <li>
                            adopting local regulatory acts and other documents in
                            the field of processing and protection of personal
                            data;
                        </li>
                        <li>
                            organizing training and methodological work with the
                            employees of the structural units of the Organization,
                            its branches and representative offices who hold
                            positions involving the processing of personal data;
                        </li>
                        <li>
                            obtaining the consent of personal data subjects to the
                            processing of their personal data, except in cases
                            provided for by the legislation of the Russian
                            Federation;
                        </li>
                        <li>
                            separating personal data processed without the use of
                            automation tools from other information, in particular
                            by recording them on separate material carriers of
                            personal data, in special sections;
                        </li>
                        <li>
                            ensuring separate storage of personal data and their
                            material carriers whose processing is carried out for
                            different purposes and which contain different
                            categories of personal data;
                        </li>
                        <li>
                            establishing a prohibition on the transmission of
                            personal data over open communication channels,
                            computer networks outside the controlled zone, the
                            Organization’s unified data transmission network
                            (EVSPD) and the Internet without the application of
                            the security measures established in the Organization
                            for personal data (except for publicly available and/or
                            depersonalized personal data);
                        </li>
                        <li>
                            storing material carriers of personal data in
                            compliance with conditions that ensure the safety of
                            personal data and exclude unauthorized access to them;
                        </li>
                        <li>
                            carrying out internal control over the compliance of
                            personal data processing with Federal Law “On Personal
                            Data” No. 152-FZ of July 27, 2006, and the regulatory
                            legal acts adopted in accordance with it, the
                            requirements for the protection of personal data, this
                            Policy, and the Organization’s local regulatory acts;
                        </li>
                        <li>
                            other measures provided for by the legislation of the
                            Russian Federation in the field of personal data.
                        </li>
                    </ul>
                    Measures to ensure the security of personal data during their
                    processing in personal data information systems are
                    established in accordance with the Organization’s local
                    regulatory acts governing the security of personal data during
                    their processing in the Organization’s personal data
                    information systems
                </div>
            </div>
            <div className={SECTION} id="9">
                <h2 className={TITLE}>
                    9. Responsibility for Organizing the Processing of Personal
                    Data
                </h2>
                <div>
                    The Organization appoints persons responsible for organizing
                    the processing of personal data.
                    <br />
                    <br />
                    The person responsible for organizing the processing of
                    personal data receives instructions directly from the
                    Organization’s executive body and reports to it.
                    <br />
                    <br />
                    The person responsible for organizing the processing of
                    personal data is, in particular, obliged to:
                    <ol className={NUMBERED}>
                        <li>
                            exercise internal control over the compliance by the
                            operator and its employees with the legislation of the
                            Russian Federation on personal data, including the
                            requirements for the protection of personal data;
                        </li>
                        <li>
                            bring to the attention of the operator’s employees the
                            provisions of the legislation of the Russian Federation
                            on personal data, local acts on matters of personal
                            data processing, and requirements for the protection of
                            personal data;
                        </li>
                        <li>
                            organize the receipt and processing of appeals and
                            requests from personal data subjects or their
                            representatives and/or exercise control over the
                            receipt and processing of such appeals and requests.
                        </li>
                    </ol>
                </div>
            </div>
    
        </>
    ),
};
