import cn from "classnames";
import React, { FC } from "react";

import styles from "./TextContent.module.scss";

interface TextContentProps {
    className?: string;
}

export const TextContentEn: FC<TextContentProps> = (props: TextContentProps) => {
    const { className } = props;
    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.content} id="1">
                <h2 className={styles.title}>1. General Provisions</h2>
                <p className={styles.description}>
                    1.1. The Goodsurfing Platform is a resource that facilitates
                    connections between volunteers and travelers (hereinafter -
                    Goodsurfer), organizers of volunteer projects (hereinafter -
                    Host) and employers.
                    <br />
                    <br />
                    1.2. A Host or employer posts information about a project on
                    the Goodsurfing Platform in order to find assistance in its
                    implementation, achieve the goals of the project, as well as
                    encourage joint work, learning and cultural exchange.
                    <br />
                    <br />
                    1.3. A Goodsurfer may apply to participate in a project. In
                    exchange for assistance in carrying out the project
                    activities, a Goodsurfer may receive free accommodation,
                    meals, excursions and/or other benefits established by the
                    Host or employer, and the project rules. The Goodsurfer, the
                    Host and the employer are hereinafter collectively referred
                    to as Users.
                    <br />
                    <br />
                    1.4. The Goodsurfing Platform does not own, create or manage
                    projects created by Hosts and employers, does not organize
                    trips, is not an intermediary in labor relations and bears
                    no responsibility for agreements reached between Users after
                    their first meeting on the platform.
                    <br />
                    <br />
                    1.5. Hosts and employers bear full responsibility for the
                    projects they post. When Goodsurfers apply to participate in
                    a project and receive confirmation, they enter into an
                    agreement directly with the Host or employer.
                    <br />
                    <br />
                    1.6. Goodsurfing is not a travel agency, an insurance company
                    or the like. Goodsurfing does not act as an agent for the
                    Goodsurfer.
                    <br />
                    <br />
                    1.7. Goodsurfing may have its own projects. In this case, all
                    requirements and rules applicable to Hosts and employers
                    apply to it.
                    <br />
                    <br />
                    1.8 Goodsurfing does not control and does not guarantee the
                    quality or availability of the conditions and requirements
                    specified in the description of a project created by a Host
                    or employer other than Goodsurfing. Responsibility for
                    fulfilling the conditions of a project lies with the Host or
                    employer who posted the project on the Goodsurfing Platform.
                    <br />
                    <br />
                    1.9. Goodsurfing does not certify any specific Goodsurfer,
                    Host or employer. Users independently determine the
                    trustworthiness of a Goodsurfer, Host or employer based on
                    their own judgment. Marks and comments about Users on the
                    Goodsurfing Platform are private and subjective opinions.
                    Users independently bear responsibility for all their
                    decisions and precautionary measures.
                    <br />
                    <br />
                    1.10. In order to promote the Goodsurfing Platform and
                    increase the reach of potential participants, information
                    about a project and other User Content may be used on other
                    Goodsurfing websites and resources, including in online and
                    offline advertising.
                    <br />
                    <br />
                    1.11. To help users who speak different languages obtain
                    reliable information about projects and/or Goodsurfers,
                    information may be translated into other languages.
                    <br />
                    <br />
                    1.12. The Goodsurfing Platform may contain links to
                    third-party websites or resources. Other terms and privacy
                    policies may apply to these third-party services. Goodsurfing
                    is not responsible for the availability or accuracy of such
                    services, or for the content, products or services available
                    on these services.
                </p>
            </div>
            <div className={styles.content} id="2">
                <h2 className={styles.title}>
                    2. User Verification and Restriction of Access
                </h2>
                <p className={styles.description}>
                    2.1. At the time of registration, you must be at least 18
                    years old. By accessing and/or using the Goodsurfing
                    Platform, you confirm that you are 18 years of age and have
                    the authority to enter into the Agreement.
                    <br />
                    <br />
                    2.2. Minor participants may become participants with the
                    help of their legal representatives.
                    <br />
                    <br />
                    2.3. Goodsurfing has the right to restrict access to certain
                    resources of the Goodsurfing Platform for users who have not
                    purchased Goodsurfing membership and/or who have a low
                    rating.
                    <br />
                    <br />
                    2.4. For the purposes of transparency and fraud prevention,
                    and in accordance with applicable law, we may, but are not
                    obliged to: ask Users to provide official identification or
                    other information; carry out additional checks aimed at
                    confirming the identity and history of Users, in the event
                    that there is sufficient information about criminal
                    convictions, sexual offenses and the like.
                    <br />
                    <br />
                    2.5. Access to or use of certain areas or features of the
                    Goodsurfing Platform may be subject to different terms and
                    standards and/or may require you to accept additional terms
                    and provisions. In the event of a conflict between provisions
                    and conditions, the latest provisions and conditions shall
                    prevail with respect to access to and use of the relevant
                    area or resource, unless otherwise stated.
                    <br />
                    <br />
                    2.6. If necessary, Goodsurfing may restrict access to the
                    Goodsurfing Platform or to certain of its areas and
                    resources, in connection with bandwidth limitation, security
                    and integrity of our servers or for carrying out maintenance
                    measures. It may optimize and update the Goodsurfing
                    Platform and introduce new Goodsurfing services.
                </p>
            </div>
            <div className={styles.content} id="3">
                <h2 className={styles.title}>3. Procedure for Amending the Terms</h2>
                <p className={styles.description}>
                    3.1 Goodsurfing reserves the right to amend the Terms at any
                    time. In the event of changes to the Terms, the new Terms
                    will be published on the Goodsurfing Platform with an
                    indication of the date of the last update.
                    <br />
                    <br />
                    3.2 If you do not agree with the amended Terms, you may write
                    to support@goodsurfing.org requesting that your account be
                    deleted; otherwise, your continued access to or use of the
                    Goodsurfing Platform will mean your consent to the amended
                    Terms.
                </p>
            </div>
            <div className={styles.content} id="4">
                <h2 className={styles.title}>4. Account Registration</h2>
                <p className={styles.description}>
                    4.1. You must register an account (hereinafter - Goodsurfing
                    Account) in order to access and use the Goodsurfing Platform.
                    This is a necessary condition for posting a project,
                    applying for a project or exchanging messages.
                    <br />
                    <br />
                    4.2. You may register a Goodsurfing Account using an email
                    address or by connecting your account on third-party social
                    networks.
                    <br />
                    <br />
                    4.3. You must provide reliable, accurate and complete
                    information in your Goodsurfing Account profile, and keep it
                    up to date.
                    <br />
                    <br />
                    4.4. You may not register more than 1 (one) Goodsurfing
                    Account per 1 (one) email address or account on a third-party
                    social network. You have no right to transfer your Goodsurfing
                    Account to any third party.
                    <br />
                    <br />
                    4.5. You are responsible for maintaining the confidentiality
                    and security of your Goodsurfing Account data and have no
                    right to disclose such data to third parties. You must
                    immediately notify Goodsurfing if you become aware of the
                    theft, loss, unlawful appropriation or unauthorized use (including
                    suspected use) of your Goodsurfing Account data.
                    <br />
                    <br />
                    4.6. You are responsible for any actions carried out through
                    your Goodsurfing Account, except in cases where such actions
                    were carried out after your notice of the loss of Goodsurfing
                    Account data.
                </p>
            </div>
            <div className={styles.content} id="5">
                <h2 className={styles.title}>
                    5. Content and Rules for Its Use
                </h2>
                <p className={styles.description}>
                    5.1 Goodsurfing may, at its own discretion, allow Users to:
                    <ul>
                        <li>
                            create, upload, publish, send, receive and store
                            content (text, photographs, audio, video or other
                            materials and information) on or through the
                            Goodsurfing Platform (hereinafter - User Content);
                        </li>
                        <li>
                            access and view User Content and any other content
                            provided on the Goodsurfing Platform, including
                            content belonging to Goodsurfing, and any content
                            licensed or permitted for use by Goodsurfing by a
                            third party (hereinafter - &quot;Collective
                            Content&quot;).
                        </li>
                    </ul>
                    5.2. The Goodsurfing Platform, Goodsurfing Content and User
                    Content may be fully or partially protected by copyright. You
                    acknowledge and agree that the Goodsurfing Platform and
                    Goodsurfing Content, including all related intellectual
                    property rights, are the exclusive property of Goodsurfing.
                    You must not remove, alter or conceal any copyright notices,
                    service marks or other proprietary rights included in or
                    accompanying the Goodsurfing Platform, Goodsurfing Content or
                    User Content.
                    <br />
                    <br />
                    5.3. Service marks, logos and any other designations belonging
                    to third parties and used by the Goodsurfing Platform,
                    Goodsurfing Content and/or Collective Content are used solely
                    for identification purposes and may be the property of their
                    respective owners.
                    <br />
                    <br />
                    5.4. You bear sole responsibility for all Content you provide
                    on or through the Goodsurfing Platform. Accordingly, you
                    represent and warrant that you are the sole and exclusive
                    owner of all User Content that you provide on or through the
                    Goodsurfing Platform, or that you have all rights, licenses,
                    consents and permissions necessary to grant Goodsurfing rights
                    to such User Content.
                    <br />
                    <br />
                    5.5. You warrant that the User Content you post, as well as
                    the project materials, is not:
                    <ul>
                        <li>
                            fraudulent, false, misleading (directly or by
                            artifice) or disparaging;
                        </li>
                        <li>
                            discrediting, defamatory, obscene, pornographic,
                            vulgar or offensive;
                        </li>
                        <li>
                            encouraging discrimination, intolerance, racism,
                            hatred, persecution or causing harm to any person or
                            group of persons;
                        </li>
                        <li>
                            violent or threatening, encouraging violence or
                            actions that threaten any person or animal;
                        </li>
                        <li>
                            promoting harmful or illegal substances or actions;
                        </li>
                        <li>violating the Goodsurfing Terms.</li>
                    </ul>
                    Goodsurfing may, without any prior warning, remove or disable
                    access to any User Content that Goodsurfing considers to be in
                    violation of the Terms or that may cause potential harm to
                    Goodsurfing, its Users, third parties or their property.
                    <br />
                    <br />
                    5.6. Goodsurfing respects copyright law and expects its Users
                    to do the same. If you believe that any content on the
                    Goodsurfing Platform infringes copyright in your property,
                    please notify us: support@goodsurfing.org.
                </p>
            </div>
            <div className={styles.content} id="6">
                <h2 className={styles.title}>
                    6. Goodsurfer. Goodsurfing Membership. Special Terms
                </h2>
                <p className={styles.description}>
                    6.1 After completing the registration procedure as a
                    Goodsurfer, you become a participant of the Goodsurfing
                    Platform. 6.2. After completing registration, you gain access
                    to:
                    <ul>
                        <li> personal account;</li>
                        <li>
                            the ability to apply to participate in projects;
                        </li>
                        <li>
                            access to the exact address and location of the
                            project;
                        </li>
                        <li>leave Reviews and assign a Rating;</li>
                        <li>
                            correspond with the Host, the employer or another
                            Goodsurfer.
                        </li>
                    </ul>
                    6.3. By purchasing Goodsurfing membership, you gain access to
                    closed features, sections and resources of the Goodsurfing
                    Platform, and contribute to the development of the project.
                    The list of features, sections and resources will be
                    expanded. 6.4. Participants who have purchased Goodsurfing
                    membership receive:
                    <ul>
                        <li>
                            the ability to submit an unlimited number of
                            applications for projects in all areas;
                        </li>
                        <li>personal technical support;</li>
                        <li>access to Goodsurfing educational materials;</li>
                        <li>
                            discounts and promo codes for goods and services for
                            travelers;
                        </li>
                        <li>access to special and rated projects;</li>
                        <li>
                            the ability to leave and receive Reviews and Ratings
                            without restrictions.
                        </li>
                    </ul>
                    6.5. Goodsurfing reserves the right to change the amount of
                    the cost of Goodsurfing membership at any time; we will notify
                    Users in advance of any changes before they take effect.
                    <br />
                    <br />
                    6.6. After submitting an application for a project and
                    receiving confirmation of the application from the Host or
                    employer, you must contact the Host or employer (unless the
                    Host or employer has contacted you first) to clarify
                    additional conditions and conclude an agreement on your
                    acceptance to the project, which will specify all necessary
                    conditions regarding meals, accommodation, cancellation of
                    participation, etc. A template agreement with the Goodsurfer
                    can be found in the profile of the Goodsurfing Account, in the
                    “Templates” section.
                    <br />
                    <br />
                    6.7. You agree to leave the project no later than the date and
                    time specified by the Host or employer in the project
                    description or in the agreement (if any). If you remain after
                    the agreed departure date without the consent of the Host or
                    employer, the Host or employer has the right to demand your
                    departure in accordance with applicable law.
                </p>
            </div>
            <div className={styles.content} id="7">
                <h2 className={styles.title}>
                    7. Host and Employer. Special Terms
                </h2>
                <p className={styles.description}>
                    7.1. After completing the registration procedure as an
                    organizer, you become a participant of the Goodsurfing
                    Platform — a Host or an employer, depending on the nature of
                    your project. If you offer a paid vacancy and are looking for
                    an employee for your project, you become an employer and your
                    project is placed in the corresponding category.
                    <br />
                    <br />
                    7.2. When creating and publishing a project through the
                    Goodsurfing Platform, you must:
                    <ul>
                        <li>specify the exact address of the project;</li>
                        <li>
                            specify the dates of the project. If it is periodic,
                            you may add a period or specify several dates. You
                            also indicate the minimum and maximum period of
                            volunteer participation and the application deadline;
                        </li>
                        <li>
                            specify basic requirements and restrictions — gender,
                            age and language skills;
                        </li>
                        <li>
                            select the skills that the volunteer must possess. Also
                            describe in detail the specifics of work on your
                            project;
                        </li>
                        <li>
                            specify the list of benefits, services and privileges
                            that you can provide to the Goodsurfer;
                        </li>
                        <li>provide a full and short description of the project;</li>
                        <li>
                            provide any other relevant information requested by
                            Goodsurfing. You are responsible for continuously
                            updating the information about your postings
                            (including calendar availability).
                        </li>
                    </ul>
                    7.3. When creating and publishing a project through the
                    Goodsurfing Platform, it is prohibited to: specify personal
                    contacts or organizational contacts (mobile phone number,
                    email address, etc.). The first contact with a Goodsurfer must
                    take place on the Goodsurfing Platform. This allows your
                    project to build up its rating and become more popular, and
                    allows us to make the Goodsurfing Platform better. After a
                    Goodsurfer&apos;s application has been confirmed on the Goodsurfing
                    Platform, you may send your contacts in private messages to
                    the Goodsurfer in order to discuss further terms; post content
                    specified in clause 5.5.
                    <br />
                    <br />
                    7.4. You bear sole responsibility for establishing the terms of
                    your project. As soon as a Goodsurfer applies to participate in
                    the project and you accept the application, you must contact
                    the Goodsurfer and discuss all terms, details and organizational
                    matters, and conclude an agreement with the Goodsurfer (if
                    necessary). A template agreement with the Goodsurfer can be
                    found in the profile of the Goodsurfing Account, in the
                    “Templates” section.
                    <br />
                    <br />
                    7.5. Any terms and provisions specified in the description of
                    your project and in the agreement with the Goodsurfer must not
                    contradict these Terms.
                    <br />
                    <br />
                    7.6. The popularity of projects on the Goodsurfing Platform may
                    change depending on many factors, such as: Goodsurfer
                    preferences, search parameters, requirements for conditions,
                    calendar availability, project description, the number and
                    quality of images, ratings, reviews, etc.
                </p>
            </div>
            <div className={styles.content} id="8">
                <h2 className={styles.title}>8. Rating and Reviews</h2>
                <p className={styles.description}>
                    8.1 After a project has been completed, the Goodsurfer, the
                    Host and the employer may leave a public review on the
                    Goodsurfing Platform (hereinafter - Review) and assign a star
                    rating (hereinafter - Rating) to each other. Ratings and
                    Reviews reflect the subjective opinions of individual Users and
                    do not reflect the opinion of Goodsurfing.
                    <br />
                    <br />
                    8.2. Ratings and Reviews made by Users must be truthful,
                    clear, substantiated, and must not contain defamatory or
                    offensive statements.
                    <br />
                    <br />
                    8.3. Users are prohibited from manipulating the Rating and
                    Review system in any way, for example, by instructing a third
                    party to write a positive or negative Review about another
                    User.
                    <br />
                    <br />
                    8.4. Ratings and Reviews are part of a User&apos;s public profile
                    and may also be displayed in other places on the Goodsurfing
                    Platform (for example, on a project page) together with the
                    relevant information.
                    <br />
                    <br />
                    8.5. Once a Review has been created and a Rating assigned,
                    they cannot be changed or edited.
                    <br />
                    <br />
                    8.6. Reviews that violate clause 5.5 will be removed without
                    further notice.
                </p>
            </div>
            <div className={styles.content} id="9">
                <h2 className={styles.title}>
                    9. Damage Caused in the Course of a Project
                </h2>
                <p className={styles.description}>
                    9.1. Goodsurfing is not responsible for damage, or for acts or
                    omissions of Users, arising as a result of interaction between
                    Users. Goodsurfing only connects Goodsurfers with Hosts and
                    employers.
                    <br />
                    <br />
                    9.2. The Goodsurfer is responsible for leaving the place of
                    accommodation at the project (including any personal property
                    or other property located at the accommodation facility) in the
                    condition in which it was at the time of arrival.
                </p>
            </div>
            <div className={styles.content} id="10">
                <h2 className={styles.title}>10. Termination of the Agreement</h2>
                <p className={styles.description}>
                    10.1. Goodsurfing may terminate the Agreement with a User
                    without prior notice and/or restrict or prohibit access to the
                    Goodsurfing Platform if:
                    <ul>
                        <li>
                            you have materially breached your obligations under
                            these or any of our other Terms;
                        </li>
                        <li>
                            you have violated laws, regulations or the rights of
                            third parties;
                        </li>
                        <li>
                            you have provided incomplete, outdated, inaccurate or
                            fraudulent information at the stage of registering a
                            Goodsurfing Account, or during registration and
                            publication of a project;
                        </li>
                        <li>
                            you have violated applicable law, decisions or
                            requirements of a court, or of another governmental or
                            administrative authority;
                        </li>
                        <li>
                            Goodsurfing believes that such actions are necessary to
                            protect the personal safety or property of Goodsurfing,
                            its Users or third parties (for example, in the case of
                            fraudulent behavior by a User).
                        </li>
                    </ul>
                    10.2. In the case of minor violations, you will be notified (if
                    necessary) and given the opportunity to resolve the problem, or
                    Goodsurfing will make corrections on its own.
                    <br />
                    <br />
                    10.3. In the event of termination of the Agreement, you have no
                    right to restore your Goodsurfing Account or to access its
                    materials.
                    <br />
                    <br />
                    10.4. If your access to the Goodsurfing Platform is restricted,
                    your Goodsurfing Account is suspended or this Agreement is
                    terminated by us, you will not be able to register a new
                    account on the Goodsurfing Platform.
                </p>
            </div>
            <div className={styles.content} id="11">
                <h2 className={styles.title}>11. Special Provisions</h2>
                <p className={styles.description}>
                    11.1. When using the Goodsurfing Platform or Collective Content,
                    you do so voluntarily and at your own risk. The Goodsurfing
                    Platform and Collective Content are provided &quot;as is&quot;
                    without any warranties, express or implied.
                    <br />
                    <br />
                    11.2. You confirm that you have studied the Goodsurfing Terms,
                    applicable law, rules and/or regulations that may apply to your
                    projects and your activities on the Goodsurfing Platform.
                    <br />
                    <br />
                    11.3. You confirm that you understand and voluntarily accept
                    all the related possible risks associated with the conditions
                    specified in the descriptions of projects on the Goodsurfing
                    Platform. You assume full responsibility for your choices
                    before, during and after participation in all activities of
                    Hosts&apos; projects.
                </p>
            </div>
            <div className={styles.content} id="12">
                <h2 className={styles.title}>12. Liability</h2>
                <p className={styles.description}>
                    12.1. Users of the Goodsurfing Platform are not representatives
                    of Goodsurfing, therefore any information they provide does not
                    constitute an official position of Goodsurfing.
                    <br />
                    <br />
                    12.2. Goodsurfing is a platform for connecting Goodsurfers,
                    Hosts and employers, therefore Goodsurfing is not responsible
                    for any agreements reached between the parties after the first
                    contact through the platform.
                    <br />
                    <br />
                    12.3. Any arrangement between Users concluded outside the
                    platform (for example, financial assistance, services or
                    overtime work) depends solely on the mutual consent of the
                    parties.
                    <br />
                    <br />
                    12.4. Goodsurfing is not responsible for theft or damage caused
                    by Users during the course of a project, and emphasizes the
                    importance of contacting local authorities to resolve disputed
                    situations, as well as informing the Goodsurfing team of any
                    incident in order to further minimize them.
                    <br />
                    <br />
                    12.5. Goodsurfing is not responsible for the Goodsurfer&apos;s,
                    Host&apos;s or employer&apos;s own documentation, travel or medical
                    insurance, visas, or Users&apos; compliance with local legislation.
                    Responsibility for preparing one&apos;s own documentation lies with
                    the User.
                    <br />
                    <br />
                    12.6. The content of Ratings, Reviews, comments, articles,
                    videos, podcasts or other materials available on the Goodsurfing
                    Platform is created by community Users and may not reflect the
                    views of Goodsurfing.
                </p>
            </div>
            <div className={styles.content} id="13">
                <h2 className={styles.title}>
                    13. Feedback and Organization Details
                </h2>
                <p className={styles.description}>
                    13.1. We value and encourage feedback, comments and suggestions
                    for improving the Goodsurfing Platform. You may send us
                    feedback by email at support@goodsurfing.org, contact us
                    through our official social media accounts or by any other
                    convenient means.
                    <br />
                    <br />
                    13.2. Any feedback you send us will be considered
                    non-confidential and will not be treated as your property. By
                    submitting feedback, you grant us a worldwide, non-exclusive,
                    royalty-free, irrevocable, sublicensable and perpetual license
                    to use and publish these ideas and materials free of charge for
                    any purpose.
                    <br />
                    <br />
                    13.3. Organization details:
                    <ul>
                        <li>
                            Name of the organization: Autonomous Non-Profit
                            Organization “Information Center for the Development of
                            Volunteering “Goodsurfing – Good Journeys”.
                        </li>
                        <li>Date of registration: July 20, 2018.</li>
                        <li>
                            Registrar: Inter-District Inspectorate No. 18 of the
                            Federal Tax Service for the Republic of Tatarstan.
                        </li>
                        <li>
                            Head of the organization: Director Popov Ilya
                            Alexandrovich.
                        </li>
                        <li>
                            Legal address of ANO “Goodsurfing”: – 420043, Republic
                            of Tatarstan, city of Kazan, Boyninichnaya Street,
                            building 5, premises 25.
                        </li>
                        <li>
                            The main type of activity is: “Provision of consulting
                            and information services”; 5 additional types of
                            activity are registered.
                        </li>
                        <li>TIN 1655405070.</li>
                        <li>OGRN 1181690059682.</li>
                        <li>OKPO 31801426.</li>
                        <li>
                            Current account 40703810207500000136Recipient bank: TOCHKA
                            PJSC BANK &quot;FK OTKRITIE&quot;, City of MoscowBIC
                            044525999Correspondent account 30101810845250000999
                        </li>
                    </ul>
                </p>
            </div>
        </section>
    );
};
