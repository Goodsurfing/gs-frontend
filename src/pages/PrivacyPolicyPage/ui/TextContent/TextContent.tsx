import cn from "classnames";
import React, { FC } from "react";

import styles from "./TextContent.module.scss";

interface TextContentProps {
    className?: string;
}

export const TextContent: FC<TextContentProps> = (props: TextContentProps) => {
    const { className } = props;
    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.content} id="1">
                <h2 className={styles.title}>1. Общие положения</h2>
                <p className={styles.description}>
                    Политика разработана в соответствии с п. 2 ст. 18.1
                    Федерального закона «О персональных данных» №152-ФЗ от 27
                    июля 2006 года и с учетом требований Конституции Российской
                    Федерации, законодательных и иных нормативных правовых актов
                    Российской Федерации в области персональных данных,
                    определяет порядок деятельности автономной некоммерческой
                    организации «Гудсёрфинг - добрые путешествия» (далее –
                    Организация) в отношении обработки персональных данных.
                    Определения и сокращения, используемые в Политике обработки
                    персональных данных в автономной некоммерческой организации
                    «Гудсёрфинг - добрые путешествия» (далее – Политика).
                    <h3>Персональные данные</h3>
                    Любая информация, относящаяся к прямо или косвенно
                    определенному, или определяемому физическому лицу (субъекту
                    персональных данных).
                    <h3>Оператор</h3>
                    Государственный орган, муниципальный орган, юридическое или
                    физическое лицо, самостоятельно или совместно с другими
                    лицами организующие и (или) осуществляющие обработку
                    персональных данных, а также определяющие цели обработки
                    персональных данных, состав персональных данных, подлежащих
                    обработке, действия (операции), совершаемые с персональными
                    данными.
                    <h3>Обработка персональных данных</h3>
                    Любое действие (операция) или совокупность действий
                    (операций), совершаемые с использованием средств
                    автоматизации или без использования таких средств с
                    персональными данными, включая сбор, запись, систематизацию,
                    накопление, хранение, уточнение (обновление, изменение),
                    извлечение, использование, передачу (распространение,
                    предоставление, доступ), обезличивание, блокирование,
                    удаление, уничтожение персональных данных.
                    <h3>Автоматизированная обработка персональных данных</h3>
                    Обработка персональных данных с помощью средств
                    вычислительной техники.
                    <h3>Предоставление персональных данных</h3>
                    Действия, направленные на раскрытие персональных данных
                    определенному лицу или определенному кругу лиц.
                    <h3>Распространение персональных данных</h3>
                    Действия, направленные на раскрытие персональных данных
                    неопределенному кругу лиц.
                    <h3>Трансграничная передача персональных данных</h3>
                    Передача персональных данных на территорию иностранного
                    государства органу власти иностранного государства,
                    иностранному физическому лицу или иностранному юридическому
                    лицу.
                    <h3>Блокирование персональных данных</h3>
                    Временное прекращение обработки персональных данных (за
                    исключением случаев, когда обработка необходима для
                    уточнения персональных данных).
                    <h3>Уничтожение персональных данных</h3>
                    Действия, в результате которых становится невозможным
                    восстановить содержание персональных данных в информационной
                    системе персональных данных и (или) в результате которых
                    уничтожаются материальные носители персональных данных.
                    <h3>Обезличивание персональных данных</h3>
                    Действия, в результате которых становится невозможным без
                    использования дополнительной информации определить
                    принадлежность персональных данных конкретному субъекту
                    персональных данных.
                    <h3>Информационная система персональных данных</h3>
                    Совокупность содержащихся в базах данных персональных данных
                    и обеспечивающих их обработку информационных технологий и
                    технических средств.
                    <h3>Субъект персональных данных</h3>
                    Физическое лицо, которое прямо или косвенно определено или
                    определяемо с помощью персональных данных.
                    <h3>Конфиденциальность ПДн</h3>
                    Обязательное для соблюдения оператором или иным получившим
                    доступ к ПДн лицом требование не допускать их
                    распространения без согласия субъекта ПДн или иного
                    законного основания.
                </p>
            </div>
            <div className={styles.content} id="2">
                <h2 className={styles.title}>
                    2. Принципы и цели обработки персональных данных
                </h2>
                <p className={styles.description}>
                    Организация, являясь оператором персональных данных,
                    осуществляет обработку персональных данных работников
                    Организации и субъектов персональных данных, не состоящих с
                    Организацией в трудовых отношениях.
                    <br />
                    <br />
                    Обработка персональных данных в Организации осуществляется с
                    учетом необходимости обеспечения защиты прав и свобод
                    работников Организации и других субъектов персональных
                    данных, в том числе защиты права на неприкосновенность
                    частной жизни, личную и семейную тайну, на основе следующих
                    принципов:
                    <ul>
                        <li>
                            обработка персональных данных осуществляется в
                            Организация на законной и справедливой основе;
                        </li>
                        <li>
                            обработка персональных данных ограничивается
                            достижением конкретных, заранее определенных и
                            законных целей. Не допускается обработка
                            персональных данных, несовместимая с целями сбора
                            персональных данных;
                        </li>
                        <li>
                            не допускается объединение баз данных, содержащих
                            персональные данные, обработка которых
                            осуществляется в целях, несовместимых между собой;
                        </li>
                        <li>
                            обработке подлежат только персональные данные,
                            которые отвечают целям их обработки;
                        </li>
                        <li>
                            содержание и объем обрабатываемых персональных
                            данных соответствует заявленным целям обработки. Не
                            допускается избыточность обрабатываемых персональных
                            данных по отношению к заявленным целям их обработки;
                        </li>
                        <li>
                            при обработке персональных данных обеспечиваются
                            точность персональных данных, их достаточность, а в
                            необходимых случаях и актуальность по отношению к
                            целям обработки персональных данных. Организацией
                            принимаются необходимые меры либо обеспечивается их
                            принятие по удалению или уточнению неполных или
                            неточных персональных данных;
                        </li>
                        <li>
                            хранение персональных данных осуществляется в форме,
                            позволяющей определить субъекта персональных данных,
                            не дольше, чем того требуют цели обработки
                            персональных данных, если срок хранения персональных
                            данных не установлен федеральным законом, договором,
                            стороной которого, выгодоприобретателем или
                            поручителем по которому является субъект
                            персональных данных;
                        </li>
                        <li>
                            обрабатываемые персональные данные уничтожаются либо
                            обезличиваются по достижении целей обработки или в
                            случае утраты необходимости в достижении этих целей,
                            если иное не предусмотрено федеральным законом.
                        </li>
                    </ul>
                    Персональные данные обрабатываются в Организации в целях:
                    <ul>
                        <li>
                            обеспечения соблюдения Конституции Российской
                            Федерации, законодательных и иных нормативных
                            правовых актов Российской Федерации, локальных
                            нормативных актов Организации;
                        </li>
                        <li>
                            осуществления функций, полномочий и обязанностей,
                            возложенных законодательством Российской Федерации
                            на Организацию, в том числе по предоставлению
                            персональных данных в органы государственной власти,
                            в Пенсионный фонд Российской Федерации, в Фонд
                            социального страхования Российской Федерации, в
                            Федеральный фонд обязательного медицинского
                            страхования, а также в иные государственные органы;
                        </li>
                        <li>
                            регулирования трудовых отношений с работниками
                            Организации (содействие в трудоустройстве, обучение
                            и продвижение по службе, обеспечение личной
                            безопасности, контроль количества и качества
                            выполняемой работы, обеспечение сохранности
                            имущества);
                        </li>
                        <li>
                            предоставления работникам Организация и членам их
                            семей дополнительных гарантий и компенсаций, в том
                            числе негосударственного пенсионного обеспечения,
                            добровольного медицинского страхования, медицинского
                            обслуживания и других видов социального обеспечения
                        </li>
                        <li>
                            защиты жизни, здоровья или иных жизненно важных
                            интересов субъектов персональных данных;
                        </li>
                        <li>
                            подготовки, заключения, исполнения и прекращения
                            договоров с контрагентами;
                        </li>
                        <li>
                            формирования справочных материалов для внутреннего
                            информационного обеспечения деятельности
                            Организации, ее филиалов и представительств, а также
                            дочерних обществ Организации;
                        </li>
                        <li>
                            исполнения судебных актов, актов других органов или
                            должностных лиц, подлежащих исполнению в
                            соответствии с законодательством Российской
                            Федерации об исполнительном производстве;
                        </li>
                        <li>
                            осуществления прав и законных интересов Организации
                            в рамках осуществления видов деятельности,
                            предусмотренных Уставом и иными локальными
                            нормативными актами Организации, в том числе, но не
                            ограничиваясь регистрацией для предоставления
                            субъектам персональных данных доступа к функционалу
                            Организации, реализуемому в том числе посредством
                            электронных ресурсов, или третьих лиц либо
                            достижения общественно значимых целей;
                        </li>
                        <li>
                            предоставления субъектам персональных данных
                            возможности доступа к функционалу, реализуемому
                            Организацией, в том числе посредством электронных
                            ресурсов Организации с целью предоставления
                            возможности участия в мероприятиях в том числе
                            получения приглашений на мероприятия, участия в
                            конкурсах, получения информации о стажировках,
                            проектах и т.д.;
                        </li>
                        <li>
                            ведения истории социальной активности субъектов
                            персональных данных;
                        </li>
                        <li>в иных законных целях.</li>
                    </ul>
                </p>
            </div>
            <div className={styles.content} id="3">
                <h2 className={styles.title}>
                    3. Правовые основания обработки персональных данных в
                    Организации
                </h2>
                <p className={styles.description}>
                    Правовым основанием обработки персональных данных является
                    совокупность федеральных законов и принятых на их основе
                    нормативных правовых актов, регулирующих отношения,
                    связанные с деятельностью Организации; уставные документы
                    Организации; договоры, заключаемые между Организацией и
                    субъектом персональных данных; согласие на обработку
                    персональных данных (в случаях, прямо не предусмотренных
                    законодательством Российской Федерации, но соответствующих
                    полномочиям Организации) во исполнение которых и в
                    соответствии с которыми Организация осуществляет обработку
                    персональных данных, в том числе, но не ограничиваясь:
                    <ul>
                        <li>Конституцией Российской Федерации;</li>
                        <li>Трудовым кодексом Российской Федерации;</li>
                        <li>Гражданским кодексом Российской Федерации</li>
                        <li>Налоговым кодексом Российской Федерации;</li>
                        <li>
                            Законом Российской Федерации от 29.12.2012 №273-ФЗ
                            «Об образовании в Российской Федерации»;
                        </li>
                        <li>
                            иными нормативными правовыми актами Российской
                            Федерации и нормативными документами уполномоченных
                            органов государственной власти;
                        </li>
                        <li>Уставом Организации;</li>
                        <li>
                            Договорами, контрактами, соглашениями одной из
                            сторон по которым выступает Организация
                        </li>
                        <li>
                            Согласием субъекта персональных данных на обработку
                            его персональных данных;
                        </li>
                        <li>Иными документами.</li>
                    </ul>
                </p>
            </div>
            <div className={styles.content} id="4">
                <h2 className={styles.title}>
                    4. Объем и категории обрабатываемых персональных данных,
                    категории субъектов персональных данных
                </h2>
                <p className={styles.description}>
                    Перечень персональных данных, обрабатываемых в Организации,
                    определяется в соответствии с законодательством Российской
                    Федерации и локальными нормативными актами Организации с
                    учетом целей обработки персональных данных, указанных в
                    разделе 2 Политики.
                    <br />
                    <br />
                    Обработка специальных категорий персональных данных,
                    касающихся расовой принадлежности, религиозных убеждений,
                    интимной жизни, Организацией не осуществляется.
                    <br />
                    <br />
                    Обработка специальных категорий персональных данных,
                    касающихся политических взглядов, философских убеждений,
                    состояния здоровья производится в строгом соответствии и в
                    порядке, установленном законодательством Российской
                    Федерации.
                    <br />
                    <br />
                    В Организации обрабатываются персональные данные
                    следующих категорий субъектов:
                    <ul>
                        <li>
                            работники Организации, бывшие работники, кандидаты
                            на замещение вакантных должностей, а также
                            родственники работников;
                        </li>
                        <li>
                            клиенты и контрагенты Организации (физические лица);
                        </li>
                        <li>
                            представители/работники клиентов и контрагентов
                            Организации (юридических лиц);
                        </li>
                    </ul>
                    Состав обрабатываемых Организацией персональных данных в
                    рамках мероприятий, проводимых Организаций для физических
                    лиц, определяется конкретными целями обработки и указывается
                    в согласиях на обработку персональных данных субъектов.
                </p>
            </div>
            <div className={styles.content} id="5">
                <h2 className={styles.title}>
                    5. Порядок и условия обработки персональных данных
                </h2>
                <p className={styles.description}>
                    Организация при осуществлении обработки персональных данных:
                    <ul>
                        <li>
                            принимает меры, необходимые и достаточные для
                            обеспечения выполнения требований законодательства
                            Российской Федерации и локальных нормативных актов
                            Организации в области персональных данных;
                        </li>
                        <li>
                            принимает правовые, организационные и технические
                            меры для защиты персональных данных от
                            неправомерного или случайного доступа к ним,
                            уничтожения, изменения, блокирования, копирования,
                            предоставления, распространения персональных данных,
                            а также от иных неправомерных действий в отношении
                            персональных данных;
                        </li>
                        <li>
                            назначает лицо, ответственное за организацию
                            обработки персональных данных в Организации;
                        </li>
                        <li>
                            издает локальные нормативные акты, определяющие
                            политику и вопросы обработки и защиты персональных
                            данных в Организации;
                        </li>
                        <li>
                            осуществляет ознакомление работников Организации,
                            его филиалов и представительств, непосредственно
                            осуществляющих обработку персональных данных, с
                            положениями законодательства Российской Федерации и
                            локальных нормативных актов Организации в области
                            персональных данных, в том числе требованиями к
                            защите персональных данных, и обучение указанных
                            работников;
                        </li>
                        <li>
                            публикует или иным образом обеспечивает
                            неограниченный доступ к настоящей Политике;
                        </li>
                        <li>
                            сообщает в установленном порядке субъектам
                            персональных данных или их представителям информацию
                            о наличии персональных данных, относящихся к
                            соответствующим субъектам, предоставляет возможность
                            ознакомления с этими персональными данными при
                            обращении и (или) поступлении запросов указанных
                            субъектов персональных данных или их представителей,
                            если иное не установлено законодательством
                            Российской Федерации;
                        </li>
                        <li>
                            прекращает обработку и уничтожает персональные
                            данные в случаях, предусмотренных законодательством
                            Российской Федерации в области персональных данных;
                        </li>
                        <li>
                            совершает иные действия, предусмотренные
                            законодательством Российской Федерации в области
                            персональных данных.
                        </li>
                    </ul>
                    Условия обработки персональных данных в Организации.
                    <br />
                    <br />
                    Обработка персональных данных в Организации осуществляется с
                    согласия субъекта персональных данных на обработку его
                    персональных данных, если иное не предусмотрено
                    законодательством Российской Федерации в области
                    персональных данных.
                    <br />
                    <br />
                    Организация без согласия субъекта персональных данных не
                    раскрывает третьим лицам и не распространяет персональные
                    данные, если иное не предусмотрено федеральным законом.
                    <br />
                    <br />
                    Организация вправе поручить обработку персональных данных
                    другому лицу с согласия субъекта персональных данных на
                    основании заключаемого с этим лицом договора. Договор должен
                    содержать перечень действий (операций) с персональными
                    данными, которые будут совершаться лицом, осуществляющим
                    обработку персональных данных, цели обработки, обязанность
                    такого лица соблюдать конфиденциальность персональных данных
                    и обеспечивать безопасность персональных данных при их
                    обработке, а также требования к защите обрабатываемых
                    персональных данных в соответствии со статьей 19
                    Федерального закона «О персональных данных».
                    <br />
                    <br />
                    В целях внутреннего информационного обеспечения Организация
                    может создавать внутренние справочные материалы, в которые с
                    письменного согласия субъекта персональных данных, если иное
                    не предусмотрено законодательством Российской Федерации,
                    могут включаться его фамилия, имя, отчество, место работы,
                    должность, год и место рождения, адрес, абонентский номер,
                    адрес электронной почты, иные персональные данные,
                    сообщаемые субъектом персональных данных.
                    <br />
                    <br />
                    Доступ к обрабатываемым в Организация персональным данным
                    разрешается только работникам Организация, занимающим
                    должности, включенные в перечень должностей структурных
                    подразделений Организация, филиалов и представительств,
                    замещение которых предполагает обработку персональных
                    данных.
                    <br />
                    <br />
                    Организация прекращает обработку персональных данных при
                    достижении целей обработки персональных данных, истечении
                    срока действия согласия, отзыве согласия субъекта
                    персональных данных на обработку его персональных данных, а
                    также при выявлении неправомерной обработки персональных
                    данных. Конкретные сроки обработки Организацией персональных
                    данных в рамках мероприятий, проводимых Организаций для
                    физических лиц указываются в согласиях на обработку
                    персональных данных субъекта.
                </p>
            </div>
            <div className={styles.content} id="6">
                <h2 className={styles.title}>
                    6. Перечень действий с персональными данными и способы их
                    обработки
                </h2>
                <p className={styles.description}>
                    Организация осуществляет сбор, запись, систематизацию,
                    накопление, хранение, уточнение (обновление, изменение),
                    извлечение, использование, передачу (распространение,
                    предоставление, доступ), обезличивание, блокирование,
                    удаление и уничтожение персональных данных.
                    <br />
                    <br />
                    Обработка персональных данных в Организация осуществляется
                    следующими способами:
                    <ul>
                        <li>
                            неавтоматизированная обработка персональных данных;
                        </li>
                        <li>
                            автоматизированная обработка персональных данных с
                            передачей полученной информации по
                            информационно-телекоммуникационным сетям или без
                            таковой;
                        </li>
                        <li>смешанная обработка персональных данных.</li>
                    </ul>
                </p>
            </div>
            <div className={styles.content} id="7">
                <h2 className={styles.title}>
                    7. Права субъектов персональных данных
                </h2>
                <p className={styles.description}>
                    Субъекты персональных данных имеют право на:
                    <ul>
                        <li>
                            полную информацию об их персональных данных,
                            обрабатываемых в Организация;
                        </li>
                        <li>
                            доступ к своим персональным данным, включая право на
                            получение копии любой записи, содержащей их
                            персональные данные, за исключением случаев,
                            предусмотренных федеральным законом, а также на
                            доступ к относящимся к ним медицинским данным с
                            помощью медицинского специалиста по их выбору;
                        </li>
                        <li>
                            уточнение своих персональных данных, их блокирование
                            или уничтожение в случае, если персональные данные
                            являются неполными, устаревшими, неточными,
                            незаконно полученными или не являются необходимыми
                            для заявленной цели обработки;
                        </li>
                        <li>
                            отзыв согласия на обработку персональных данных;
                        </li>
                        <li>
                            принятие предусмотренных законом мер по защите своих
                            прав;
                        </li>
                        <li>
                            обжалование действия или бездействия Организация,
                            осуществляемого с нарушением требований
                            законодательства Российской Федерации в области
                            персональных данных, в уполномоченный орган по
                            защите прав субъектов персональных данных или в суд
                        </li>
                        <li>
                            осуществление иных прав, предусмотренных
                            законодательством Российской Федерации.
                        </li>
                    </ul>
                </p>
            </div>
            <div className={styles.content} id="8">
                <h2 className={styles.title}>
                    8. Меры, принимаемые Организация для обеспечения выполнения
                    обязанностей оператора при обработке персональных данных
                </h2>
                <p className={styles.description}>
                    Меры, необходимые и достаточные для обеспечения выполнения
                    Организация обязанностей оператора, предусмотренных
                    законодательством Российской Федерации в области
                    персональных данных, включают:
                    <ul>
                        <li>
                            назначение лиц, ответственных за организацию
                            обработки персональных данных в Организации;
                        </li>
                        <li>
                            принятие локальных нормативных актов и иных
                            документов в области обработки и защиты персональных
                            данных;
                        </li>
                        <li>
                            организацию обучения и проведение методической
                            работы с работниками структурных подразделений
                            Организации, филиалов и представительств,
                            занимающими должности, предполагающими осуществление
                            обработки персональных данных;
                        </li>
                        <li>
                            получение согласий субъектов персональных данных на
                            обработку их персональных данных, за исключением
                            случаев, предусмотренных законодательством
                            Российской Федерации;
                        </li>
                        <li>
                            обособление персональных данных, обрабатываемых без
                            использования средств автоматизации, от иной
                            информации, в частности путем их фиксации на
                            отдельных материальных носителях персональных
                            данных, в специальных разделах;
                        </li>
                        <li>
                            обеспечение раздельного хранения персональных данных
                            и их материальных носителей, обработка которых
                            осуществляется в разных целях и которые содержат
                            разные категории персональных данных;
                        </li>
                        <li>
                            установление запрета на передачу персональных данных
                            по открытым каналам связи, вычислительным сетям вне
                            пределов контролируемой зоны, ЕВСПД Организации и
                            сетям Интернет без применения установленных в
                            Организация мер по обеспечению безопасности
                            персональных данных (за исключением общедоступных и
                            (или) обезличенных персональных данных);
                        </li>
                        <li>
                            хранение материальных носителей персональных данных
                            с соблюдением условий, обеспечивающих сохранность
                            персональных данных и исключающих
                            несанкционированный доступ к ним;
                        </li>
                        <li>
                            осуществление внутреннего контроля соответствия
                            обработки персональных данных Федеральному закону «О
                            персональных данных» от 27 июля 2006 года №152-ФЗ и
                            принятым в соответствии с ним нормативным правовым
                            актам, требованиям к защите персональных данных,
                            настоящей Политике, локальным нормативным актам
                            Организация;
                        </li>
                        <li>
                            иные меры, предусмотренные законодательством
                            Российской Федерации в области персональных данных.
                        </li>
                    </ul>
                    Меры по обеспечению безопасности персональных данных при их
                    обработке в информационных системах персональных данных
                    устанавливаются в соответствии с локальными нормативными
                    актами Организация, регламентирующими вопросы обеспечения
                    безопасности персональных данных при их обработке в
                    информационных системах персональных данных Организация
                </p>
            </div>
            <div className={styles.content} id="9">
                <h2 className={styles.title}>
                    9. Ответственность за организацию обработки персональных
                    данных
                </h2>
                <p className={styles.description}>
                    Организация, назначает лиц, ответственных за организацию
                    обработки персональных данных.
                    <br />
                    <br />
                    Лицо, ответственное за организацию обработки персональных
                    данных, получает указания непосредственно от исполнительного
                    органа Организации и подотчетно ему.
                    <br />
                    <br />
                    Лицо, ответственное за организацию обработки персональных
                    данных, в частности, обязано:
                    <ol type="1">
                        <li>
                            осуществлять внутренний контроль за соблюдением
                            оператором и его работниками законодательства
                            Российской Федерации о персональных данных, в том
                            числе требований к защите персональных данных;
                        </li>
                        <li>
                            доводить до сведения работников оператора положения
                            законодательства Российской Федерации о персональных
                            данных, локальных актов по вопросам обработки
                            персональных данных, требований к защите
                            персональных данных;
                        </li>
                        <li>
                            организовывать прием и обработку обращений и
                            запросов субъектов персональных данных или их
                            представителей и (или) осуществлять контроль за
                            приемом и обработкой таких обращений и запросов.
                        </li>
                    </ol>
                </p>
            </div>
        </section>
    );
};
