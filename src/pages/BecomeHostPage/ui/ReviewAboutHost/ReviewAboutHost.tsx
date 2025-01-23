import React from "react";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Review, ReviewSlider } from "@/widgets/Review";

import mockedImage from "@/shared/assets/images/personalCardMOCK.png";
import { getProfileRolePageUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";

import styles from "./ReviewAboutHost.module.scss";

export const ReviewAboutHost = () => {
    const navigate = useNavigate();
    const { locale } = useLocale();

    const navigateClick = () => {
        navigate(getProfileRolePageUrl(locale));
    };

    const mockedReview: Review[] = [
        {
            image: mockedImage,
            text: "В хостеле все очень продумано для гостей: Полина заботится об окружающей среде, есть раздельный сбор мусора - что очень важно, особенно продвижение этого в массы. Вы даже можете воспользоваться общим шоппером. Позавтракать на балкончике, попивая кофе, сваренным в турке, с видом на утренний солнечный город (вам не придется везти и искать где-то посуду и т.д, здесь все есть в общем доступе). Всегда царит порядок. Следят за тишиной в вечернее время. В конце дня можно потусить в гостиной, поиграть компанией в настолки или залечь в гамаке в уютном внутреннем дворике или даже подняться на крышу, пить чай, наблюдая звездное небо. Время пролетело незаметно, отдохнула душой и перезагрузилась, наполнилась позитивными эмоциями, повстречала столько замечательных людей. Спасибо Полине за это чудеснейшее пространство, за возможность пожить в романтичном Севастополе. Patio = любовь.",
            title: "Сезон в Крыму начинается. Стань своим в нашем уютном хостеле:)",
            author: { name: "Мария Гуляева", avatar: mockedImage },
        },
        {
            image: mockedImage,
            text: "В хостеле все очень продумано для гостей: Полина заботится об окружающей среде, есть раздельный сбор мусора - что очень важно, особенно продвижение этого в массы. Вы даже можете воспользоваться общим шоппером. Позавтракать на балкончике, попивая кофе, сваренным в турке, с видом на утренний солнечный город (вам не придется везти и искать где-то посуду и т.д, здесь все есть в общем доступе). Всегда царит порядок. Следят за тишиной в вечернее время. В конце дня можно потусить в гостиной, поиграть компанией в настолки или залечь в гамаке в уютном внутреннем дворике или даже подняться на крышу, пить чай, наблюдая звездное небо. Время пролетело незаметно, отдохнула душой и перезагрузилась, наполнилась позитивными эмоциями, повстречала столько замечательных людей. Спасибо Полине за это чудеснейшее пространство, за возможность пожить в романтичном Севастополе. Patio = любовь.",
            title: "Сезон в Крыму начинается. Стань своим в нашем уютном хостеле:)",
            author: { name: "Мария Гуляева", avatar: mockedImage },
        },
        {
            image: mockedImage,
            text: "В хостеле все очень продумано для гостей: Полина заботится об окружающей среде, есть раздельный сбор мусора - что очень важно, особенно продвижение этого в массы. Вы даже можете воспользоваться общим шоппером. Позавтракать на балкончике, попивая кофе, сваренным в турке, с видом на утренний солнечный город (вам не придется везти и искать где-то посуду и т.д, здесь все есть в общем доступе). Всегда царит порядок. Следят за тишиной в вечернее время. В конце дня можно потусить в гостиной, поиграть компанией в настолки или залечь в гамаке в уютном внутреннем дворике или даже подняться на крышу, пить чай, наблюдая звездное небо. Время пролетело незаметно, отдохнула душой и перезагрузилась, наполнилась позитивными эмоциями, повстречала столько замечательных людей. Спасибо Полине за это чудеснейшее пространство, за возможность пожить в романтичном Севастополе. Patio = любовь.",
            title: "Сезон в Крыму начинается. Стань своим в нашем уютном хостеле:)",
            author: { name: "Мария Гуляева", avatar: mockedImage },
        },
    ];
    return (
        <div className={styles.wrapper}>
            <h2>Отзывы о хостах</h2>
            <ReviewSlider
                about="host"
                reviews={mockedReview}
                slidesPerView={1}
                slideClass={styles.slideClass}
            />
            <Button
                className={styles.button}
                color="BLUE"
                size="SMALL"
                variant="FILL"
                onClick={navigateClick}
            >
                Начните принимать волонтеров со всей России и мира
            </Button>
        </div>
    );
};
