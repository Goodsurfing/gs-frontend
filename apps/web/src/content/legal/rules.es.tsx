import { BULLETS, type LegalDocument, SECTION, TITLE } from "./styles";

/**
 * Правила платформы (испанский) — текст перенесён из старого фронта
 * (src/pages/RulesPage/ui/TextContent/TextContent.es.tsx) без изменений; абзацы со
 * вложенными списками и подзаголовками — div, а не p (иначе серверная
 * разметка невалидна и браузер разрезает абзац).
 */
export const RULES_ES: LegalDocument = {
    intro: {
        title: "Condiciones de uso de Goodsurfing",
        text: "Última actualización de las Condiciones de uso de Goodsurfing: 15 de enero de 2023. Las presentes Condiciones de uso (en adelante, las Condiciones) constituyen un acuerdo vinculante (en adelante, el Acuerdo) entre usted y Goodsurfing, que regula su acceso y uso del sitio web goodsurfing.org, incluidos sus subdominios, y de cualquier otro sitio en el que Goodsurfing preste sus servicios (conjuntamente, el Sitio), nuestras aplicaciones móviles, así como las interfaces de programación de aplicaciones (conjuntamente, la Aplicación) y todos los servicios relacionados con ellos (conjuntamente, los Servicios de Goodsurfing). El Sitio, la Aplicación y los Servicios de Goodsurfing se denominan en conjunto, en adelante, Plataforma Goodsurfing. La Política de privacidad y demás condiciones aplicables al uso que usted haga de la Plataforma Goodsurfing forman parte del presente Acuerdo.",
    },
    menu: [
        { id: "1", title: "1. Disposiciones generales" },
        { id: "2", title: "2. Verificación de usuarios y restricción de acceso" },
        { id: "3", title: "3. Procedimiento de modificación de las Condiciones" },
        { id: "4", title: "4. Registro de la cuenta" },
        { id: "5", title: "5. Contenido y normas de uso del mismo" },
        { id: "6", title: "6. Goodsurfer. Membresía de Goodsurfing. Condiciones especiales" },
        { id: "7", title: "7. Host y empleador. Condiciones especiales" },
        { id: "8", title: "8. Calificación y opiniones" },
        { id: "9", title: "9. Daños causados en el marco de la actividad del proyecto" },
        { id: "10", title: "10. Terminación del Acuerdo" },
        { id: "11", title: "11. Disposiciones especiales" },
        { id: "12", title: "12. Responsabilidad" },
        { id: "13", title: "13. Comentarios y datos de la organización" },
    ],
    body: (
        <>
            <div className={SECTION} id="1">
                <h2 className={TITLE}>1. Disposiciones generales</h2>
                <p>
                    1.1. La Plataforma Goodsurfing es un recurso que facilita el
                    establecimiento de vínculos entre voluntarios y viajeros
                    (en adelante, Goodsurfer), organizadores de proyectos de
                    voluntariado (en adelante, Host) y empleadores.
                    <br />
                    <br />
                    1.2. El Host o el empleador publica información sobre el
                    proyecto en la Plataforma Goodsurfing con el fin de buscar
                    ayuda para su ejecución, alcanzar los objetivos del proyecto,
                    así como fomentar el trabajo conjunto, el aprendizaje y el
                    intercambio cultural.
                    <br />
                    <br />
                    1.3. El Goodsurfer puede presentar una solicitud para
                    participar en el proyecto. A cambio de su ayuda en la
                    realización de las actividades del proyecto, el Goodsurfer
                    puede obtener alojamiento gratuito, alimentación, excursiones
                    y/u otras ventajas establecidas por el Host o el empleador,
                    así como por las normas del proyecto. El Goodsurfer, el Host
                    y el empleador se denominan conjuntamente en adelante
                    “Usuarios”.
                    <br />
                    <br />
                    1.4. La Plataforma Goodsurfing no posee, no crea ni gestiona
                    los proyectos creados por los Hosts y empleadores, no organiza
                    viajes, no actúa como intermediaria en las relaciones
                    laborales y no asume ninguna responsabilidad por los acuerdos
                    alcanzados entre los Usuarios después del primer encuentro en
                    la plataforma.
                    <br />
                    <br />
                    1.5. Los Hosts y empleadores asumen plena responsabilidad por
                    los proyectos que publican. Cuando los Goodsurfers presentan
                    una solicitud de participación en un proyecto y reciben la
                    confirmación, celebran un acuerdo directamente con el Host o
                    el empleador.
                    <br />
                    <br />
                    1.6. Goodsurfing no es una agencia de viajes, una compañía de
                    seguros ni una entidad similar. Goodsurfing no actúa como
                    agente del Goodsurfer.
                    <br />
                    <br />
                    1.7. Goodsurfing puede tener proyectos propios. En tal caso,
                    le son aplicables todos los requisitos y normas aplicables al
                    Host y al empleador.
                    <br />
                    <br />
                    1.8 Goodsurfing no controla ni garantiza la calidad ni la
                    existencia de las condiciones y requisitos indicados en la
                    descripción de un proyecto creado por un Host o empleador
                    distinto de Goodsurfing. La responsabilidad por el
                    cumplimiento de las condiciones del proyecto recae en el Host
                    o el empleador que publicó el proyecto en la Plataforma
                    Goodsurfing.
                    <br />
                    <br />
                    1.9. Goodsurfing no certifica a ningún Goodsurfer, Host o
                    empleador en particular. Los Usuarios determinan por sí mismos
                    la confiabilidad de un Goodsurfer, Host o empleador, a partir
                    de sus propias conclusiones. Las marcas y comentarios sobre
                    los Usuarios en la Plataforma Goodsurfing son opiniones
                    privadas y subjetivas. Los Usuarios asumen por sí mismos la
                    responsabilidad de todas sus decisiones y medidas de
                    precaución.
                    <br />
                    <br />
                    1.10. Para promocionar la Plataforma Goodsurfing y ampliar el
                    alcance de los posibles participantes, la información sobre
                    el proyecto y otro Contenido del Usuario podrán utilizarse en
                    otros sitios y recursos de Goodsurfing, incluida la publicidad
                    en línea y fuera de línea.
                    <br />
                    <br />
                    1.11. Para ayudar a los usuarios que hablan distintos idiomas
                    a obtener información fiable sobre los proyectos y/o los
                    Goodsurfers, la información podrá traducirse a otros idiomas.
                    <br />
                    <br />
                    1.12. La Plataforma Goodsurfing puede contener enlaces a
                    sitios o recursos de terceros. A estos servicios de terceros
                    pueden aplicarse otras condiciones y políticas de privacidad.
                    Goodsurfing no asume responsabilidad por la disponibilidad o
                    la exactitud de dichos servicios, ni por el contenido, los
                    productos o los servicios disponibles en ellos.
                </p>
            </div>
            <div className={SECTION} id="2">
                <h2 className={TITLE}>
                    2. Verificación de usuarios y restricción del acceso
                </h2>
                <p>
                    2.1. En el momento del registro, debe tener al menos 18 años.
                    Al acceder a la Plataforma Goodsurfing y/o utilizarla, usted
                    confirma que tiene 18 años cumplidos y que dispone de la
                    capacidad necesaria para celebrar el Acuerdo.
                    <br />
                    <br />
                    2.2. Los participantes menores de edad pueden convertirse en
                    participantes con la ayuda de sus representantes legales.
                    <br />
                    <br />
                    2.3. Goodsurfing tiene derecho a restringir el acceso a
                    determinados recursos de la Plataforma Goodsurfing a los
                    usuarios que no hayan contratado la membresía de Goodsurfing
                    y/o que tengan una calificación baja.
                    <br />
                    <br />
                    2.4. Con el fin de garantizar la transparencia y prevenir el
                    fraude, y de conformidad con la legislación vigente, podemos,
                    pero no estamos obligados a: solicitar a los Usuarios que
                    presenten documentos oficiales de identidad u otra
                    información; realizar verificaciones adicionales destinadas a
                    confirmar la identidad y el historial de los Usuarios, en caso
                    de que exista información suficiente sobre condenas penales,
                    delitos sexuales y otros similares.
                    <br />
                    <br />
                    2.5. El acceso o el uso de determinadas áreas o funciones de
                    la Plataforma Goodsurfing puede estar sujeto a condiciones y
                    normas distintas y/o puede exigir que acepte términos y
                    condiciones adicionales. En caso de contradicción entre las
                    disposiciones y condiciones, prevalecerán las últimas
                    disposiciones y condiciones en cuanto al acceso y uso de dicha
                    área o recurso, salvo que se indique lo contrario.
                    <br />
                    <br />
                    2.6. Cuando sea necesario, Goodsurfing podrá limitar el acceso
                    a la Plataforma Goodsurfing o a determinadas áreas y recursos
                    de la misma, en relación con la limitación del ancho de banda,
                    la seguridad y la integridad de nuestros servidores, o para
                    llevar a cabo tareas de mantenimiento técnico. Puede optimizar
                    y actualizar la Plataforma Goodsurfing e implementar nuevos
                    servicios de Goodsurfing.
                </p>
            </div>
            <div className={SECTION} id="3">
                <h2 className={TITLE}>
                    3. Procedimiento de modificación de las Condiciones
                </h2>
                <p>
                    3.1 Goodsurfing se reserva el derecho de modificar las
                    Condiciones en cualquier momento. En caso de modificación de
                    las condiciones, las nuevas condiciones se publicarán en la
                    Plataforma Goodsurfing con indicación de la fecha de la última
                    actualización.
                    <br />
                    <br />
                    3.2 Si no está de acuerdo con las Condiciones modificadas,
                    puede escribir al correo electrónico support@goodsurfing.org
                    solicitando la eliminación de su cuenta; en caso contrario, su
                    acceso continuado a la Plataforma Goodsurfing o su uso de la
                    misma implicará su aceptación de las Condiciones modificadas.
                </p>
            </div>
            <div className={SECTION} id="4">
                <h2 className={TITLE}>4. Registro de cuenta</h2>
                <p>
                    4.1. Debe registrar una cuenta (en adelante, Cuenta de
                    Goodsurfing) para acceder y utilizar la Plataforma Goodsurfing.
                    Es un requisito necesario para publicar un proyecto, presentar
                    una solicitud para un proyecto o intercambiar mensajes.
                    <br />
                    <br />
                    4.2. Puede registrar una Cuenta de Goodsurfing utilizando una
                    dirección de correo electrónico o a través de la vinculación
                    con su cuenta en redes sociales de terceros.
                    <br />
                    <br />
                    4.3. Debe indicar información fiable, exacta y completa en el
                    perfil de su Cuenta de Goodsurfing, así como mantenerla
                    actualizada.
                    <br />
                    <br />
                    4.4. No puede registrar más de 1 (una) Cuenta de Goodsurfing
                    por 1 (una) dirección de correo electrónico o cuenta en una red
                    social de terceros. No tiene derecho a transferir su Cuenta de
                    Goodsurfing a ningún tercero.
                    <br />
                    <br />
                    4.5. Usted es responsable de mantener la confidencialidad y la
                    seguridad de los datos de su Cuenta de Goodsurfing y no tiene
                    derecho a revelar dichos datos a terceros. Debe notificar de
                    inmediato a Goodsurfing si tiene conocimiento del robo, la
                    pérdida, la apropiación indebida o el uso no autorizado (incluida
                    la sospecha) de los datos de su Cuenta de Goodsurfing.
                    <br />
                    <br />
                    4.6. Usted es responsable de cualquier acción realizada a
                    través de su Cuenta de Goodsurfing, salvo en los casos en que
                    dichas acciones se hayan llevado a cabo después de su
                    declaración de pérdida de los datos de la Cuenta de Goodsurfing.
                </p>
            </div>
            <div className={SECTION} id="5">
                <h2 className={TITLE}>
                    5. Contenido y normas para su uso
                </h2>
                <div>
                    5.1 Goodsurfing puede, a su exclusivo criterio, permitir a los
                    Usuarios:
                    <ul className={BULLETS}>
                        <li>
                            crear, cargar, publicar, enviar, recibir y almacenar
                            contenido (texto, fotografías, audio, vídeo u otros
                            materiales e información) en la Plataforma Goodsurfing
                            o a través de ella (en adelante, Contenido del
                            Usuario);
                        </li>
                        <li>
                            acceder y ver el Contenido del Usuario y cualquier otro
                            contenido proporcionado en la Plataforma Goodsurfing,
                            incluido el contenido propiedad de Goodsurfing y
                            cualquier contenido licenciado o autorizado para su uso
                            por Goodsurfing por un tercero (en adelante,
                            &quot;Contenido colectivo&quot;).
                        </li>
                    </ul>
                    5.2. La Plataforma Goodsurfing, el Contenido de Goodsurfing y
                    el Contenido del Usuario pueden estar total o parcialmente
                    protegidos por derechos de autor. Usted reconoce y acepta que
                    la Plataforma Goodsurfing y el Contenido de Goodsurfing,
                    incluidos todos los derechos de propiedad intelectual
                    relacionados con ellos, son propiedad exclusiva de Goodsurfing.
                    No debe eliminar, modificar ni ocultar ningún derecho de autor,
                    marca de servicio u otro derecho de propiedad incluido en la
                    Plataforma Goodsurfing, en el Contenido de Goodsurfing o en el
                    Contenido del Usuario, ni los que los acompañen.
                    <br />
                    <br />
                    5.3. Las marcas de servicio, logotipos y cualesquiera otras
                    designaciones pertenecientes a terceros y utilizadas por la
                    Plataforma Goodsurfing, el Contenido de Goodsurfing y/o el
                    Contenido colectivo se emplean únicamente con fines de
                    identificación y pueden ser propiedad de sus respectivos
                    titulares.
                    <br />
                    <br />
                    5.4. Usted es el único responsable de todo el Contenido que
                    proporcione en la Plataforma Goodsurfing o a través de ella.
                    Por lo tanto, declara y garantiza que es el único y exclusivo
                    titular de todo el Contenido del Usuario que proporciona en la
                    Plataforma Goodsurfing o a través de ella, o que dispone de
                    todos los derechos, licencias, consentimientos y autorizaciones
                    necesarios para conceder a Goodsurfing los derechos sobre dicho
                    Contenido del Usuario.
                    <br />
                    <br />
                    5.5. Usted garantiza que el Contenido del Usuario que publique,
                    así como los materiales del proyecto, no es:
                    <ul className={BULLETS}>
                        <li>
                            fraudulento, falso, engañoso (directa o indirectamente)
                            o denigrante;
                        </li>
                        <li>
                            desacreditador, calumnioso, obsceno, pornográfico,
                            vulgar u ofensivo;
                        </li>
                        <li>
                            que fomente la discriminación, la intolerancia, el
                            racismo, el odio, el acoso o que cause daño a cualquier
                            persona o grupo de personas;
                        </li>
                        <li>
                            violento o amenazante, que fomente la violencia o las
                            acciones que amenacen a cualquier persona o animal;
                        </li>
                        <li>
                            que promueva sustancias o acciones nocivas o ilegales;
                        </li>
                        <li>que infrinja las Condiciones de Goodsurfing.</li>
                    </ul>
                    Goodsurfing puede eliminar o desactivar sin previo aviso el
                    acceso a cualquier Contenido del Usuario que Goodsurfing
                    considere una infracción de las Condiciones o que pueda causar
                    un daño potencial a Goodsurfing, a sus Usuarios, a terceros o a
                    su propiedad.
                    <br />
                    <br />
                    5.6. Goodsurfing respeta la legislación sobre derechos de autor
                    y espera que sus Usuarios actúen de la misma manera. Si
                    considera que algún contenido de la Plataforma Goodsurfing
                    infringe los derechos de autor sobre su propiedad, le rogamos
                    que nos lo comunique en: support@goodsurfing.org.
                </div>
            </div>
            <div className={SECTION} id="6">
                <h2 className={TITLE}>
                    6. Goodsurfer. Membresía de Goodsurfing. Condiciones especiales
                </h2>
                <div>
                    6.1 Tras completar el procedimiento de registro como goodsurfer,
                    usted se convierte en participante de la Plataforma
                    Goodsurfing.
                    6.2. Tras completar el registro, obtiene acceso a:
                    <ul className={BULLETS}>
                        <li> área personal;</li>
                        <li>
                            posibilidad de presentar solicitudes de participación en
                            proyectos;
                        </li>
                        <li>
                            acceso a la dirección exacta y al lugar de realización
                            del proyecto;
                        </li>
                        <li>dejar Opiniones y asignar una Calificación;</li>
                        <li>
                            mantener correspondencia con el Host, el empleador o el
                            Goodsurfer.
                        </li>
                    </ul>
                    6.3. Al contratar la membresía de Goodsurfing, obtiene acceso a
                    funciones, secciones y recursos cerrados de la Plataforma
                    Goodsurfing, y contribuye al desarrollo del proyecto. La lista
                    de funciones, secciones y recursos se ampliará. 6.4. Los
                    participantes que hayan contratado la membresía de Goodsurfing
                    reciben:
                    <ul className={BULLETS}>
                        <li>
                            posibilidad de presentar un número ilimitado de
                            solicitudes a todos los proyectos de cualquier área;
                        </li>
                        <li>atención técnica personalizada;</li>
                        <li>
                            acceso a los materiales educativos de Goodsurfing;
                        </li>
                        <li>
                            descuentos y códigos promocionales para bienes y
                            servicios destinados a viajeros;
                        </li>
                        <li>acceso a proyectos especiales y proyectos con calificación;</li>
                        <li>
                            posibilidad de dejar y recibir Opiniones y Calificaciones
                            sin restricciones.
                        </li>
                    </ul>
                    6.5. Goodsurfing se reserva el derecho de modificar en
                    cualquier momento el importe de la membresía de Goodsurfing;
                    notificaremos previamente a los Usuarios cualquier cambio antes
                    de que se apliquen.
                    <br />
                    <br />
                    6.6. Tras enviar una solicitud a un proyecto y recibir la
                    confirmación de la solicitud por parte del Host o el empleador,
                    es necesario ponerse en contacto con el Host o el empleador
                    (si el Host o el empleador no se ha puesto en contacto con
                    usted primero) para aclarar las condiciones adicionales y
                    celebrar un acuerdo sobre su admisión en el proyecto, en el que
                    se indicarán todas las condiciones necesarias de alimentación,
                    alojamiento, cancelación de la participación, etc. La plantilla
                    del acuerdo con el Goodsurfer puede encontrarse en el perfil de
                    la Cuenta de Goodsurfing, en la sección “Plantillas”.
                    <br />
                    <br />
                    6.7. Usted acepta abandonar el proyecto a más tardar en la
                    fecha y hora indicadas por el Host o el empleador en la
                    descripción del proyecto o en el acuerdo (si lo hubiera). Si
                    permanece después del plazo de salida acordado sin el
                    consentimiento del Host o del empleador, este tiene derecho a
                    exigir su partida de conformidad con la legislación vigente.
                </div>
            </div>
            <div className={SECTION} id="7">
                <h2 className={TITLE}>
                    7. Host y empleador. Condiciones especiales
                </h2>
                <div>
                    7.1. Tras completar el procedimiento de registro como
                    organizador, usted se convierte en participante de la
                    Plataforma Goodsurfing: host o empleador, según la orientación
                    de su proyecto. En caso de que ofrezca una vacante remunerada y
                    busque un empleado para su proyecto, se convierte en
                    empleador y su proyecto se publica en la categoría
                    correspondiente.
                    <br />
                    <br />
                    7.2. Al crear y publicar un proyecto a través de la Plataforma
                    Goodsurfing, usted debe:
                    <ul className={BULLETS}>
                        <li>indicar la dirección exacta de realización del proyecto;</li>
                        <li>
                            indicar las fechas de realización del proyecto. Si es
                            periódico, puede añadir un período o indicar varias
                            fechas. Asimismo, debe indicar el plazo mínimo y máximo
                            de participación del voluntario y la fecha límite para
                            presentar solicitudes;
                        </li>
                        <li>
                            indicar los requisitos y restricciones básicos: sexo,
                            edad y conocimiento de idiomas;
                        </li>
                        <li>
                            seleccionar las habilidades que debe poseer el
                            voluntario, así como describir detalladamente las
                            particularidades del trabajo en su proyecto;
                        </li>
                        <li>
                            indicar la lista de ventajas, servicios y beneficios
                            que puede proporcionar al Goodsurfer;
                        </li>
                        <li>indicar la descripción completa y breve del proyecto;</li>
                        <li>
                            proporcionar cualquier otra información pertinente
                            solicitada por Goodsurfing. Usted es responsable de
                            mantener permanentemente actualizada la información de
                            sus publicaciones (incluida la disponibilidad del
                            calendario).
                        </li>
                    </ul>
                    7.3. Al crear y publicar un proyecto a través de la Plataforma
                    Goodsurfing está prohibido indicar contactos personales o de la
                    organización (número de teléfono móvil, correo electrónico,
                    etc.). El primer contacto con el Goodsurfer debe producirse en
                    la Plataforma Goodsurfing. Esto permite que su proyecto gane
                    calificación y se vuelva más popular, y también nos permite
                    mejorar la Plataforma Goodsurfing. Una vez confirmada la
                    solicitud del Goodsurfer en la Plataforma Goodsurfing, para
                    debatir las condiciones posteriores, puede enviar sus contactos
                    en los mensajes privados al Goodsurfer; publicar el contenido
                    indicado en el punto 5.5.
                    <br />
                    <br />
                    7.4. Usted es el único responsable de establecer las condiciones
                    de su proyecto. Una vez que el Goodsurfer presenta una solicitud
                    de participación en el proyecto y usted la acepta, debe
                    ponerse en contacto con el Goodsurfer y debatir todas las
                    condiciones, los detalles y los aspectos organizativos, así como
                    celebrar un acuerdo con el Goodsurfer (si fuera necesario). La
                    plantilla del acuerdo con el Goodsurfer puede encontrarse en el
                    perfil de la Cuenta de Goodsurfing, en la sección “Plantillas”.
                    <br />
                    <br />
                    7.5. Cualesquiera condiciones y disposiciones indicadas en la
                    descripción de su proyecto y en el acuerdo con el Goodsurfer no
                    deben contradecir las presentes Condiciones.
                    <br />
                    <br />
                    7.6. La popularidad de los proyectos en la Plataforma
                    Goodsurfing puede variar en función de múltiples factores, tales
                    como: las preferencias de los Goodsurfers, los parámetros de
                    búsqueda, los requisitos de las condiciones, la disponibilidad
                    del calendario, la descripción del proyecto, la cantidad y la
                    calidad de las imágenes, las valoraciones, las opiniones, etc.
                </div>
            </div>
            <div className={SECTION} id="8">
                <h2 className={TITLE}>8. Calificación y opiniones</h2>
                <p>
                    8.1 Tras la finalización del proyecto, el Goodsurfer, el Host y
                    el empleador pueden dejar una opinión pública en la Plataforma
                    Goodsurfing (en adelante, Opinión) y asignar una calificación
                    en estrellas (en adelante, Calificación) el uno al otro. La
                    Calificación y las Opiniones reflejan las opiniones subjetivas
                    de determinados Usuarios y no reflejan la opinión de
                    Goodsurfing.
                    <br />
                    <br />
                    8.2. Las valoraciones y opiniones realizadas por los Usuarios
                    deben ser veraces, comprensibles y fundamentadas, y no deben
                    contener expresiones calumniosas ni ofensivas.
                    <br />
                    <br />
                    8.3. Queda prohibido a los Usuarios manipular de cualquier
                    forma el sistema de Calificación y Opiniones, por ejemplo,
                    dando instrucciones a un tercero para que escriba una Opinión
                    positiva o negativa sobre otro Usuario.
                    <br />
                    <br />
                    8.4. Las Calificaciones y Opiniones forman parte del perfil
                    público del Usuario y también pueden mostrarse en otros lugares
                    de la Plataforma Goodsurfing (por ejemplo, en la página del
                    proyecto) junto con la información correspondiente.
                    <br />
                    <br />
                    8.5. Una vez creada una Opinión y asignada una Calificación, no
                    es posible modificarlas ni editarlas.
                    <br />
                    <br />
                    8.6. Las Opiniones que infrinjan el punto 5.5 serán eliminadas
                    sin notificación adicional.
                </p>
            </div>
            <div className={SECTION} id="9">
                <h2 className={TITLE}>
                    9. Daños causados en el marco del proyecto
                </h2>
                <p>
                    9.1. Goodsurfing no es responsable de los daños ni de las
                    acciones u omisiones de los Usuarios que surjan como
                    consecuencia de la interacción entre Usuarios. Goodsurfing
                    únicamente conecta a los Goodsurfers con los Hosts y
                    empleadores.
                    <br />
                    <br />
                    9.2. El Goodsurfer es responsable de dejar el lugar de
                    alojamiento del proyecto (incluidos cualesquiera bienes
                    personales u otros bienes que se encuentren en el lugar de
                    alojamiento) en el mismo estado en que se encontraba en el
                    momento de su llegada.
                </p>
            </div>
            <div className={SECTION} id="10">
                <h2 className={TITLE}>
                    10. Terminación del Acuerdo
                </h2>
                <div>
                    10.1. Goodsurfing puede rescindir el Acuerdo con el Usuario sin
                    previo aviso y/o restringir o prohibir el acceso a la
                    Plataforma Goodsurfing si:
                    <ul className={BULLETS}>
                        <li>
                            usted incumple de forma sustancial sus obligaciones en
                            virtud de las presentes u otras Condiciones;
                        </li>
                        <li>
                            usted infringe las leyes, normas o derechos de terceros;
                        </li>
                        <li>
                            usted proporciona información incompleta, desactualizada,
                            inexacta o fraudulenta durante el registro de la Cuenta
                            de Goodsurfing, o en el proceso de registro y publicación
                            del proyecto;
                        </li>
                        <li>
                            usted infringe la legislación vigente, las resoluciones
                            o los requerimientos judiciales, o de otro organismo
                            gubernamental o administrativo;
                        </li>
                        <li>
                            Goodsurfing considera que dichas acciones son necesarias
                            para proteger la seguridad personal o los bienes de
                            Goodsurfing, de sus Usuarios o de terceros (por ejemplo,
                            en caso de comportamiento fraudulento de un Usuario).
                        </li>
                    </ul>
                    10.2. En caso de infracciones no sustanciales, se le notificará
                    (si fuera necesario) y tendrá la posibilidad de resolver el
                    problema, o Goodsurfing introducirá las correcciones por su
                    cuenta.
                    <br />
                    <br />
                    10.3. En caso de terminación del Acuerdo, no tendrá derecho a
                    restablecer su Cuenta de Goodsurfing ni a acceder a sus
                    materiales.
                    <br />
                    <br />
                    10.4. Si su acceso a la Plataforma Goodsurfing está restringido,
                    su Cuenta de Goodsurfing está suspendida o nosotros hemos
                    dado por terminado el presente Acuerdo, no podrá registrar una
                    nueva cuenta en la Plataforma Goodsurfing.
                </div>
            </div>
            <div className={SECTION} id="11">
                <h2 className={TITLE}>11. Disposiciones especiales</h2>
                <p>
                    11.1. En caso de utilizar la Plataforma Goodsurfing o el
                    Contenido colectivo, lo hace voluntariamente y bajo su propio
                    riesgo. La Plataforma Goodsurfing y el Contenido colectivo se
                    proporcionan &quot;tal cual&quot; y sin ninguna garantía, expresa o
                    implícita.
                    <br />
                    <br />
                    11.2. Usted confirma que ha estudiado las Condiciones de
                    Goodsurfing, la legislación vigente, las normas y/o disposiciones
                    que puedan aplicarse a sus proyectos y a su actividad en la
                    Plataforma Goodsurfing.
                    <br />
                    <br />
                    11.3. Usted confirma que comprende y acepta voluntariamente
                    todos los posibles riesgos asociados a las condiciones indicadas
                    en la descripción de los proyectos en la Plataforma Goodsurfing.
                    Asume plena responsabilidad por su elección antes, durante y
                    después de participar en todas las actividades de los proyectos
                    de los Hosts.
                </p>
            </div>
            <div className={SECTION} id="12">
                <h2 className={TITLE}>12. Responsabilidad</h2>
                <p>
                    12.1. Los Usuarios de la Plataforma Goodsurfing no son
                    representantes de Goodsurfing, por lo que cualquier información
                    que proporcionen no constituye una posición oficial de
                    Goodsurfing.
                    <br />
                    <br />
                    12.2. Goodsurfing es una plataforma para la comunicación entre
                    Goodsurfers, Hosts y empleadores, por lo que Goodsurfing no es
                    responsable de ningún acuerdo alcanzado entre las partes tras
                    el primer contacto a través de la plataforma.
                    <br />
                    <br />
                    12.3. Cualquier acuerdo entre Usuarios celebrado fuera de la
                    plataforma (por ejemplo, ayuda económica, servicios o trabajo
                    adicional) depende únicamente del mutuo consentimiento de las
                    partes.
                    <br />
                    <br />
                    12.4. Goodsurfing no es responsable del robo ni de los daños
                    causados por los Usuarios durante la ejecución del proyecto,
                    subraya la importancia de acudir a las autoridades locales para
                    resolver las situaciones controvertidas, así como de informar
                    al equipo de Goodsurfing sobre cualquier incidente con el fin
                    de minimizar su repetición.
                    <br />
                    <br />
                    12.5. Goodsurfing no es responsable de la documentación personal
                    del Goodsurfer, del Host o del empleador, del seguro turístico o
                    médico, de los visados ni del cumplimiento de la legislación
                    local por parte de los Usuarios. La responsabilidad de preparar
                    su propia documentación recae en el Usuario.
                    <br />
                    <br />
                    12.6. El contenido de las Calificaciones, Opiniones,
                    comentarios, artículos, vídeos, podcasts u otros materiales
                    disponibles en la Plataforma Goodsurfing es creado por los
                    Usuarios de la comunidad y puede no reflejar las opiniones de
                    Goodsurfing.
                </p>
            </div>
            <div className={SECTION} id="13">
                <h2 className={TITLE}>
                    13. Comentarios y datos de la organización
                </h2>
                <div>
                    13.1. Valoramos y agradecemos las opiniones, comentarios y
                    sugerencias para mejorar la Plataforma Goodsurfing. Puede
                    enviarnos su opinión por correo electrónico a
                    support@goodsurfing.org, ponerse en contacto con nosotros a
                    través de nuestras redes sociales oficiales o por cualquier
                    otro medio que le resulte conveniente.
                    <br />
                    <br />
                    13.2. Cualquier opinión que nos envíe se considerará no
                    confidencial y no se tratará como su propiedad. Al enviar una
                    opinión, nos concede una licencia mundial, no exclusiva,
                    gratuita, irrevocable, sublicenciable y por tiempo indefinido
                    para utilizar y publicar gratuitamente estas ideas y materiales
                    con cualquier fin.
                    <br />
                    <br />
                    13.3. Datos de la organización:
                    <ul className={BULLETS}>
                        <li>
                            Nombre de la organización: Organización autónoma sin
                            ánimo de lucro “Centro de información para el desarrollo
                            del voluntariado “Goodsurfing – Viajes solidarios”.
                        </li>
                        <li>Fecha de registro: 20 de julio de 2018.</li>
                        <li>
                            Registrador: Inspección interdistrital n.º 18 del Servicio
                            Federal de Impuestos de la República de Tartaristán.
                        </li>
                        <li>
                            Director de la organización: director Popov Ilya
                            Alexandrovich.
                        </li>
                        <li>
                            Dirección jurídica de la ANO “Goodsurfing”: – 420043,
                            República de Tartaristán, ciudad de Kazán, calle
                            Boinichnaya, edificio 5, local 25.
                        </li>
                        <li>
                            La actividad principal es: “Actividad de prestación de
                            servicios de consultoría e información”; se han
                            registrado 5 actividades adicionales.
                        </li>
                        <li>INN 1655405070.</li>
                        <li>OGRN 1181690059682.</li>
                        <li>OKPO 31801426.</li>
                        <li>
                            Cuenta corriente 40703810207500000136Banco beneficiario
                            TOCHKA PAO BANKA &quot;FK OTKRITIE&quot;, ciudad de Moscú, BIK
                            044525999, cuenta correspondiente 30101810845250000999
                        </li>
                    </ul>
                </div>
            </div>
    
        </>
    ),
};
