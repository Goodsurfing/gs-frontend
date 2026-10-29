import { BULLETS, type LegalDocument, NUMBERED, SECTION, SUBTITLE, TITLE } from "./styles";

/**
 * Политика конфиденциальности (испанский) — текст перенесён из старого фронта
 * (src/pages/PrivacyPolicyPage/ui/TextContent/TextContent.es.tsx) без изменений; абзацы со
 * вложенными списками и подзаголовками — div, а не p (иначе серверная
 * разметка невалидна и браузер разрезает абзац).
 */
export const PRIVACY_POLICY_ES: LegalDocument = {
    menu: [
        { id: "1", title: "1. Disposiciones generales" },
        { id: "2", title: "2. Principios y finalidades del tratamiento de datos personales" },
        { id: "3", title: "3. Bases jurídicas para el tratamiento de datos personales en la Organización" },
        { id: "4", title: "4. Alcance y categorías de datos personales tratados, categorías de interesados" },
        { id: "5", title: "5. Procedimiento y condiciones del tratamiento de datos personales" },
        { id: "6", title: "6. Relación de operaciones con datos personales y métodos de tratamiento" },
        { id: "7", title: "7. Derechos de los interesados" },
        { id: "8", title: "8. Medidas adoptadas por la Organización para garantizar el cumplimiento de las obligaciones del responsable del tratamiento de datos personales" },
        { id: "9", title: "9. Responsabilidad por la organización del tratamiento de datos personales" },
    ],
    body: (
        <>
            <div className={SECTION} id="1">
                <h2 className={TITLE}>1. Disposiciones generales</h2>
                <div>
                    La Política ha sido elaborada de conformidad con el apartado
                    2 del artículo 18.1 de la Ley Federal «Sobre datos
                    personales» No. 152-FZ, de 27 de julio de 2006, y teniendo
                    en cuenta los requisitos de la Constitución de la Federación
                    de Rusia, de los actos legislativos y otros actos normativos
                    de la Federación de Rusia en el ámbito de los datos
                    personales, y determina el procedimiento de actuación de la
                    organización autónoma sin ánimo de lucro «Goodsurfing - viajes
                    solidarios» (en adelante, la Organización) en relación con el
                    tratamiento de datos personales. Definiciones y abreviaturas
                    utilizadas en la Política de tratamiento de datos personales
                    de la organización autónoma sin ánimo de lucro «Goodsurfing -
                    viajes solidarios» (en adelante, la Política).
                    <h3 className={SUBTITLE}>Datos personales</h3>
                    Cualquier información relativa a una persona física
                    identificada o identificable, directa o indirectamente
                    (sujeto de datos personales).
                    <h3 className={SUBTITLE}>Operador</h3>
                    Órgano estatal, órgano municipal, persona jurídica o persona
                    física que, por sí solos o junto con otras personas,
                    organizan y/o realizan el tratamiento de datos personales,
                    así como determinan los fines del tratamiento de datos
                    personales, la composición de los datos personales sujetos a
                    tratamiento y las acciones (operaciones) realizadas con los
                    datos personales.
                    <h3 className={SUBTITLE}>Tratamiento de datos personales</h3>
                    Cualquier acción (operación) o conjunto de acciones
                    (operaciones) realizadas con datos personales con o sin
                    utilización de medios automatizados, incluidas la recogida,
                    el registro, la sistematización, la acumulación, el
                    almacenamiento, la actualización (renovación, modificación),
                    la extracción, el uso, la transmisión (difusión, provisión,
                    acceso), la anonimización, el bloqueo, la supresión y la
                    destrucción de datos personales.
                    <h3 className={SUBTITLE}>Tratamiento automatizado de datos personales</h3>
                    Tratamiento de datos personales mediante equipos de
                    tecnología informática.
                    <h3 className={SUBTITLE}>Provisión de datos personales</h3>
                    Acciones dirigidas a revelar datos personales a una persona
                    determinada o a un círculo determinado de personas.
                    <h3 className={SUBTITLE}>Difusión de datos personales</h3>
                    Acciones dirigidas a revelar datos personales a un círculo
                    indeterminado de personas.
                    <h3 className={SUBTITLE}>Transferencia transfronteriza de datos personales</h3>
                    Transferencia de datos personales al territorio de un Estado
                    extranjero a una autoridad pública de un Estado extranjero, a
                    una persona física extranjera o a una persona jurídica
                    extranjera.
                    <h3 className={SUBTITLE}>Bloqueo de datos personales</h3>
                    Suspensión temporal del tratamiento de datos personales (salvo
                    en los casos en que el tratamiento sea necesario para precisar
                    los datos personales).
                    <h3 className={SUBTITLE}>Destrucción de datos personales</h3>
                    Acciones como resultado de las cuales resulta imposible
                    restablecer el contenido de los datos personales en el sistema
                    de información de datos personales y/o como resultado de las
                    cuales se destruyen los soportes materiales de los datos
                    personales.
                    <h3 className={SUBTITLE}>Anonimización de datos personales</h3>
                    Acciones como resultado de las cuales resulta imposible, sin
                    utilizar información adicional, determinar la pertenencia de
                    los datos personales a un sujeto concreto de datos personales.
                    <h3 className={SUBTITLE}>Sistema de información de datos personales</h3>
                    Conjunto de datos personales contenidos en bases de datos y de
                    las tecnologías de la información y los medios técnicos que
                    garantizan su tratamiento.
                    <h3 className={SUBTITLE}>Sujeto de datos personales</h3>
                    Persona física que está identificada o es identificable,
                    directa o indirectamente, mediante datos personales.
                    <h3 className={SUBTITLE}>Confidencialidad de los datos personales</h3>
                    Requisito obligatorio para el operador o para otra persona que
                    haya tenido acceso a los datos personales de no permitir su
                    difusión sin el consentimiento del sujeto de datos personales
                    o sin otro fundamento legal.
                </div>
            </div>
            <div className={SECTION} id="2">
                <h2 className={TITLE}>
                    2. Principios y finalidades del tratamiento de datos
                    personales
                </h2>
                <div>
                    La Organización, en calidad de operador de datos personales,
                    trata los datos personales de los empleados de la
                    Organización y de los sujetos de datos personales que no
                    mantienen con la Organización relaciones laborales.
                    <br />
                    <br />
                    El tratamiento de datos personales en la Organización se
                    realiza teniendo en cuenta la necesidad de garantizar la
                    protección de los derechos y libertades de los empleados de la
                    Organización y de otros sujetos de datos personales, incluida
                    la protección del derecho a la intimidad, a la vida personal y
                    familiar, sobre la base de los siguientes principios:
                    <ul className={BULLETS}>
                        <li>
                            el tratamiento de datos personales se realiza en la
                            Organización sobre una base legal y equitativa;
                        </li>
                        <li>
                            el tratamiento de datos personales se limita a la
                            consecución de finalidades concretas, determinadas de
                            antemano y legítimas. No se permite el tratamiento de
                            datos personales incompatible con las finalidades de
                            recogida de los datos personales;
                        </li>
                        <li>
                            no se permite la combinación de bases de datos que
                            contengan datos personales cuyo tratamiento se realice
                            con finalidades incompatibles entre sí;
                        </li>
                        <li>
                            son objeto de tratamiento únicamente los datos
                            personales que correspondan a las finalidades de su
                            tratamiento;
                        </li>
                        <li>
                            el contenido y el volumen de los datos personales
                            tratados se corresponden con las finalidades
                            declaradas del tratamiento. No se permite el exceso de
                            datos personales tratados con respecto a las finalidades
                            declaradas de su tratamiento;
                        </li>
                        <li>
                            en el tratamiento de datos personales se garantizan la
                            exactitud de los datos personales, su suficiencia y, en
                            los casos necesarios, su actualidad con respecto a las
                            finalidades del tratamiento de datos personales. La
                            Organización adopta las medidas necesarias o garantiza
                            su adopción para suprimir o precisar los datos
                            personales incompletos o inexactos;
                        </li>
                        <li>
                            los datos personales se almacenan en una forma que
                            permita determinar al sujeto de datos personales, durante
                            un plazo no superior al que requieren las finalidades
                            del tratamiento de datos personales, salvo que el plazo
                            de almacenamiento de datos personales esté establecido
                            por una ley federal, un contrato del que sea parte, o
                            beneficiario o garante, el sujeto de datos personales;
                        </li>
                        <li>
                            los datos personales tratados se destruyen o se
                            anonimizan al alcanzarse las finalidades del tratamiento
                            o en caso de pérdida de la necesidad de alcanzar dichas
                            finalidades, salvo que una ley federal disponga otra
                            cosa.
                        </li>
                    </ul>
                    Los datos personales se tratan en la Organización con las
                    siguientes finalidades:
                    <ul className={BULLETS}>
                        <li>
                            garantizar el cumplimiento de la Constitución de la
                            Federación de Rusia, de los actos legislativos y otros
                            actos normativos de la Federación de Rusia, y de los
                            actos normativos locales de la Organización;
                        </li>
                        <li>
                            ejercer las funciones, facultades y obligaciones
                            impuestas por la legislación de la Federación de Rusia a
                            la Organización, incluida la provisión de datos
                            personales a los órganos del poder estatal, al Fondo de
                            Pensiones de la Federación de Rusia, al Fondo de Seguro
                            Social de la Federación de Rusia, al Fondo Federal del
                            Seguro Médico Obligatorio, así como a otros órganos
                            estatales;
                        </li>
                        <li>
                            regular las relaciones laborales con los empleados de la
                            Organización (asistencia en el empleo, formación y
                            promoción profesional, garantía de la seguridad personal,
                            control de la cantidad y la calidad del trabajo realizado,
                            garantía de la conservación del patrimonio);
                        </li>
                        <li>
                            proporcionar a los empleados de la Organización y a los
                            miembros de sus familias garantías y compensaciones
                            adicionales, incluidas las pensiones no estatales, el
                            seguro médico voluntario, la asistencia médica y otras
                            formas de protección social
                        </li>
                        <li>
                            proteger la vida, la salud u otros intereses vitales de
                            los sujetos de datos personales;
                        </li>
                        <li>
                            preparar, celebrar, ejecutar y rescindir contratos con
                            contrapartes;
                        </li>
                        <li>
                            elaborar materiales de referencia para la información
                            interna de las actividades de la Organización, de sus
                            sucursales y representaciones, así como de las sociedades
                            filiales de la Organización;
                        </li>
                        <li>
                            ejecutar resoluciones judiciales, actos de otros órganos
                            o de funcionarios que deban ejecutarse de conformidad con
                            la legislación de la Federación de Rusia sobre el
                            procedimiento de ejecución;
                        </li>
                        <li>
                            ejercer los derechos e intereses legítimos de la
                            Organización en el marco de las actividades previstas en
                            sus Estatutos y en otros actos normativos locales de la
                            Organización, incluidos, sin limitarse a ello, el registro
                            para proporcionar a los sujetos de datos personales el
                            acceso a la funcionalidad de la Organización, que se
                            implementa, entre otros medios, a través de recursos
                            electrónicos, o a terceros, o la consecución de objetivos
                            de interés social;
                        </li>
                        <li>
                            proporcionar a los sujetos de datos personales la
                            posibilidad de acceder a la funcionalidad implementada por
                            la Organización, incluso a través de los recursos
                            electrónicos de la Organización, con el fin de permitir la
                            participación en eventos, incluida la recepción de
                            invitaciones a eventos, la participación en concursos, la
                            obtención de información sobre prácticas profesionales,
                            proyectos, etc.;
                        </li>
                        <li>
                            mantener el historial de actividad social de los sujetos
                            de datos personales;
                        </li>
                        <li>con otros fines legítimos.</li>
                    </ul>
                </div>
            </div>
            <div className={SECTION} id="3">
                <h2 className={TITLE}>
                    3. Bases jurídicas para el tratamiento de datos personales en
                    la Organización
                </h2>
                <div>
                    La base jurídica para el tratamiento de datos personales es el
                    conjunto de leyes federales y de actos normativos adoptados
                    sobre su base que regulan las relaciones vinculadas con la
                    actividad de la Organización; los documentos estatutarios de
                    la Organización; los contratos celebrados entre la Organización
                    y el sujeto de datos personales; el consentimiento para el
                    tratamiento de datos personales (en los casos no previstos
                    expresamente por la legislación de la Federación de Rusia, pero
                    que correspondan a las facultades de la Organización), en
                    cumplimiento de los cuales y de conformidad con los cuales la
                    Organización realiza el tratamiento de datos personales, entre
                    ellos, a título enunciativo y sin limitarse a:
                    <ul className={BULLETS}>
                        <li>la Constitución de la Federación de Rusia;</li>
                        <li>el Código del Trabajo de la Federación de Rusia;</li>
                        <li>el Código Civil de la Federación de Rusia</li>
                        <li>el Código Tributario de la Federación de Rusia;</li>
                        <li>
                            la Ley de la Federación de Rusia de 29.12.2012 No.
                            273-FZ «Sobre la educación en la Federación de Rusia»;
                        </li>
                        <li>
                            otros actos normativos de la Federación de Rusia y
                            documentos normativos de los órganos estatales
                            competentes;
                        </li>
                        <li>los Estatutos de la Organización;</li>
                        <li>
                            los contratos, acuerdos o convenios en los que la
                            Organización sea una de las partes
                        </li>
                        <li>
                            el consentimiento del sujeto de datos personales para el
                            tratamiento de sus datos personales;
                        </li>
                        <li>otros documentos.</li>
                    </ul>
                </div>
            </div>
            <div className={SECTION} id="4">
                <h2 className={TITLE}>
                    4. Volumen y categorías de datos personales tratados,
                    categorías de sujetos de datos personales
                </h2>
                <div>
                    La lista de datos personales tratados en la Organización se
                    determina de conformidad con la legislación de la Federación
                    de Rusia y con los actos normativos locales de la Organización,
                    teniendo en cuenta las finalidades del tratamiento de datos
                    personales indicadas en la sección 2 de la Política.
                    <br />
                    <br />
                    La Organización no realiza el tratamiento de categorías
                    especiales de datos personales relativas a la raza, las
                    convicciones religiosas o la vida íntima.
                    <br />
                    <br />
                    El tratamiento de categorías especiales de datos personales
                    relativas a las opiniones políticas, las convicciones
                    filosóficas y el estado de salud se realiza en estricta
                    conformidad y en el procedimiento establecido por la
                    legislación de la Federación de Rusia.
                    <br />
                    <br />
                    En la Organización se tratan los datos personales de las
                    siguientes categorías de sujetos:
                    <ul className={BULLETS}>
                        <li>
                            empleados de la Organización, antiguos empleados,
                            candidatos a cubrir puestos vacantes, así como familiares
                            de los empleados;
                        </li>
                        <li>
                            clientes y contrapartes de la Organización (personas
                            físicas);
                        </li>
                        <li>
                            representantes/empleados de clientes y contrapartes de la
                            Organización (personas jurídicas);
                        </li>
                    </ul>
                    La composición de los datos personales tratados por la
                    Organización en el marco de los eventos que la Organización
                    celebra para personas físicas se determina por las finalidades
                    concretas del tratamiento y se indica en los consentimientos
                    para el tratamiento de datos personales de los sujetos.
                </div>
            </div>
            <div className={SECTION} id="5">
                <h2 className={TITLE}>
                    5. Procedimiento y condiciones del tratamiento de datos
                    personales
                </h2>
                <div>
                    Al realizar el tratamiento de datos personales, la Organización:
                    <ul className={BULLETS}>
                        <li>
                            adopta las medidas necesarias y suficientes para
                            garantizar el cumplimiento de los requisitos de la
                            legislación de la Federación de Rusia y de los actos
                            normativos locales de la Organización en materia de datos
                            personales;
                        </li>
                        <li>
                            adopta medidas jurídicas, organizativas y técnicas para
                            proteger los datos personales frente al acceso ilícito o
                            accidental a ellos, su destrucción, modificación, bloqueo,
                            copia, provisión o difusión, así como frente a otras
                            acciones ilícitas con respecto a los datos personales;
                        </li>
                        <li>
                            designa a la persona responsable de la organización del
                            tratamiento de datos personales en la Organización;
                        </li>
                        <li>
                            publica actos normativos locales que definen la política
                            y las cuestiones del tratamiento y la protección de datos
                            personales en la Organización;
                        </li>
                        <li>
                            garantiza que los empleados de la Organización, de sus
                            sucursales y representaciones que realizan directamente
                            el tratamiento de datos personales conozcan las
                            disposiciones de la legislación de la Federación de Rusia
                            y de los actos normativos locales de la Organización en
                            materia de datos personales, incluidos los requisitos de
                            protección de datos personales, y forma a dichos empleados;
                        </li>
                        <li>
                            publica o garantiza de otro modo el acceso sin restricciones
                            a la presente Política;
                        </li>
                        <li>
                            informa, en el procedimiento establecido, a los sujetos de
                            datos personales o a sus representantes sobre la existencia
                            de datos personales relativos a los sujetos correspondientes,
                            y facilita la posibilidad de conocer dichos datos personales
                            al recibir solicitudes de dichos sujetos de datos personales
                            o de sus representantes, salvo que la legislación de la
                            Federación de Rusia disponga otra cosa;
                        </li>
                        <li>
                            pone fin al tratamiento y destruye los datos personales en
                            los casos previstos por la legislación de la Federación de
                            Rusia en materia de datos personales;
                        </li>
                        <li>
                            realiza las demás acciones previstas por la legislación de
                            la Federación de Rusia en materia de datos personales.
                        </li>
                    </ul>
                    Condiciones del tratamiento de datos personales en la
                    Organización.
                    <br />
                    <br />
                    El tratamiento de datos personales en la Organización se
                    realiza con el consentimiento del sujeto de datos personales
                    para el tratamiento de sus datos personales, salvo que la
                    legislación de la Federación de Rusia en materia de datos
                    personales disponga otra cosa.
                    <br />
                    <br />
                    La Organización no revela a terceros ni difunde datos
                    personales sin el consentimiento del sujeto de datos
                    personales, salvo que una ley federal disponga otra cosa.
                    <br />
                    <br />
                    La Organización tiene derecho a encomendar el tratamiento de
                    datos personales a otra persona con el consentimiento del
                    sujeto de datos personales, sobre la base de un contrato que
                    se celebre con dicha persona. El contrato debe contener la lista
                    de acciones (operaciones) con datos personales que realizará la
                    persona que trate los datos personales, las finalidades del
                    tratamiento, la obligación de dicha persona de guardar la
                    confidencialidad de los datos personales y de garantizar su
                    seguridad durante el tratamiento, así como los requisitos de
                    protección de los datos personales tratados de conformidad con
                    el artículo 19 de la Ley Federal «Sobre datos personales».
                    <br />
                    <br />
                    Con fines de información interna, la Organización puede crear
                    materiales de referencia internos en los que, con el
                    consentimiento por escrito del sujeto de datos personales, si
                    otra cosa no está prevista por la legislación de la Federación
                    de Rusia, se podrán incluir sus apellidos, nombre, patronímico,
                    lugar de trabajo, cargo, año y lugar de nacimiento, dirección,
                    número de abonado, dirección de correo electrónico y otros datos
                    personales facilitados por el sujeto de datos personales.
                    <br />
                    <br />
                    El acceso a los datos personales tratados en la Organización se
                    permite únicamente a los empleados de la Organización que ocupen
                    cargos incluidos en la lista de cargos de las unidades
                    estructurales de la Organización, de sus sucursales y
                    representaciones, cuyo desempeño suponga el tratamiento de
                    datos personales.
                    <br />
                    <br />
                    La Organización pone fin al tratamiento de datos personales al
                    alcanzarse las finalidades del tratamiento de datos personales,
                    al expirar el plazo de vigencia del consentimiento, al retirar
                    el sujeto de datos personales su consentimiento para el
                    tratamiento de sus datos personales, así como al detectarse un
                    tratamiento ilícito de datos personales. Los plazos concretos
                    de tratamiento de datos personales por la Organización en el
                    marco de los eventos que la Organización celebra para personas
                    físicas se indican en los consentimientos para el tratamiento
                    de datos personales del sujeto.
                </div>
            </div>
            <div className={SECTION} id="6">
                <h2 className={TITLE}>
                    6. Lista de acciones con datos personales y modos de su
                    tratamiento
                </h2>
                <div>
                    La Organización realiza la recogida, el registro, la
                    sistematización, la acumulación, el almacenamiento, la
                    actualización (renovación, modificación), la extracción, el
                    uso, la transmisión (difusión, provisión, acceso), la
                    anonimización, el bloqueo, la supresión y la destrucción de
                    datos personales.
                    <br />
                    <br />
                    El tratamiento de datos personales en la Organización se
                    realiza mediante los siguientes modos:
                    <ul className={BULLETS}>
                        <li>
                            tratamiento de datos personales no automatizado;
                        </li>
                        <li>
                            tratamiento automatizado de datos personales con
                            transmisión de la información obtenida por redes de
                            telecomunicaciones de información o sin ella;
                        </li>
                        <li>tratamiento mixto de datos personales.</li>
                    </ul>
                </div>
            </div>
            <div className={SECTION} id="7">
                <h2 className={TITLE}>
                    7. Derechos de los sujetos de datos personales
                </h2>
                <div>
                    Los sujetos de datos personales tienen derecho a:
                    <ul className={BULLETS}>
                        <li>
                            obtener información completa sobre sus datos personales
                            tratados en la Organización;
                        </li>
                        <li>
                            acceder a sus datos personales, incluido el derecho a
                            obtener una copia de cualquier registro que contenga sus
                            datos personales, salvo en los casos previstos por una ley
                            federal, así como acceder, con ayuda de un profesional
                            sanitario de su elección, a los datos médicos que les
                            conciernan;
                        </li>
                        <li>
                            precisar sus datos personales, bloquearlos o destruirlos
                            en caso de que los datos personales sean incompletos,
                            desactualizados, inexactos, obtenidos ilícitamente o no
                            sean necesarios para la finalidad declarada del
                            tratamiento;
                        </li>
                        <li>
                            retirar el consentimiento para el tratamiento de datos
                            personales;
                        </li>
                        <li>
                            adoptar las medidas previstas por la ley para proteger sus
                            derechos;
                        </li>
                        <li>
                            recurrir la acción u omisión de la Organización realizada
                            con infracción de los requisitos de la legislación de la
                            Federación de Rusia en materia de datos personales, ante el
                            órgano competente en materia de protección de los derechos
                            de los sujetos de datos personales o ante un tribunal
                        </li>
                        <li>
                            ejercer otros derechos previstos por la legislación de la
                            Federación de Rusia.
                        </li>
                    </ul>
                </div>
            </div>
            <div className={SECTION} id="8">
                <h2 className={TITLE}>
                    8. Medidas adoptadas por la Organización para garantizar el
                    cumplimiento de las obligaciones del operador en el tratamiento
                    de datos personales
                </h2>
                <div>
                    Las medidas necesarias y suficientes para garantizar el
                    cumplimiento por la Organización de las obligaciones del
                    operador previstas por la legislación de la Federación de Rusia
                    en materia de datos personales incluyen:
                    <ul className={BULLETS}>
                        <li>
                            la designación de las personas responsables de la
                            organización del tratamiento de datos personales en la
                            Organización;
                        </li>
                        <li>
                            la adopción de actos normativos locales y de otros
                            documentos en materia de tratamiento y protección de datos
                            personales;
                        </li>
                        <li>
                            la organización de la formación y la realización de
                            trabajo metodológico con los empleados de las unidades
                            estructurales de la Organización, de sus sucursales y
                            representaciones que ocupen cargos que impliquen el
                            tratamiento de datos personales;
                        </li>
                        <li>
                            la obtención de los consentimientos de los sujetos de datos
                            personales para el tratamiento de sus datos personales,
                            salvo en los casos previstos por la legislación de la
                            Federación de Rusia;
                        </li>
                        <li>
                            la separación de los datos personales tratados sin
                            utilización de medios automatizados de otra información,
                            en particular mediante su registro en soportes materiales
                            separados de datos personales, en secciones especiales;
                        </li>
                        <li>
                            la garantía de la conservación por separado de los datos
                            personales y de sus soportes materiales, cuyo tratamiento
                            se realiza con finalidades distintas y que contienen
                            categorías diferentes de datos personales;
                        </li>
                        <li>
                            el establecimiento de la prohibición de transmitir datos
                            personales por canales de comunicación abiertos, redes
                            informáticas fuera de la zona controlada, la red de datos
                            unificada de la Organización (EVSPD) y las redes de
                            Internet sin aplicar las medidas de seguridad establecidas
                            en la Organización para los datos personales (salvo los
                            datos personales de acceso público y/o anonimizados);
                        </li>
                        <li>
                            la custodia de los soportes materiales de datos personales
                            en condiciones que garanticen la conservación de los datos
                            personales y excluyan el acceso no autorizado a ellos;
                        </li>
                        <li>
                            el ejercicio del control interno de la conformidad del
                            tratamiento de datos personales con la Ley Federal «Sobre
                            datos personales» de 27 de julio de 2006, No. 152-FZ, y con
                            los actos normativos adoptados de conformidad con ella, con
                            los requisitos de protección de datos personales, con la
                            presente Política y con los actos normativos locales de la
                            Organización;
                        </li>
                        <li>
                            otras medidas previstas por la legislación de la Federación
                            de Rusia en materia de datos personales.
                        </li>
                    </ul>
                    Las medidas para garantizar la seguridad de los datos personales
                    en su tratamiento en los sistemas de información de datos
                    personales se establecen de conformidad con los actos normativos
                    locales de la Organización que regulan las cuestiones de
                    garantía de la seguridad de los datos personales en su
                    tratamiento en los sistemas de información de datos personales
                    de la Organización.
                </div>
            </div>
            <div className={SECTION} id="9">
                <h2 className={TITLE}>
                    9. Responsabilidad por la organización del tratamiento de datos
                    personales
                </h2>
                <div>
                    La Organización designa a las personas responsables de la
                    organización del tratamiento de datos personales.
                    <br />
                    <br />
                    La persona responsable de la organización del tratamiento de
                    datos personales recibe instrucciones directamente del órgano
                    ejecutivo de la Organización y le rinde cuentas.
                    <br />
                    <br />
                    La persona responsable de la organización del tratamiento de
                    datos personales está obligada, en particular, a:
                    <ol className={NUMBERED}>
                        <li>
                            ejercer el control interno del cumplimiento por el
                            operador y sus empleados de la legislación de la
                            Federación de Rusia en materia de datos personales, incluidos
                            los requisitos de protección de datos personales;
                        </li>
                        <li>
                            dar a conocer a los empleados del operador las disposiciones
                            de la legislación de la Federación de Rusia en materia de
                            datos personales, los actos locales sobre cuestiones de
                            tratamiento de datos personales y los requisitos de
                            protección de datos personales;
                        </li>
                        <li>
                            organizar la recepción y el tratamiento de las solicitudes
                            y peticiones de los sujetos de datos personales o de sus
                            representantes, y/o ejercer el control sobre la recepción y
                            el tratamiento de dichas solicitudes y peticiones.
                        </li>
                    </ol>
                </div>
            </div>
    
        </>
    ),
};
