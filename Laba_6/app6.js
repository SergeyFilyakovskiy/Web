
class ExhibitionParticipant {
    constructor(id, companyName, country, email, productCount) {
        this.id = id;
        this.companyName = companyName;
        this.country = country;
        this.email = email;
        this.productCount = productCount;
        this.customProperties = {};
    }
    

    addCustomProperty(name, value) {
        this.customProperties[name] = value;
    }
    

    removeCustomProperty(name) {
        delete this.customProperties[name];
    }
    

    toObject() {
        return {
            id: this.id,
            companyName: this.companyName,
            country: this.country,
            email: this.email,
            productCount: this.productCount,
            customProperties: this.customProperties
        };
    }
}


class ExhibitionManager {
    constructor() {
        this.participants = [];
        this.availableCustomProperties = new Set();
        this.loadFromLocalStorage();
        this.initEventListeners();
        this.updateUI();
    }
    

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('exhibitionParticipants');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            this.participants = parsedData.map(item => {
                const participant = new ExhibitionParticipant(
                    item.id,
                    item.companyName,
                    item.country,
                    item.email,
                    item.productCount
                );
                
                if (item.customProperties) {
                    for (const [key, value] of Object.entries(item.customProperties)) {
                        participant.addCustomProperty(key, value);
                        this.availableCustomProperties.add(key);
                    }
                }
                
                return participant;
            });
        }
    }
    

    saveToLocalStorage() {
        const dataToSave = this.participants.map(participant => participant.toObject());
        localStorage.setItem('exhibitionParticipants', JSON.stringify(dataToSave));
    }
    

    generateNewId() {
        const maxId = this.participants.reduce((max, participant) => 
            participant.id > max ? participant.id : max, 0);
        return maxId + 1;
    }
    

    addParticipant(companyName, country, email, productCount) {
        const id = this.generateNewId();
        const newParticipant = new ExhibitionParticipant(id, companyName, country, email, productCount);
        this.participants.push(newParticipant);
        this.saveToLocalStorage();
        this.updateUI();
    }
    

    removeParticipant(id) {
        this.participants = this.participants.filter(participant => participant.id !== id);
        this.saveToLocalStorage();
        this.updateUI();
    }
    

    getParticipantById(id) {
        return this.participants.find(participant => participant.id === id);
    }
    

    addCustomPropertyToAll(name, defaultValue = '') {
        this.availableCustomProperties.add(name);
        this.participants.forEach(participant => {
            if (!participant.customProperties.hasOwnProperty(name)) {
                participant.addCustomProperty(name, defaultValue);
            }
        });
        this.saveToLocalStorage();
        this.updateUI();
    }
    

    removeCustomPropertyFromAll(name) {
        this.availableCustomProperties.delete(name);
        this.participants.forEach(participant => {
            participant.removeCustomProperty(name);
        });
        this.saveToLocalStorage();
        this.updateUI();
    }
    

    getCountriesSortedByProductCount() {
        const countryStats = {};
        
        this.participants.forEach(participant => {
            if (!countryStats[participant.country]) {
                countryStats[participant.country] = 0;
            }
            countryStats[participant.country] += participant.productCount;
        });
        
        return Object.entries(countryStats)
            .sort((a, b) => b[1] - a[1])
            .map(([country, count]) => `${country}: ${count} единиц продукции`);
    }
    

    updateUI() {
        this.updateTable();
        this.updateRecordDropdown();
        this.updatePropertyDropdown();
        this.updateDynamicFields();
        this.updateTableHeaders();
    }
    

    updateTable() {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';
        
        this.participants.forEach(participant => {
            const row = document.createElement('tr');
            

            row.innerHTML = `
                <td>${participant.id}</td>
                <td>${participant.companyName}</td>
                <td>${participant.country}</td>
                <td>${participant.email}</td>
                <td>${participant.productCount}</td>
            `;
            

            Array.from(this.availableCustomProperties).forEach(prop => {
                const cell = document.createElement('td');
                cell.textContent = participant.customProperties[prop] || '-';
                row.appendChild(cell);
            });
            
            tableBody.appendChild(row);
        });
    }
    

    updateRecordDropdown() {
        const recordIdSelect = document.getElementById('recordId');
        recordIdSelect.innerHTML = '';
        
        this.participants.forEach(participant => {
            const option = document.createElement('option');
            option.value = participant.id;
            option.textContent = `ID: ${participant.id} - ${participant.companyName}`;
            recordIdSelect.appendChild(option);
        });
    }
    

    updatePropertyDropdown() {
        const propertySelect = document.getElementById('propertySelect');
        propertySelect.innerHTML = '';
        
        this.availableCustomProperties.forEach(prop => {
            const option = document.createElement('option');
            option.value = prop;
            option.textContent = prop;
            propertySelect.appendChild(option);
        });
    }
    

    updateDynamicFields() {
        const dynamicFields = document.getElementById('dynamicFields');
        dynamicFields.innerHTML = '';
        
        this.availableCustomProperties.forEach(prop => {
            const group = document.createElement('div');
            group.className = 'form-group';
            
            const label = document.createElement('label');
            label.setAttribute('for', `prop_${prop}`);
            label.textContent = prop;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `prop_${prop}`;
            
            group.appendChild(label);
            group.appendChild(input);
            dynamicFields.appendChild(group);
        });
    }
    
    // Обновление заголовков таблицы
    updateTableHeaders() {
        const tableHead = document.querySelector('#exhibitionTable thead tr');
        
        // Удаляем старые пользовательские заголовки (оставляем первые 5)
        while (tableHead.children.length > 5) {
            tableHead.removeChild(tableHead.lastChild);
        }
        
        // Добавляем новые пользовательские заголовки
        this.availableCustomProperties.forEach(prop => {
            const th = document.createElement('th');
            th.textContent = prop;
            tableHead.appendChild(th);
        });
    }
    
    // Очистка формы
    clearForm() {
        document.getElementById('companyName').value = '';
        document.getElementById('country').value = '';
        document.getElementById('email').value = '';
        document.getElementById('productCount').value = '';
        
        this.availableCustomProperties.forEach(prop => {
            const input = document.getElementById(`prop_${prop}`);
            if (input) input.value = '';
        });
    }
    
    // Получение данных из формы
    getFormData() {
        const companyName = document.getElementById('companyName').value.trim();
        const country = document.getElementById('country').value.trim();
        const email = document.getElementById('email').value.trim();
        const productCount = parseInt(document.getElementById('productCount').value);
        
        if (!companyName || !country || !email || isNaN(productCount)) {
            alert('Пожалуйста, заполните все обязательные поля корректно!');
            return null;
        }
        
        const customProperties = {};
        this.availableCustomProperties.forEach(prop => {
            const input = document.getElementById(`prop_${prop}`);
            if (input) customProperties[prop] = input.value.trim();
        });
        
        return { companyName, country, email, productCount, customProperties };
    }
    
    // Инициализация обработчиков событий
    initEventListeners() {
        // Добавление новой записи
        document.getElementById('addBtn').addEventListener('click', () => {
            const formData = this.getFormData();
            if (formData) {
                const newParticipant = new ExhibitionParticipant(
                    this.generateNewId(),
                    formData.companyName,
                    formData.country,
                    formData.email,
                    formData.productCount
                );
                
                // Добавляем пользовательские свойства
                for (const [key, value] of Object.entries(formData.customProperties)) {
                    newParticipant.addCustomProperty(key, value);
                }
                
                this.participants.push(newParticipant);
                this.saveToLocalStorage();
                this.updateUI();
                this.clearForm();
            }
        });
        
        // Очистка формы
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearForm();
        });
        
        // Удаление записи
        document.getElementById('deleteBtn').addEventListener('click', () => {
            const recordId = parseInt(document.getElementById('recordId').value);
            if (!isNaN(recordId)) {
                this.removeParticipant(recordId);
            }
        });
        
        // Сортировка стран по количеству продукции
        document.getElementById('sortBtn').addEventListener('click', () => {
            const sortedCountries = this.getCountriesSortedByProductCount();
            const statsOutput = document.getElementById('statsOutput');
            
            if (sortedCountries.length > 0) {
                statsOutput.innerHTML = '<h3>Страны по количеству продукции:</h3>';
                const list = document.createElement('ul');
                sortedCountries.forEach(country => {
                    const item = document.createElement('li');
                    item.textContent = country;
                    list.appendChild(item);
                });
                statsOutput.appendChild(list);
            } else {
                statsOutput.innerHTML = '<p>Нет данных для отображения</p>';
            }
        });
        

        document.getElementById('addPropertyBtn').addEventListener('click', () => {
            const propertySelect = document.getElementById('newPropertySelect');
            const propertyValue = document.getElementById('newPropertyValue').value.trim();
            
            const propertyName = propertySelect.value;
            const displayName = propertySelect.options[propertySelect.selectedIndex].text;
            
            if (propertyValue) {
                this.addCustomPropertyToAll(propertyName, propertyValue);
                document.getElementById('newPropertyValue').value = '';
            } else {
                this.addCustomPropertyToAll(propertyName);
            }
        });
        
      
        document.getElementById('removePropertyBtn').addEventListener('click', () => {
            const propertySelect = document.getElementById('propertySelect');
            const propertyName = propertySelect.value;
            
            if (propertyName && this.availableCustomProperties.has(propertyName)) {
                this.removeCustomPropertyFromAll(propertyName);
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const exhibitionManager = new ExhibitionManager();
});