// questionsData.js

const questionsData = {
    Novice: [
      {
        id: 'q1',
        question: 'Переживаєте за успіх в роботі?',
        options: [
          { label: 'Сильно', score: 5 },
          { label: 'Не дуже', score: 3 },
          { label: 'Спокійний', score: 2 }
        ]
      },
      {
        id: 'q2',
        question: 'Чи надаєте перевагу чітким інструкціям?',
        options: [
          { label: 'Завжди', score: 5 },
          { label: 'Іноді', score: 3 },
          { label: 'Ні', score: 2 }
        ]
      },
      {
        id: 'q3',
        question: 'Наскільки вам важлива стабільність?',
        options: [
          { label: 'Дуже', score: 5 },
          { label: 'Помірно', score: 3 },
          { label: 'Неважливо', score: 2 }
        ]
      },
      {
        id: 'q4',
        question: 'Чи звертаєте увагу на деталі?',
        options: [
          { label: 'Дуже уважний', score: 5 },
          { label: 'Іноді', score: 3 },
          { label: 'Рідко', score: 2 }
        ]
      }
    ],
    AdvancedBeginner: [
      {
        id: 'q5',
        question: 'Чи використовуєте власний досвід при вирішенні задач?',
        options: [
          { label: 'Зрідка', score: 5 },
          { label: 'Частково', score: 3 },
          { label: 'Ні', score: 2 }
        ]
      },
      {
        id: 'q6',
        question: 'Чи користуєтесь фіксованими правилами для вирішення задач?',
        options: [
          { label: 'Так', score: 5 },
          { label: 'В окремих випадках', score: 3 },
          { label: 'Ні', score: 2 }
        ]
      },
      {
        id: 'q7',
        question: 'Чи відчуваєте ви загальний контекст вирішення задачі?',
        options: [
          { label: 'Так', score: 5 },
          { label: 'Частково', score: 3 },
          { label: 'В окремих випадках', score: 2 }
        ]
      }
    ],
    Competent: [
      {
        id: 'q8',
        question: 'Чи можете ви побудувати модель вирішуваної задачі?',
        options: [
          { label: 'Так', score: 5 },
          { label: 'Не повністю', score: 3 },
          { label: 'В окремих випадках', score: 2 }
        ]
      },
      {
        id: 'q9',
        question: 'Чи вистачає вам ініціативи при вирішенні задач?',
        options: [
          { label: 'Так', score: 5 },
          { label: 'Зрідка', score: 3 },
          { label: 'Потрібне натхнення', score: 2 }
        ]
      },
      {
        id: 'q10',
        question: 'Чи можете вирішувати проблеми, з якими ще не стикались?',
        options: [
          { label: 'Так', score: 5 },
          { label: 'В окремих випадках', score: 3 },
          { label: 'Ні', score: 2 }
        ]
      }
    ],
    Proficient: [
      {
        id: 'q11',
        question: 'Чи необхідний вам весь контекст задачі?',
        options: [
          { label: 'Так', score: 5 },
          { label: 'В окремих деталях', score: 3 },
          { label: 'В загальному', score: 2 }
        ]
      },
      {
        id: 'q12',
        question: 'Чи переглядаєте ви свої наміри до вирішення задачі?',
        options: [
          { label: 'Так', score: 5 },
          { label: 'Зрідка', score: 3 },
          { label: 'Коли є потреба', score: 2 }
        ]
      },
      {
        id: 'q13',
        question: 'Чи здатні ви навчатись у інших?',
        options: [
          { label: 'Так', score: 5 },
          { label: 'Зрідка', score: 3 },
          { label: 'Коли є потреба', score: 2 }
        ]
      }
    ],
    Expert: [
      {
        id: 'q14',
        question: 'Чи обираєте ви нові методи своєї роботи?',
        options: [
          { label: 'Так', score: 5 },
          { label: 'Вибірково', score: 3 },
          { label: 'Вистачає досвіду', score: 2 }
        ]
      },
      {
        id: 'q15',
        question: 'Чи допомагає власна інтуїція при вирішенні задач?',
        options: [
          { label: 'Так', score: 5 },
          { label: 'Частково', score: 3 },
          { label: 'При емоційному напруженні', score: 2 }
        ]
      },
      {
        id: 'q16',
        question: 'Чи застосовуєте рішення задач за аналогією?',
        options: [
          { label: 'Часто', score: 5 },
          { label: 'Зрідка', score: 3 },
          { label: 'Тільки власний варіант', score: 2 }
        ]
      }
    ]
  };
  
  export default questionsData;
  