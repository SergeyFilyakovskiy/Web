class BlockManager {
    constructor() {
        this.blocks = new Map();
        this.currentBlockId = null;
        this.initData();
        this.initEventListeners(); 
    }


    initData() {

        this.texts = new Map([
            ['lorem', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.'],
            ['tech', 'Технологии меняют наш мир. Искусственный интеллект и машинное обучение становятся неотъемлемой частью нашей жизни.'],
            ['nature', 'Природа - это наш дом. Давайте беречь её для будущих поколений.'],
            ['business', 'Наш бизнес стремится к инновациям и качеству обслуживания клиентов.'],
            ['custom', '']
        ]);


        this.titles = new Map([
            ['welcome', 'Добро пожаловать'],
            ['about', 'О нас'],
            ['services', 'Наши услуги'],
            ['contact', 'Контакты'],
            ['custom', '']
        ]);


        this.links = new Map([
            ['nature', '#nature'],
            ['technology', '#tech'],
            ['city', '#city'],
            ['abstract', '#abstract'],
            ['space', '#space']
        ]);


        this.backgroundClasses = new Map([
            ['nature', 'nature-bg'],
            ['technology', 'technology-bg'],
            ['city', 'city-bg'],
            ['abstract', 'abstract-bg'],
            ['space', 'space-bg']
        ]);

        // Размеры блоков
        this.sizes = new Map([
            ['small', 'small'],
            ['medium', 'medium'],
            ['large', 'large'],
            ['extra-large', 'extra-large'],
            ['custom', 'custom']
        ]);

        // Позиционирование
        this.positions = new Map([
            ['static', 'static'],
            ['relative', 'relative'],
            ['absolute', 'absolute'],
            ['fixed', 'fixed'],
            ['sticky', 'sticky']
        ]);
    }

    // Инициализация обработчиков событий
    initEventListeners() {
        // Создание блока
        document.getElementById('createBtn').addEventListener('click', () => this.createBlock());

        // Обновление блока
        document.getElementById('updateBtn').addEventListener('click', () => this.updateBlock());

        // Очистка всех блоков
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAllBlocks());

        // Выбор блока для редактирования
        document.getElementById('blockSelector').addEventListener('change', (e) => this.selectBlock(e.target.value));

        // Показать/скрыть поле для пользовательского заголовка
        document.getElementById('blockTitle').addEventListener('change', (e) => {
            document.getElementById('customTitleRow').classList.toggle('hidden', e.target.value !== 'custom');
        });

        // Показать/скрыть поле для пользовательского текста
        document.getElementById('blockContent').addEventListener('change', (e) => {
            document.getElementById('customContentRow').classList.toggle('hidden', e.target.value !== 'custom');
        });
    }

    // Создание нового блока
    createBlock() {
        const id = `block-${Date.now()}`;
        const blockData = this.getFormData();

        // Создаем DOM-элемент блока
        const blockElement = this.createBlockElement(id, blockData);

        // Добавляем блок в контейнер
        document.getElementById('blocksContainer').appendChild(blockElement);

        // Сохраняем блок в Map
        this.blocks.set(id, {
            element: blockElement,
            data: blockData
        });

        // Обновляем список блоков
        this.updateBlockSelector();

        // Выбираем созданный блок
        this.selectBlock(id);
    }

    // Обновление существующего блока
    updateBlock() {
        if (!this.currentBlockId) return;

        const blockData = this.getFormData();
        const block = this.blocks.get(this.currentBlockId);

        if (block) {
            // Обновляем данные блока
            block.data = blockData;

            // Создаем новый элемент блока
            const newBlockElement = this.createBlockElement(this.currentBlockId, blockData);

            // Заменяем старый элемент на новый
            block.element.replaceWith(newBlockElement);

            // Обновляем ссылку на элемент в Map
            block.element = newBlockElement;
        }
    }

    // Удаление всех блоков
    clearAllBlocks() {
        this.blocks.forEach(block => {
            block.element.remove();
        });
        this.blocks.clear();
        this.updateBlockSelector();
        this.currentBlockId = null;
        document.getElementById('updateBtn').disabled = true;
    }

    // Выбор блока для редактирования
    selectBlock(id) {
        this.currentBlockId = id;
        document.getElementById('updateBtn').disabled = !id;

        if (!id) return;

        const block = this.blocks.get(id);
        if (block) {
            this.fillFormWithBlockData(block.data);
        }
    }

    // Получение данных из формы
    getFormData() {
        const size = document.getElementById('blockSize').value;
        const position = document.getElementById('blockPosition').value;
        const theme = document.getElementById('blockTheme').value;
        const titleType = document.getElementById('blockTitle').value;
        const contentType = document.getElementById('blockContent').value;

        // Получаем заголовок
        let title;
        if (titleType === 'custom') {
            title = document.getElementById('customTitle').value;
        } else {
            title = this.titles.get(titleType);
        }

        // Получаем содержимое
        let content;
        if (contentType === 'custom') {
            content = document.getElementById('customContent').value;
        } else {
            content = this.texts.get(contentType);
        }

        return {
            size,
            position,
            theme,
            title,
            content,
            link: this.links.get(theme)
        };
    }

    // Заполнение формы данными блока
    fillFormWithBlockData(data) {
        // Находим ключи по значениям
        const findKeyByValue = (map, value) => {
            for (const [key, val] of map.entries()) {
                if (val === value) return key;
            }
            return null;
        };

        // Устанавливаем размер
        const sizeKey = findKeyByValue(this.sizes, data.size);
        if (sizeKey) document.getElementById('blockSize').value = sizeKey;

        // Устанавливаем позиционирование
        const positionKey = findKeyByValue(this.positions, data.position);
        if (positionKey) document.getElementById('blockPosition').value = positionKey;

        // Устанавливаем тему
        document.getElementById('blockTheme').value = data.theme;

        // Проверяем, является ли заголовок пользовательским
        const titleKey = findKeyByValue(this.titles, data.title);
        if (titleKey) {
            document.getElementById('blockTitle').value = titleKey;
            document.getElementById('customTitleRow').classList.add('hidden');
        } else {
            document.getElementById('blockTitle').value = 'custom';
            document.getElementById('customTitle').value = data.title;
            document.getElementById('customTitleRow').classList.remove('hidden');
        }

        // Проверяем, является ли содержимое пользовательским
        const contentKey = findKeyByValue(this.texts, data.content);
        if (contentKey) {
            document.getElementById('blockContent').value = contentKey;
            document.getElementById('customContentRow').classList.add('hidden');
        } else {
            document.getElementById('blockContent').value = 'custom';
            document.getElementById('customContent').value = data.content;
            document.getElementById('customContentRow').classList.remove('hidden');
        }
    }

    // Создание DOM-элемента блока
    createBlockElement(id, data) {
        const block = document.createElement('div');
        block.id = id;
        block.className = `block ${this.sizes.get(data.size)} ${this.backgroundClasses.get(data.theme)}`;
        block.style.position = data.position;

        const blockContent = document.createElement('div');
        blockContent.className = 'block-content';

        const title = document.createElement('h2');
        title.className = 'block-title';
        title.textContent = data.title;

        const text = document.createElement('p');
        text.className = 'block-text';
        text.textContent = data.content;

        const link = document.createElement('a');
        link.className = 'block-link';
        link.href = data.link;
        link.textContent = 'Подробнее';

        blockContent.appendChild(title);
        blockContent.appendChild(text);
        blockContent.appendChild(link);
        block.appendChild(blockContent);

        // Добавляем обработчик клика для выбора блока
        block.addEventListener('click', () => {
            this.selectBlock(id);
            document.getElementById('blockSelector').value = id;
        });

        return block;
    }

    // Обновление выпадающего списка блоков
    updateBlockSelector() {
        const selector = document.getElementById('blockSelector');
        selector.innerHTML = '<option value="">Выберите блок для редактирования</option>';

        if (this.blocks.size === 0) {
            selector.disabled = true;
            return;
        }

        selector.disabled = false;

        this.blocks.forEach((block, id) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `Блок: ${block.data.title}`;
            selector.appendChild(option);
        });

        // Восстанавливаем выбранный блок, если он есть
        if (this.currentBlockId && this.blocks.has(this.currentBlockId)) {
            selector.value = this.currentBlockId;
        }
    }
}

// Функция для создания замыкания с привязкой контекста
const createBlockManager = (() => {
    let instance = null;

    return () => {
        if (!instance) {
            instance = new BlockManager();
        }
        return instance;
    };
})();

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const blockManager = createBlockManager();
    
    // Пример использования bind()
    const logBlockCount = function() {
        console.log(`Количество блоков: ${this.blocks.size}`);
    }.bind(blockManager);

    // Пример использования call() и apply()
    const showFirstBlockTitle = function(prefix) {
        if (this.blocks.size > 0) {
            const firstBlock = this.blocks.values().next().value;
            console.log(`${prefix}: ${firstBlock.data.title}`);
        }
    };

    // Вызываем с разными контекстами
    setTimeout(() => logBlockCount(), 1000);
    setTimeout(() => showFirstBlockTitle.call(blockManager, 'Первый блок'), 1500);
    setTimeout(() => showFirstBlockTitle.apply(blockManager, ['Заголовок первого блока']), 2000);
});