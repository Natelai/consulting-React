// Цей об'єкт імітує дані про кандидатів, які б повертав бекенд для кожної вакансії.
// Ключі (1, 2, 3, ...) відповідають порядковому номеру вакансії з вашого списку.

export const candidatesData = {
    1: [ // Оператор безпілотного літального апарата
        { id: 101, name: 'Олександр Петренко', match: 92, email: 'o.petrenko@email.com', phone: '+380501234567', skills: ['висока концентрація', 'швидка реакція', 'просторове мислення'] },
        { id: 102, name: 'Ірина Василенко', match: 88, email: 'i.vasylenko@email.com', phone: '+380671234568', skills: ['зорова пам\'ять', 'відповідальність', 'емоційна стійкість'] },
        { id: 103, name: 'Максим Іванчук', match: 85, email: 'm.ivanchuk@email.com', phone: '+380931234569', skills: ['аналітичне мислення', 'швидкість реакції', 'гнучкість мислення'] }
    ],
    2: [ // Оператор дронів
        { id: 201, name: 'Сергій Мельник', match: 91, email: 's.melnyk@email.com', phone: '+380957654321', skills: ['координація рухів', 'відповідальність', 'зорова пам\'ять'] },
        { id: 202, name: 'Анна Коваленко', match: 87, email: 'a.kovalenko@email.com', phone: '+380687654322', skills: ['швидка реакція', 'концентрація уваги', 'стресостійкість'] },
        { id: 203, name: 'Володимир Сидоренко', match: 84, email: 'v.sydorenko@email.com', phone: '+380637654323', skills: ['просторове мислення', 'емоційна стійкість', 'аналіз даних'] }
    ],
    3: [ // Диспетчер служби порятунку
        { id: 301, name: 'Наталія Бойко', match: 95, email: 'n.boyko@email.com', phone: '+380501112233', skills: ['емоційно-вольова стійкість', 'багатозадачність', 'швидке прийняття рішень'] },
        { id: 302, name: 'Тарас Шевчук', match: 90, email: 't.shevchuk@email.com', phone: '+380671112244', skills: ['концентрація уваги', 'комунікабельність', 'стресостійкість'] },
        { id: 303, name: 'Олена Лисенко', match: 88, email: 'o.lysenko@email.com', phone: '+380931112255', skills: ['відповідальність', 'чітка дикція', 'логічне мислення'] }
    ],
    4: [ // Інженер-електронік
        { id: 401, name: 'Ігор Пономаренко', match: 93, email: 'i.ponomarenko@email.com', phone: '+380998877665', skills: ['швидкість мислення', 'аналітичні здібності', 'увага до деталей'] },
        { id: 402, name: 'Марія Кравченко', match: 89, email: 'm.kravchenko@email.com', phone: '+380678877666', skills: ['концентрація уваги', 'технічне мислення', 'гнучкість мислення'] },
        { id: 403, name: 'Василь Захарченко', match: 86, email: 'v.zaharchenko@email.com', phone: '+380638877667', skills: ['вирішення проблем', 'знання схемотехніки', 'терпіння'] }
    ],
    5: [ // Водій-кур'єр
        { id: 501, name: 'Андрій Марченко', match: 94, email: 'a.marchenko@email.com', phone: '+380503344556', skills: ['координація рухів', 'пунктуальність', 'фізична витривалість'] },
        { id: 502, name: 'Світлана Ткаченко', match: 90, email: 's.tkachenko@email.com', phone: '+380673344557', skills: ['рухлива пам\'ять', 'орієнтація на місцевості', 'відповідальність'] }
    ],
    6: [ // Спеціаліст із забезпечення безпеки
        { id: 601, name: 'Роман Савченко', match: 92, email: 'r.savchenko@email.com', phone: '+380956677889', skills: ['відповідальність', 'спостережливість', 'концентрація уваги'] },
        { id: 602, name: 'Вікторія Руденко', match: 88, email: 'v.rudenko@email.com', phone: '+380976677890', skills: ['емоційно-вольова стійкість', 'уважність до дрібниць', 'аналіз ризиків'] },
        { id: 603, name: 'Іван Мороз', match: 85, email: 'i.moroz@email.com', phone: '+380636677891', skills: ['дисциплінованість', 'швидка реакція', 'витривалість'] }
    ],
    7: [ // Оператор спостереження
        { id: 701, name: 'Катерина Попова', match: 96, email: 'k.popova@email.com', phone: '+380509988776', skills: ['зорова пам\'ять', 'концентрація уваги', 'посидючість'] },
        { id: 702, name: 'Михайло Коваль', match: 91, email: 'm.koval@email.com', phone: '+380689988777', skills: ['відповідальність', 'аналітичний склад розуму', 'терпіння'] },
        { id: 703, name: 'Юлія Олійник', match: 87, email: 'y.oliynik@email.com', phone: '+380939988778', skills: ['увага до деталей', 'монотонна робота', 'зосередженість'] }
    ],
    8: [ // Рятувальник
        { id: 801, name: 'Олег Бондар', match: 94, email: 'o.bondar@email.com', phone: '+380991231234', skills: ['фізична витривалість', 'хоробрість', 'швидкість реакції'] },
        { id: 802, name: 'Дарина Павленко', match: 90, email: 'd.pavlenko@email.com', phone: '+380961231235', skills: ['емоційна стійкість', 'відповідальність', 'командна робота'] },
        { id: 803, name: 'Максим Гончаренко', match: 88, email: 'm.goncharenko@email.com', phone: '+380631231236', skills: ['перша медична допомога', 'сила', 'рішучість'] }
    ],
    9: [ // Інструктор з підготовки персоналу
        { id: 901, name: 'Віталій Семенюк', match: 93, email: 'v.semeniuk@email.com', phone: '+380502342345', skills: ['комунікабельність', 'рухлива пам\'ять', 'лідерські якості'] },
        { id: 902, name: 'Тетяна Мельник', match: 89, email: 't.melnyk@email.com', phone: '+380672342346', skills: ['гнучкість мислення', 'терпіння', 'відповідальність'] },
        { id: 903, name: 'Артем Поліщук', match: 86, email: 'a.polishchuk@email.com', phone: '+380932342347', skills: ['організаторські здібності', 'публічні виступи', 'мотивація'] }
    ],
    10: [ // Сапер
        { id: 1001, name: 'Юрій Клименко', match: 97, email: 'y.klymenko@email.com', phone: '+380993453456', skills: ['концентрація уваги', 'холоднокровність', 'емоційно-вольова стійкість'] },
        { id: 1002, name: 'Валентин Левченко', match: 92, email: 'v.levchenko@email.com', phone: '+380983453457', skills: ['швидкість мислення', 'точність рухів', 'відповідальність'] }
    ],
    11: [ // Аналітик даних для військових операцій
        { id: 1101, name: 'Анастасія Вовк', match: 95, email: 'a.vovk@email.com', phone: '+380504564567', skills: ['аналітичне мислення', 'швидкість мислення', 'робота з великими даними'] },
        { id: 1102, name: 'Кирило Нестеренко', match: 90, email: 'k.nesterenko@email.com', phone: '+380674564568', skills: ['зорова пам\'ять', 'концентрація уваги', 'гнучкість мислення'] },
        { id: 1103, name: 'Софія Мартинюк', match: 88, email: 's.martyniuk@email.com', phone: '+380634564569', skills: ['статистичний аналіз', 'виявлення патернів', 'посидючість'] }
    ],
    12: [ // Кандидати для вакансії "string"
        { id: 1201, name: 'Тестовий Кандидат', match: 50, email: 'test@test.com', phone: '+380000000000', skills: ['тестування', 'перевірка', 'заповнення'] }
    ]
};